import { createServerSupabaseClient } from "@/lib/supabase/server";

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
