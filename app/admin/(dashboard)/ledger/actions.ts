"use server";

import { revalidatePath } from "next/cache";
import { addLedgerEntry, type LedgerMutationResult } from "@/lib/ledger";

export type LedgerFormState = { error?: string };

export async function addLedgerEntryAction(
  _prevState: LedgerFormState,
  formData: FormData
): Promise<LedgerFormState> {
  const result: LedgerMutationResult = await addLedgerEntry({
    type: formData.get("type") === "expense" ? "expense" : "income",
    amount: Number(formData.get("amount")),
    category: formData.get("category") ? String(formData.get("category")) : null,
    description: formData.get("description") ? String(formData.get("description")) : null,
    date: String(formData.get("date") ?? ""),
  });

  if (!result.ok) return { error: result.error };

  revalidatePath("/admin/ledger");
  revalidatePath("/transparency");
  return {};
}
