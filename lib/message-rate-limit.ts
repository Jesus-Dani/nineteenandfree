import { createServerSupabaseClient } from "@/lib/supabase/server";

/** Max 1 submission per device per hour, tracked by IP (TRD Section 4). No CAPTCHA. */
export async function isRateLimited(ip: string | null): Promise<boolean> {
  if (!ip) return false; // can't track it — fail open rather than block everyone

  const supabase = createServerSupabaseClient();
  const cutoff = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("messages")
    .select("id")
    .eq("submitted_ip", ip)
    .gte("created_at", cutoff)
    .limit(1);

  if (error) throw error;
  return (data?.length ?? 0) > 0;
}
