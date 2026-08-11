import { createServerSupabaseClient } from "@/lib/supabase/server";

export type SubmitBraceletInput = {
  contributionId: string;
  interested: boolean;
  name?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  size?: "Small" | "Medium" | "Large" | null;
  gender?: "Male" | "Female" | null;
};

export type SubmitBraceletResult = { ok: true } | { ok: false; error: string };

/**
 * No RUN-student verification field exists anywhere (TRD Section 3) —
 * eligibility is self-enforced via the informational note in the UI, not a
 * captured/checked field. Only populate the detail fields when interested;
 * a "not interested" response stores nothing else (matches the DB constraint
 * added in supabase/migrations/0002_bracelet_contribution_required.sql's
 * companion check in 0001_init.sql).
 */
export async function submitBraceletResponse(input: SubmitBraceletInput): Promise<SubmitBraceletResult> {
  if (input.interested) {
    if (!input.name?.trim() || !input.phone?.trim() || !input.size || !input.gender) {
      return { ok: false, error: "Please fill in name, phone, size, and gender." };
    }
  }

  const supabase = createServerSupabaseClient();

  const { error } = await supabase.from("bracelet_requests").insert({
    contribution_id: input.contributionId,
    interested: input.interested,
    name: input.interested ? input.name!.trim() : null,
    phone: input.interested ? input.phone!.trim() : null,
    whatsapp: input.interested ? input.whatsapp?.trim() || null : null,
    size: input.interested ? input.size : null,
    gender: input.interested ? input.gender : null,
    fulfillment_status: "pending",
  });

  if (error) throw error;

  return { ok: true };
}
