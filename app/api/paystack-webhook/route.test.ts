import { describe, it, expect, vi, beforeEach } from "vitest";
import { createHmac } from "crypto";

const { mockConfirm } = vi.hoisted(() => ({ mockConfirm: vi.fn() }));

vi.mock("@/lib/confirm-contribution", () => ({
  confirmContributionPayment: mockConfirm,
}));

import { POST } from "./route";

const SECRET = "test-paystack-secret";

function sign(body: string): string {
  return createHmac("sha512", SECRET).update(body).digest("hex");
}

function makeRequest(body: string, signature?: string) {
  const headers = new Headers();
  if (signature !== undefined) headers.set("x-paystack-signature", signature);
  // NextRequest is a superset of the standard Request the route actually
  // uses (.text() / .headers.get()); a plain Request covers what POST() calls.
  return new Request("https://example.com/api/paystack-webhook", {
    method: "POST",
    body,
    headers,
  }) as unknown as Parameters<typeof POST>[0];
}

beforeEach(() => {
  process.env.PAYSTACK_SECRET_KEY = SECRET;
  mockConfirm.mockReset();
  mockConfirm.mockResolvedValue({ status: "paid", contributionId: "c1" });
});

describe("POST /api/paystack-webhook", () => {
  it("accepts a correctly signed charge.success event and reconciles the reference", async () => {
    const body = JSON.stringify({ event: "charge.success", data: { reference: "ref-1" } });

    const res = await POST(makeRequest(body, sign(body)));

    expect(res.status).toBe(200);
    expect(mockConfirm).toHaveBeenCalledWith("ref-1");
  });

  it("rejects a body that was tampered with after signing (this is the exact mistake the raw-body hashing rule guards against)", async () => {
    const originalBody = JSON.stringify({ event: "charge.success", data: { reference: "ref-1" } });
    const signatureForOriginal = sign(originalBody);
    const tamperedBody = JSON.stringify({
      event: "charge.success",
      data: { reference: "ref-1", amount: 999999999 },
    });

    const res = await POST(makeRequest(tamperedBody, signatureForOriginal));

    expect(res.status).toBe(401);
    expect(mockConfirm).not.toHaveBeenCalled();
  });

  it("rejects a request with no signature header at all", async () => {
    const body = JSON.stringify({ event: "charge.success", data: { reference: "ref-1" } });

    const res = await POST(makeRequest(body));

    expect(res.status).toBe(401);
    expect(mockConfirm).not.toHaveBeenCalled();
  });

  it("rejects a garbage/forged signature", async () => {
    const body = JSON.stringify({ event: "charge.success", data: { reference: "ref-1" } });

    const res = await POST(makeRequest(body, "00".repeat(64)));

    expect(res.status).toBe(401);
    expect(mockConfirm).not.toHaveBeenCalled();
  });

  it("acknowledges but ignores events that aren't charge.success", async () => {
    const body = JSON.stringify({ event: "charge.failed", data: { reference: "ref-1" } });

    const res = await POST(makeRequest(body, sign(body)));

    expect(res.status).toBe(200);
    expect(mockConfirm).not.toHaveBeenCalled();
  });
});
