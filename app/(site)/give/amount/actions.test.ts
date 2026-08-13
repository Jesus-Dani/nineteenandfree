import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockGetGiveFlowEnabled } = vi.hoisted(() => ({ mockGetGiveFlowEnabled: vi.fn() }));

vi.mock("@/lib/site-settings", () => ({
  getGiveFlowEnabled: mockGetGiveFlowEnabled,
}));

// Not exercised by the validation-only cases below (they all return before
// reaching this code), but the module import chain still needs these to resolve.
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("next/headers", () => ({ headers: vi.fn(async () => new Headers()) }));
vi.mock("@/lib/supabase/server", () => ({ createServerSupabaseClient: vi.fn() }));
vi.mock("@/lib/paystack", () => ({ initializeTransaction: vi.fn() }));
vi.mock("@/lib/wishlist", () => ({ getWishlistItemById: vi.fn() }));

import { initializeGiving } from "./actions";

function formData(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) fd.set(key, value);
  return fd;
}

beforeEach(() => {
  mockGetGiveFlowEnabled.mockResolvedValue(true);
});

describe("initializeGiving validation", () => {
  it("rejects an invalid email address", async () => {
    const result = await initializeGiving(
      {},
      formData({ email: "not-an-email", amount: "1000", fund: "general" })
    );
    expect(result.error).toMatch(/valid email/i);
  });

  it("rejects a zero amount", async () => {
    const result = await initializeGiving({}, formData({ email: "a@b.com", amount: "0", fund: "general" }));
    expect(result.error).toMatch(/valid amount/i);
  });

  it("rejects a negative amount", async () => {
    const result = await initializeGiving({}, formData({ email: "a@b.com", amount: "-500", fund: "general" }));
    expect(result.error).toMatch(/valid amount/i);
  });

  it("rejects a non-numeric amount", async () => {
    const result = await initializeGiving({}, formData({ email: "a@b.com", amount: "abc", fund: "general" }));
    expect(result.error).toMatch(/valid amount/i);
  });

  it("rejects when neither a specific item nor the general fund is specified", async () => {
    const result = await initializeGiving({}, formData({ email: "a@b.com", amount: "1000" }));
    expect(result.error).toMatch(/missing target/i);
  });

  it("rejects new contributions once the admin has closed giving", async () => {
    mockGetGiveFlowEnabled.mockResolvedValue(false);
    const result = await initializeGiving(
      {},
      formData({ email: "a@b.com", amount: "1000", fund: "general" })
    );
    expect(result.error).toMatch(/closed/i);
  });
});
