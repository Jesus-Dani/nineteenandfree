import { createServerSupabaseClient } from "@/lib/supabase/server";

export type DeleteContributionResult = { ok: true } | { ok: false; error: string };

export type AdminContributionRow = {
  id: string;
  contributorContact: string | null;
  amount: number;
  currency: string;
  targetLabel: string; // "General Outreach Fund" or "<item name> (<category>)"
  paymentStatus: string;
  braceletRequested: boolean;
  braceletContact: string | null; // phone, falling back to whatsapp
  createdAt: string;
};

type ContributionQueryRow = {
  id: string;
  contributor_contact: string | null;
  amount: number;
  currency: string;
  target_type: string;
  payment_status: string;
  created_at: string;
  wishlist_items: { name: string; category: string } | null;
  bracelet_requests: { interested: boolean; phone: string | null; whatsapp: string | null }[] | null;
};

/** Admin-only view joining contributions with their item and bracelet request, if any. */
export async function getContributionsForAdmin(): Promise<AdminContributionRow[]> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("contributions")
    .select(
      `id, contributor_contact, amount, currency, target_type, payment_status, created_at,
       wishlist_items ( name, category ),
       bracelet_requests ( interested, phone, whatsapp )`
    )
    .order("created_at", { ascending: false });

  if (error) throw error;

  return ((data ?? []) as unknown as ContributionQueryRow[]).map((row) => {
    const bracelet = row.bracelet_requests?.[0];
    return {
      id: row.id,
      contributorContact: row.contributor_contact,
      amount: Number(row.amount),
      currency: row.currency,
      targetLabel: row.wishlist_items
        ? `${row.wishlist_items.name} (${row.wishlist_items.category})`
        : "General Outreach Fund",
      paymentStatus: row.payment_status,
      braceletRequested: bracelet?.interested ?? false,
      braceletContact: bracelet?.interested ? bracelet.phone || bracelet.whatsapp || null : null,
      createdAt: row.created_at,
    };
  });
}

/**
 * Deletes a contribution (e.g. a test transaction). Handles the same
 * foreign-key relationships as the manual cleanup SQL used earlier this
 * project: bracelet_requests.contribution_id is required, so any linked
 * request is removed; messages.contribution_id is optional, so a linked
 * Letter of Love is unlinked (kept) rather than deleted.
 */
export async function deleteContribution(id: string): Promise<DeleteContributionResult> {
  const supabase = createServerSupabaseClient();

  const { error: unlinkError } = await supabase
    .from("messages")
    .update({ contribution_id: null })
    .eq("contribution_id", id);
  if (unlinkError) return { ok: false, error: "Failed to unlink related Letters of Love messages." };

  const { error: braceletError } = await supabase.from("bracelet_requests").delete().eq("contribution_id", id);
  if (braceletError) return { ok: false, error: "Failed to remove the related bracelet request." };

  const { error } = await supabase.from("contributions").delete().eq("id", id);
  if (error) return { ok: false, error: "Failed to delete the contribution." };

  return { ok: true };
}
