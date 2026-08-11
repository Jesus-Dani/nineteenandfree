import { createServerSupabaseClient } from "@/lib/supabase/server";

export type WishlistItemProgress = {
  id: string;
  category: string;
  name: string;
  description: string | null;
  unitCost: number;
  totalRaised: number;
  unitsFunded: number;
  /** Amount already given toward the next (not-yet-complete) unit. */
  nextUnitRaised: number;
  /** Remaining amount needed to complete the next unit. */
  nextUnitRemaining: number;
};

// Canonical display order per PRD Section 5.1. Any further admin-added
// categories are appended after these, in the order they're encountered.
const CATEGORY_ORDER = [
  "Bibles",
  "Children's Books",
  "Teen/Young Adult Books",
  "Educational Materials",
  "Overall Outreach",
];

function computeProgress(
  item: { id: string; category: string; name: string; description: string | null; unit_cost: number },
  totalRaised: number
): WishlistItemProgress {
  const unitCost = Number(item.unit_cost);
  const unitsFunded = Math.floor(totalRaised / unitCost);
  const nextUnitRaised = Math.round((totalRaised - unitsFunded * unitCost) * 100) / 100;

  return {
    id: item.id,
    category: item.category,
    name: item.name,
    description: item.description,
    unitCost,
    totalRaised,
    unitsFunded,
    nextUnitRaised,
    nextUnitRemaining: Math.round((unitCost - nextUnitRaised) * 100) / 100,
  };
}

/** Live wishlist catalogue, grouped by category, with rolling-unit progress computed from paid contributions. */
export async function getWishlistCatalogue(): Promise<Map<string, WishlistItemProgress[]>> {
  const supabase = createServerSupabaseClient();

  const [{ data: items, error: itemsError }, { data: paidContributions, error: contribError }] =
    await Promise.all([
      supabase
        .from("wishlist_items")
        .select("id, category, name, description, unit_cost")
        .eq("status", "active")
        .order("created_at", { ascending: true }),
      supabase
        .from("contributions")
        .select("target_item_id, amount")
        .eq("target_type", "item")
        .eq("payment_status", "paid"),
    ]);

  if (itemsError) throw itemsError;
  if (contribError) throw contribError;

  const totalsByItem = new Map<string, number>();
  for (const row of paidContributions ?? []) {
    if (!row.target_item_id) continue;
    totalsByItem.set(row.target_item_id, (totalsByItem.get(row.target_item_id) ?? 0) + Number(row.amount));
  }

  const grouped = new Map<string, WishlistItemProgress[]>();
  for (const item of items ?? []) {
    const progress = computeProgress(item, totalsByItem.get(item.id) ?? 0);
    const bucket = grouped.get(item.category) ?? [];
    bucket.push(progress);
    grouped.set(item.category, bucket);
  }

  // Reorder categories: canonical order first, then any others in first-seen order.
  const ordered = new Map<string, WishlistItemProgress[]>();
  for (const category of CATEGORY_ORDER) {
    if (grouped.has(category)) {
      ordered.set(category, grouped.get(category)!);
      grouped.delete(category);
    }
  }
  for (const [category, itemsInCategory] of grouped) {
    ordered.set(category, itemsInCategory);
  }

  return ordered;
}

export async function getWishlistItemById(id: string): Promise<WishlistItemProgress | null> {
  const supabase = createServerSupabaseClient();

  const { data: item, error: itemError } = await supabase
    .from("wishlist_items")
    .select("id, category, name, description, unit_cost")
    .eq("id", id)
    .eq("status", "active")
    .maybeSingle();

  if (itemError) throw itemError;
  if (!item) return null;

  const { data: paidContributions, error: contribError } = await supabase
    .from("contributions")
    .select("amount")
    .eq("target_type", "item")
    .eq("target_item_id", id)
    .eq("payment_status", "paid");

  if (contribError) throw contribError;

  const totalRaised = (paidContributions ?? []).reduce((sum, row) => sum + Number(row.amount), 0);
  return computeProgress(item, totalRaised);
}
