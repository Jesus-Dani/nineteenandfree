import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockVerifyTransaction, state } = vi.hoisted(() => {
  return {
    mockVerifyTransaction: vi.fn(),
    state: {
      callCount: 0,
      contributionRow: null as { id: string; amount: number; payment_status: string } | null,
      updateResult: { error: null as unknown },
    },
  };
});

vi.mock("@/lib/paystack", () => ({
  verifyTransaction: mockVerifyTransaction,
}));

vi.mock("@/lib/supabase/server", () => {
  function createMockBuilder(finalResult: unknown) {
    const builder: Record<string, unknown> = {};
    builder.select = vi.fn(() => builder);
    builder.update = vi.fn(() => builder);
    builder.eq = vi.fn(() => builder);
    builder.maybeSingle = vi.fn(() => Promise.resolve(finalResult));
    builder.then = (resolve: (v: unknown) => void, reject?: (e: unknown) => void) =>
      Promise.resolve(finalResult).then(resolve, reject);
    return builder;
  }

  return {
    createServerSupabaseClient: () => ({
      from: vi.fn(() => {
        // confirmContributionPayment always does the select-by-reference
        // lookup first, then (only if it proceeds to update) the update
        // call — so the Nth call to .from() maps predictably to which
        // mocked result should come back.
        state.callCount++;
        if (state.callCount === 1) {
          return createMockBuilder({ data: state.contributionRow, error: null });
        }
        return createMockBuilder(state.updateResult);
      }),
    }),
  };
});

import { confirmContributionPayment } from "./confirm-contribution";

beforeEach(() => {
  state.callCount = 0;
  state.contributionRow = null;
  state.updateResult = { error: null };
  mockVerifyTransaction.mockReset();
});

describe("confirmContributionPayment", () => {
  it("returns not-found when no contribution matches the reference", async () => {
    const result = await confirmContributionPayment("ref-missing");
    expect(result).toEqual({ status: "not-found" });
    expect(mockVerifyTransaction).not.toHaveBeenCalled();
  });

  it("returns already-paid without re-verifying against Paystack when already marked paid", async () => {
    state.contributionRow = { id: "c1", amount: 1000, payment_status: "paid" };
    const result = await confirmContributionPayment("ref-paid");
    expect(result).toEqual({ status: "already-paid", contributionId: "c1" });
    // Idempotency: a second webhook/reconciliation pass for an already-paid
    // contribution must never re-hit Paystack or re-process the payment.
    expect(mockVerifyTransaction).not.toHaveBeenCalled();
  });

  it("marks a pending contribution paid when Paystack confirms success and the amount matches", async () => {
    state.contributionRow = { id: "c2", amount: 5000, payment_status: "pending" };
    mockVerifyTransaction.mockResolvedValue({
      status: "success",
      reference: "ref-ok",
      amountNaira: 5000,
      currency: "NGN",
      email: "donor@example.com",
    });

    const result = await confirmContributionPayment("ref-ok");

    expect(result).toEqual({ status: "paid", contributionId: "c2" });
  });

  it("flags a mismatch instead of trusting a verified amount that disagrees with what was recorded", async () => {
    state.contributionRow = { id: "c3", amount: 5000, payment_status: "pending" };
    mockVerifyTransaction.mockResolvedValue({
      status: "success",
      reference: "ref-mismatch",
      amountNaira: 1, // deliberately different from the recorded 5000
      currency: "NGN",
      email: "donor@example.com",
    });

    const result = await confirmContributionPayment("ref-mismatch");

    expect(result).toEqual({ status: "mismatch" });
  });

  it("returns failed when Paystack reports the charge failed or was abandoned", async () => {
    state.contributionRow = { id: "c4", amount: 2000, payment_status: "pending" };
    mockVerifyTransaction.mockResolvedValue({
      status: "abandoned",
      reference: "ref-abandoned",
      amountNaira: 2000,
      currency: "NGN",
      email: null,
    });

    const result = await confirmContributionPayment("ref-abandoned");

    expect(result).toEqual({ status: "failed" });
  });

  it("returns pending when Paystack hasn't resolved the charge yet", async () => {
    state.contributionRow = { id: "c5", amount: 2000, payment_status: "pending" };
    mockVerifyTransaction.mockResolvedValue({
      status: "pending",
      reference: "ref-pending",
      amountNaira: 2000,
      currency: "NGN",
      email: null,
    });

    const result = await confirmContributionPayment("ref-pending");

    expect(result).toEqual({ status: "pending" });
  });
});
