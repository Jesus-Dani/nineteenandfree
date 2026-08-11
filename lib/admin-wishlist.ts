import { createServerSupabaseClient } from "@/lib/supabase/server";

export type WishlistItemInput = {
  category: string;
  name: string;
  description: string | null;
  unitCost: number;
};

export type WishlistMutationResult = { ok: true } | { ok: false; error: string };

function validate(input: WishlistItemInput): string | null {
  if (!input.category.trim()) return "Please choose or enter a category.";
  if (!input.name.trim()) return "Please enter a name.";
  if (!Number.isFinite(input.unitCost) || input.unitCost <= 0) return "Please enter a valid unit cost.";
  return null;
}

export async function createItem(input: WishlistItemInput): Promise<WishlistMutationResult> {
  const validationError = validate(input);
  if (validationError) return { ok: false, error: validationError };

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("wishlist_items").insert({
    category: input.category.trim(),
    name: input.name.trim(),
    description: input.description?.trim() || null,
    unit_cost: input.unitCost,
    status: "active",
  });

  if (error) throw error;
  return { ok: true };
}

export async function updateItem(id: string, input: WishlistItemInput): Promise<WishlistMutationResult> {
  const validationError = validate(input);
  if (validationError) return { ok: false, error: validationError };

  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from("wishlist_items")
    .update({
      category: input.category.trim(),
      name: input.name.trim(),
      description: input.description?.trim() || null,
      unit_cost: input.unitCost,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
  return { ok: true };
}

export async function setItemStatus(id: string, status: "active" | "archived"): Promise<void> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from("wishlist_items")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
}

/**
 * A real delete. contributions.target_item_id references this table with the
 * default RESTRICT behavior, so Postgres already refuses to delete an item
 * that has contributions tied to it — we just surface that as a friendly
 * message instead of a raw DB error.
 */
export async function deleteItem(id: string): Promise<WishlistMutationResult> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("wishlist_items").delete().eq("id", id);

  if (error) {
    if (error.code === "23503") {
      return {
        ok: false,
        error: "This item has contributions tied to it and can't be deleted — archive it instead.",
      };
    }
    throw error;
  }

  return { ok: true };
}
