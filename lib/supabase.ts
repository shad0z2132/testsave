import { createClient, SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;
let adminClient: SupabaseClient | null = null;

function getEnv() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
}

/**
 * Browser-safe anon client (used in components for lightweight reads if needed).
 * Lazily created so missing env vars don't crash module import.
 */
export function getSupabaseClient(): SupabaseClient {
  if (browserClient) return browserClient;

  const { url, anonKey } = getEnv();
  if (!url || !anonKey) {
    throw new Error(
      "Supabase client is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  browserClient = createClient(url, anonKey);
  return browserClient;
}

/**
 * Server-side admin client with elevated privileges for mutations.
 * Lazily created so missing env vars don't crash module import.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (adminClient) return adminClient;

  const { url, anonKey, serviceKey } = getEnv();
  const key = serviceKey || anonKey;

  if (!url || !key) {
    throw new Error(
      "Supabase admin client is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)."
    );
  }

  adminClient = createClient(url, key);
  return adminClient;
}
