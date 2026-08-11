"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createItem,
  updateItem,
  setItemStatus,
  deleteItem,
  uploadWishlistImage,
  type WishlistItemInput,
} from "@/lib/admin-wishlist";

export type WishlistFormState = { error?: string };

function parseInput(formData: FormData): Omit<WishlistItemInput, "imageUrl"> {
  return {
    category: String(formData.get("category") ?? ""),
    name: String(formData.get("name") ?? ""),
    description: formData.get("description") ? String(formData.get("description")) : null,
    unitCost: Number(formData.get("unitCost")),
  };
}

/** Undefined = no new file selected (leave existing image alone); string = new upload's URL. */
async function resolveImageUrl(formData: FormData): Promise<{ ok: true; url?: string } | { ok: false; error: string }> {
  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) return { ok: true, url: undefined };

  const result = await uploadWishlistImage(file);
  if (!result.ok) return { ok: false, error: result.error };
  return { ok: true, url: result.url };
}

function revalidateWishlistPaths() {
  revalidatePath("/admin/wishlist");
  revalidatePath("/wishlist");
  revalidatePath("/give");
}

export async function createItemAction(
  _prevState: WishlistFormState,
  formData: FormData
): Promise<WishlistFormState> {
  const imageResult = await resolveImageUrl(formData);
  if (!imageResult.ok) return { error: imageResult.error };

  const result = await createItem({ ...parseInput(formData), imageUrl: imageResult.url ?? null });
  if (!result.ok) return { error: result.error };
  revalidateWishlistPaths();
  redirect("/admin/wishlist");
}

export async function updateItemAction(
  _prevState: WishlistFormState,
  formData: FormData
): Promise<WishlistFormState> {
  const id = String(formData.get("id") ?? "");

  const imageResult = await resolveImageUrl(formData);
  if (!imageResult.ok) return { error: imageResult.error };

  const result = await updateItem(id, { ...parseInput(formData), imageUrl: imageResult.url });
  if (!result.ok) return { error: result.error };
  revalidateWishlistPaths();
  redirect("/admin/wishlist");
}

export async function archiveItemAction(id: string) {
  await setItemStatus(id, "archived");
  revalidateWishlistPaths();
}

export async function reactivateItemAction(id: string) {
  await setItemStatus(id, "active");
  revalidateWishlistPaths();
}

export async function deleteItemAction(id: string) {
  const result = await deleteItem(id);
  revalidateWishlistPaths();
  if (!result.ok) {
    redirect(`/admin/wishlist?error=${encodeURIComponent(result.error)}`);
  }
}
