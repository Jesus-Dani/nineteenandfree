"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function approveMessage(id: string) {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("messages").update({ approval_status: "approved" }).eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/moderation");
  revalidatePath("/letters-of-love");
}

export async function rejectMessage(id: string) {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("messages").update({ approval_status: "rejected" }).eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/moderation");
}
