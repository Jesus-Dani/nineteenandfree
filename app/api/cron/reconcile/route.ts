import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { confirmContributionPayment } from "@/lib/confirm-contribution";

/**
 * Nightly reconciliation (TRD Section 4): re-checks any contribution still
 * sitting in "pending" against Paystack directly, catching cases where a
 * payment succeeded on Paystack's side but the webhook never arrived.
 * Triggered by Vercel Cron (see vercel.json), authenticated via CRON_SECRET
 * so it can't be triggered by anyone who finds the URL.
 */
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return NextResponse.json({ error: "Reconciliation is not configured" }, { status: 500 });
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerSupabaseClient();

  // Only re-check contributions old enough that we're not racing a donor
  // still mid-checkout.
  const cutoff = new Date(Date.now() - 10 * 60 * 1000).toISOString();

  const { data: pending, error } = await supabase
    .from("contributions")
    .select("payment_reference")
    .eq("payment_status", "pending")
    .lt("created_at", cutoff);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const results = await Promise.allSettled(
    (pending ?? []).map((row) => confirmContributionPayment(row.payment_reference))
  );

  const summary = {
    checked: results.length,
    paid: results.filter((r) => r.status === "fulfilled" && r.value.status === "paid").length,
    stillPending: results.filter((r) => r.status === "fulfilled" && r.value.status === "pending").length,
    failed: results.filter((r) => r.status === "fulfilled" && r.value.status === "failed").length,
    errors: results.filter((r) => r.status === "rejected").length,
  };

  return NextResponse.json(summary);
}
