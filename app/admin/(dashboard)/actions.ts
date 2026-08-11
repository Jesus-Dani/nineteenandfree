"use server";

import { revalidatePath } from "next/cache";
import { setGiveFlowEnabled } from "@/lib/site-settings";

export async function setGiveFlowEnabledAction(enabled: boolean) {
  await setGiveFlowEnabled(enabled);
  revalidatePath("/admin");
  revalidatePath("/give");
  revalidatePath("/give/amount");
}
