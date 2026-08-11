import { createClient } from "@supabase/supabase-js";

/**
 * Browser-safe Supabase client. Uses the publishable key only — never the
 * service/secret key. Safe to import from client components.
 */
export function createBrowserSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
