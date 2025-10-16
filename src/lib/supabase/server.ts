import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

// Server-side client with service role key (bypasses RLS)
export const supabaseServer = createSupabaseClient(
  supabaseUrl,
  supabaseServiceKey!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// For authenticated operations with user context
export const createSupabaseServerClient = (authToken?: string) => {
  const client = createSupabaseClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: authToken
        ? {
            Authorization: `Bearer ${authToken}`,
          }
        : {},
    },
  });

  return client;
};

// SSR client with cookies
export const createClient = async () => {
  const cookieStore = await cookies();
  return createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
};
