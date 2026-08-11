"use server";

import { submitMessage } from "@/lib/messages";
import { getClientIp } from "@/lib/get-client-ip";

export type LetterActionState = { ok?: boolean; error?: string };

export async function submitLetterOfLove(
  _prevState: LetterActionState,
  formData: FormData
): Promise<LetterActionState> {
  const name = String(formData.get("name") ?? "").trim() || null;
  const message = String(formData.get("message") ?? "");
  const isAnonymous = formData.get("isAnonymous") === "true";
  const contributionId = formData.get("contributionId")
    ? String(formData.get("contributionId"))
    : null;

  const ip = await getClientIp();
  const result = await submitMessage({ name, message, isAnonymous, contributionId, ip });

  if (!result.ok) return { error: result.error };
  return { ok: true };
}
