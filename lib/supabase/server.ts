import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
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
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => Promise.resolve({ error: null }),
      delete: () => Promise.resolve({ error: null }),
    }),
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ error: null }),
      signOut: () => Promise.resolve({ error: null }),
    },
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ error: null }),
        remove: () => Promise.resolve({ error: null }),
        getPublicUrl: () => ({ data: { publicUrl: "" } }),
      }),
    },
  } as any;
}

export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey || supabaseUrl === "https://placeholder.supabase.co") {
    return createMockClient();
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        },
      },
    }
  );
}
