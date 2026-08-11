"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { randomUUID } from "crypto";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { initializeTransaction } from "@/lib/paystack";
import { getWishlistItemById } from "@/lib/wishlist";

export type GivingActionState = { error?: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function initializeGiving(
  _prevState: GivingActionState,
  formData: FormData
): Promise<GivingActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const amount = Number(formData.get("amount"));
  const itemId = formData.get("itemId") ? String(formData.get("itemId")) : null;
  const fund = formData.get("fund") ? String(formData.get("fund")) : null;

  if (!email || !EMAIL_PATTERN.test(email)) {
    return { error: "Please enter a valid email address — Paystack needs this to send your receipt." };
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    return { error: "Please enter a valid amount." };
  }
  if (!itemId && fund !== "general") {
    return { error: "Missing target for this contribution. Please start again from the Give page." };
  }

  let authorizationUrl: string;

  try {
    let targetItemId: string | null = null;

    if (itemId) {
      const item = await getWishlistItemById(itemId);
      if (!item) {
        return { error: "This item is no longer available. Please choose another." };
      }
      targetItemId = itemId;
    }

    const supabase = createServerSupabaseClient();
    const reference = randomUUID();

    const { error: insertError } = await supabase.from("contributions").insert({
      amount,
      currency: "NGN",
      target_type: itemId ? "item" : "general",
      target_item_id: targetItemId,
      payment_status: "pending",
      payment_reference: reference,
    });

    if (insertError) throw insertError;

    const headersList = await headers();
    const host = headersList.get("x-forwarded-host") ?? headersList.get("host") ?? "localhost:3000";
    const protocol = headersList.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");

    const result = await initializeTransaction({
      email,
      amountNaira: amount,
      reference,
      callbackUrl: `${protocol}://${host}/give/confirmation`,
      metadata: { target_type: itemId ? "item" : "general", target_item_id: targetItemId },
    });

    authorizationUrl = result.authorizationUrl;
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Something went wrong starting your payment. Please try again.",
    };
  }

  redirect(authorizationUrl);
}
