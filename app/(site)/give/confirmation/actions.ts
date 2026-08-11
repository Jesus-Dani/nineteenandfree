"use server";

import { submitBraceletResponse } from "@/lib/bracelet";

export type BraceletActionState = { ok?: boolean; error?: string };

export async function submitBracelet(
  _prevState: BraceletActionState,
  formData: FormData
): Promise<BraceletActionState> {
  const contributionId = String(formData.get("contributionId") ?? "");
  const interested = formData.get("interested") === "true";

  if (!contributionId) {
    return { error: "Missing contribution reference." };
  }

  const result = await submitBraceletResponse({
    contributionId,
    interested,
    name: formData.get("name") ? String(formData.get("name")) : null,
    phone: formData.get("phone") ? String(formData.get("phone")) : null,
    whatsapp: formData.get("whatsapp") ? String(formData.get("whatsapp")) : null,
    size: formData.get("size") ? (String(formData.get("size")) as "Small" | "Medium" | "Large") : null,
    gender: formData.get("gender") ? (String(formData.get("gender")) as "Male" | "Female") : null,
  });

  if (!result.ok) return { error: result.error };
  return { ok: true };
}
