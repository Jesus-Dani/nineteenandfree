import { createServerSupabaseClient } from "@/lib/supabase/server";
import { verifyTransaction } from "@/lib/paystack";

export type ConfirmResult =
  | { status: "already-paid"; contributionId: string }
  | { status: "paid"; contributionId: string }
  | { status: "not-found" }
  | { status: "pending" }
  | { status: "failed" }
  | { status: "mismatch" };

/**
 * Independently verifies a transaction against Paystack and, if genuinely
 * successful, marks the matching contribution as paid. Idempotent and safe
 * to call from both the confirmation page and the webhook handler for the
 * same reference without double-processing (TRD Section 4 — layered
 * verification, never trust a single source blindly).
 */
export async function confirmContributionPayment(reference: string): Promise<ConfirmResult> {
  const supabase = createServerSupabaseClient();

  const { data: contribution, error } = await supabase
    .from("contributions")
    .select("id, amount, payment_status")
    .eq("payment_reference", reference)
    .maybeSingle();

  if (error) throw error;
  if (!contribution) return { status: "not-found" };
  if (contribution.payment_status === "paid") {
    return { status: "already-paid", contributionId: contribution.id };
  }

  const verification = await verifyTransaction(reference);

  if (verification.status !== "success") {
    return verification.status === "abandoned" || verification.status === "failed"
      ? { status: "failed" }
      : { status: "pending" };
  }

  // Amount safety check — never trust the verified payload blindly against
  // what we recorded when the transaction was initialized.
  if (Math.abs(verification.amountNaira - Number(contribution.amount)) > 0.5) {
    return { status: "mismatch" };
  }

  const { error: updateError } = await supabase
    .from("contributions")
    .update({ payment_status: "paid" })
    .eq("id", contribution.id)
    .eq("payment_status", "pending"); // guards against a double-update race with the webhook

  if (updateError) throw updateError;

  return { status: "paid", contributionId: contribution.id };
}
