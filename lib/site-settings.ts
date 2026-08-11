import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getGiveFlowEnabled(): Promise<boolean> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("site_settings")
    .select("give_flow_enabled")
    .eq("id", true)
    .maybeSingle();

  if (error) throw error;
  // Fail open to "enabled" only if the row is somehow missing (e.g. migration
  // not yet applied) — never fail closed and silently block all giving.
  return data?.give_flow_enabled ?? true;
}

export async function setGiveFlowEnabled(enabled: boolean): Promise<void> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from("site_settings")
    .update({ give_flow_enabled: enabled })
    .eq("id", true);

  if (error) throw error;
}
