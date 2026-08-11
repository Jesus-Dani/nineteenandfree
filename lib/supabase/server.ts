import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client with full database access via SUPABASE_SECRET_KEY.
 * Must never be imported from a "use client" component or any code bundled to the browser.
 */
export function createServerSupabaseClient() {
  if (typeof window !== "undefined") {
    throw new Error(
      "createServerSupabaseClient() was called in the browser. This client uses the Supabase secret key and must only run server-side."
    );
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
