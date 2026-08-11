import { createServerSupabaseClient } from "@/lib/supabase/server";

export type LedgerEntry = {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string | null;
  description: string | null;
  date: string;
};

export type LedgerSummary = {
  totalRaised: number;
  totalSpent: number;
  balance: number;
};

/**
 * "Total raised" = paid Give-flow contributions (already tracked in
 * `contributions`) plus any manually-logged income rows (e.g. cash gifts
 * collected in person, outside Paystack). "Total spent" = expense rows.
 * Nothing here is hard-coded — both halves are always summed live.
 */
export async function getLedgerSummary(): Promise<LedgerSummary> {
  const supabase = createServerSupabaseClient();

  const [{ data: contributions, error: contribError }, { data: ledgerRows, error: ledgerError }] =
    await Promise.all([
      supabase.from("contributions").select("amount").eq("payment_status", "paid"),
      supabase.from("outreach_fund_ledger").select("type, amount"),
    ]);

  if (contribError) throw contribError;
  if (ledgerError) throw ledgerError;

  const contributionsTotal = (contributions ?? []).reduce((sum, row) => sum + Number(row.amount), 0);

  let manualIncome = 0;
  let totalSpent = 0;
  for (const row of ledgerRows ?? []) {
    if (row.type === "income") manualIncome += Number(row.amount);
    else if (row.type === "expense") totalSpent += Number(row.amount);
  }

  const totalRaised = contributionsTotal + manualIncome;

  return { totalRaised, totalSpent, balance: totalRaised - totalSpent };
}

export async function getLedgerEntries(): Promise<LedgerEntry[]> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("outreach_fund_ledger")
    .select("id, type, amount, category, description, date")
    .order("date", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    type: row.type as "income" | "expense",
    amount: Number(row.amount),
    category: row.category,
    description: row.description,
    date: row.date,
  }));
}

export type AddLedgerEntryInput = {
  type: "income" | "expense";
  amount: number;
  category: string | null;
  description: string | null;
  date: string;
};

export type LedgerMutationResult = { ok: true } | { ok: false; error: string };

export async function addLedgerEntry(input: AddLedgerEntryInput): Promise<LedgerMutationResult> {
  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    return { ok: false, error: "Please enter a valid amount." };
  }
  if (!input.date) {
    return { ok: false, error: "Please choose a date." };
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("outreach_fund_ledger").insert({
    type: input.type,
    amount: input.amount,
    category: input.category?.trim() || null,
    description: input.description?.trim() || null,
    date: input.date,
  });

  if (error) throw error;
  return { ok: true };
}
