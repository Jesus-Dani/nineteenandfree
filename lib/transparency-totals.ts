import { createServerSupabaseClient } from "@/lib/supabase/server";

export type TransparencyTotals = {
  designatedTotal: number;
  generalTotal: number;
  overallTotal: number;
};

/**
 * Live totals for paid contributions, split by designated (item) vs. general
 * fund giving. General also includes manually-logged "income" entries from
 * the admin Ledger (e.g. cash gifts collected in person, outside Paystack) —
 * same convention already used by lib/ledger.ts's getLedgerSummary(), kept
 * consistent here so the public Transparency figure matches what the admin
 * ledger considers "raised."
 */
export async function getTransparencyTotals(): Promise<TransparencyTotals> {
  const supabase = createServerSupabaseClient();

  const [{ data: contributions, error: contribError }, { data: ledgerRows, error: ledgerError }] =
    await Promise.all([
      supabase.from("contributions").select("target_type, amount").eq("payment_status", "paid"),
      supabase.from("outreach_fund_ledger").select("amount").eq("type", "income"),
    ]);

  if (contribError) throw contribError;
  if (ledgerError) throw ledgerError;

  let designatedTotal = 0;
  let generalTotal = 0;

  for (const row of contributions ?? []) {
    if (row.target_type === "item") {
      designatedTotal += Number(row.amount);
    } else if (row.target_type === "general") {
      generalTotal += Number(row.amount);
    }
  }

  for (const row of ledgerRows ?? []) {
    generalTotal += Number(row.amount);
  }

  return {
    designatedTotal,
    generalTotal,
    overallTotal: designatedTotal + generalTotal,
  };
}
