import { type NextRequest, NextResponse } from "next/server";
import { verifySessionValue, LOUZADA_SESSION_COOKIE } from "@/lib/louzada/session";
import {
  isLouzadaAdminPath,
  isLouzadaPublicPath,
  isLouzadaWriteApi,
} from "@/lib/louzada/public-paths";
import { updateSession } from "@/lib/supabase/middleware";

async function handleLouzada(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;
  const session = request.cookies.get(LOUZADA_SESSION_COOKIE)?.value;
  const authed = await verifySessionValue(session);

  if (isLouzadaPublicPath(pathname) && !isLouzadaWriteApi(pathname, method)) {
    if (isLouzadaAdminPath(pathname) && !authed) {
      const url = request.nextUrl.clone();
      url.pathname = pathname.startsWith("/painel") ? "/painel/login" : "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next({ request });
  }

  if (isLouzadaWriteApi(pathname, method) || isLouzadaAdminPath(pathname)) {
    if (!authed) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
      }
      const url = request.nextUrl.clone();
      url.pathname = pathname.startsWith("/painel") ? "/painel/login" : "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next({ request });
  }

  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/admin/login" ? "/login" : "/veiculos/a-venda";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (pathname === "/api/leads" && request.method === "POST") {
    return NextResponse.next({ request });
  }

  const louzada = await handleLouzada(request);
  if (louzada) return louzada;

  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|webm)$).*)",
  ],
};
