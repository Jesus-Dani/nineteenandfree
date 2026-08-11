"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createItem,
  updateItem,
  setItemStatus,
  deleteItem,
  type WishlistItemInput,
} from "@/lib/admin-wishlist";

export type WishlistFormState = { error?: string };

function parseInput(formData: FormData): WishlistItemInput {
  return {
    category: String(formData.get("category") ?? ""),
    name: String(formData.get("name") ?? ""),
    description: formData.get("description") ? String(formData.get("description")) : null,
    unitCost: Number(formData.get("unitCost")),
  };
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
  const result = await createItem(parseInput(formData));
  if (!result.ok) return { error: result.error };
  revalidateWishlistPaths();
  redirect("/admin/wishlist");
}

export async function updateItemAction(
  _prevState: WishlistFormState,
  formData: FormData
): Promise<WishlistFormState> {
  const id = String(formData.get("id") ?? "");
  const result = await updateItem(id, parseInput(formData));
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
