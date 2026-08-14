"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { deleteContribution } from "@/lib/admin-contributions";

export async function deleteContributionAction(id: string) {
  const result = await deleteContribution(id);

  revalidatePath("/admin/contributions");
  revalidatePath("/transparency");
  revalidatePath("/wishlist");
  revalidatePath("/give");

  if (!result.ok) {
    redirect(`/admin/contributions?error=${encodeURIComponent(result.error)}`);
  }
}
