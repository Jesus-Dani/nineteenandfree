import { randomUUID } from "crypto";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type WishlistItemInput = {
  category: string;
  name: string;
  description: string | null;
  unitCost: number;
  /** Undefined = leave the existing image alone; null = explicitly no image. */
  imageUrl?: string | null;
};

export type WishlistMutationResult = { ok: true } | { ok: false; error: string };

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

function validate(input: WishlistItemInput): string | null {
  if (!input.category.trim()) return "Please choose or enter a category.";
  if (!input.name.trim()) return "Please enter a name.";
  if (!Number.isFinite(input.unitCost) || input.unitCost <= 0) return "Please enter a valid unit cost.";
  return null;
}

export type UploadImageResult = { ok: true; url: string } | { ok: false; error: string };

/** Uploads to the public wishlist-images bucket (supabase/migrations/0004_wishlist_images.sql). */
export async function uploadWishlistImage(file: File): Promise<UploadImageResult> {
  if (!file.type.startsWith("image/")) {
    return { ok: false, error: "Please upload an image file." };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, error: "Image must be under 5MB." };
  }

  const supabase = createServerSupabaseClient();
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
  const path = `${randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("wishlist-images")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) {
    return { ok: false, error: "Failed to upload image. Please try again." };
  }

  const { data } = supabase.storage.from("wishlist-images").getPublicUrl(path);
  return { ok: true, url: data.publicUrl };
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
    image_url: input.imageUrl ?? null,
    status: "active",
  });

  if (error) throw error;
  return { ok: true };
}

export async function updateItem(id: string, input: WishlistItemInput): Promise<WishlistMutationResult> {
  const validationError = validate(input);
  if (validationError) return { ok: false, error: validationError };

  const update: Record<string, unknown> = {
    category: input.category.trim(),
    name: input.name.trim(),
    description: input.description?.trim() || null,
    unit_cost: input.unitCost,
    updated_at: new Date().toISOString(),
  };
  // Only touch image_url if the caller actually provided a new one — leaves
  // the existing photo alone when the admin doesn't upload a replacement.
  if (input.imageUrl !== undefined) {
    update.image_url = input.imageUrl;
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("wishlist_items").update(update).eq("id", id);

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
