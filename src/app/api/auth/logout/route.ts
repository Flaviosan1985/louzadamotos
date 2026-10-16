import { clearAdminSession, requireAdminApi } from "@/lib/louzada/auth";

export async function POST() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  await clearAdminSession();
  return Response.json({ ok: true });
}
