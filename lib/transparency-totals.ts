import { createServerSupabaseClient } from "@/lib/supabase/server";

export type TransparencyTotals = {
  designatedTotal: number;
  generalTotal: number;
  overallTotal: number;
};

/** Live totals for paid contributions, split by designated (item) vs. general fund giving. */
export async function getTransparencyTotals(): Promise<TransparencyTotals> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("contributions")
    .select("target_type, amount")
    .eq("payment_status", "paid");

  if (error) throw error;

  let designatedTotal = 0;
  let generalTotal = 0;

  for (const row of data ?? []) {
    if (row.target_type === "item") {
      designatedTotal += Number(row.amount);
    } else if (row.target_type === "general") {
      generalTotal += Number(row.amount);
    }
  }

  return {
    designatedTotal,
    generalTotal,
    overallTotal: designatedTotal + generalTotal,
  };
}
