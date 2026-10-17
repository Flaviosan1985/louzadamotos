import { cookies } from "next/headers";
import { DEMO_COOKIE } from "@/lib/demo/constants";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { isAdminAuthenticated } from "@/lib/louzada/auth";

/** Quem já está no Admycar (demo ou Supabase) ou no login Louzada legado pode gerir a vitrine. */
export async function canManageLouzadaCatalog() {
  if (await isAdminAuthenticated()) return true;

  const cookieStore = await cookies();
  if (cookieStore.get(DEMO_COOKIE)?.value === "1") return true;

  const env = getSupabaseEnv();
  if (!env.isConfigured) return false;

  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    return Boolean(data.user);
  } catch {
    return false;
  }
}
