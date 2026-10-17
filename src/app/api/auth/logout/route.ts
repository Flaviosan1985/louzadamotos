import { cookies } from "next/headers";
import { LOUZADA_TOKEN_COOKIE } from "@/lib/cloudflare/config";
import { clearAdminSession, requireAdminApi } from "@/lib/louzada/auth";

export async function POST() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const cookieStore = await cookies();
  cookieStore.delete(LOUZADA_TOKEN_COOKIE);
  await clearAdminSession();
  return Response.json({ ok: true });
}
