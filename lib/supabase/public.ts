import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

function createMockClient() {
  return {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: null }),
          order: () => ({
            limit: () => Promise.resolve({ data: [], error: null }),
            range: () => Promise.resolve({ data: [], count: 0, error: null }),
          }),
          limit: () => Promise.resolve({ data: [], error: null }),
          range: () => Promise.resolve({ data: [], count: 0, error: null }),
        }),
        order: () => ({
          limit: () => Promise.resolve({ data: [], error: null }),
          range: () => Promise.resolve({ data: [], count: 0, error: null }),
        }),
        limit: () => Promise.resolve({ data: [], error: null }),
        range: () => Promise.resolve({ data: [], count: 0, error: null }),
      }),
    }),
  } as any;
}

let client: ReturnType<typeof createSupabaseClient<Database>> | null = null;

/**
 * Read-only client for public, unauthenticated data (packages, news, testimonials,
 * site_settings). Unlike lib/supabase/server.ts, this never touches cookies()/headers(),
 * so pages that only use it stay eligible for static rendering / `revalidate` (ISR)
 * instead of being forced fully dynamic on every request. Safe because every table this
 * client reads has a `using (true)` (or published-only) RLS read policy — no session
 * needed for public data.
 */
export function createPublicClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey || supabaseUrl === "https://placeholder.supabase.co") {
    return createMockClient();
  }

  if (!client) {
    client = createSupabaseClient<Database>(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return client;
}
