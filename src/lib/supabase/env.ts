export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    ""
  ).trim();

  return {
    url,
    key,
    isConfigured: Boolean(url && key),
  };
}

export function requireSupabaseEnv() {
  const env = getSupabaseEnv();
  if (!env.url || !env.key) {
    throw new Error(
      "Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no .env.local",
    );
  }
  return { url: env.url, key: env.key };
}
