import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { DEMO_COOKIE } from "@/lib/demo/constants";

const PUBLIC_PATHS = ["/login", "/cadastro"];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isDemo = request.cookies.get(DEMO_COOKIE)?.value === "1";

  if (isDemo) {
    if (isPublicPath(pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = "/sistema";
      return NextResponse.redirect(url);
    }
    return NextResponse.next({ request });
  }

  const env = getSupabaseEnv();
  if (!env.isConfigured) {
    if (isPublicPath(pathname) || pathname.startsWith("/api/")) {
      return NextResponse.next({ request });
    }
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(env.url!, env.key!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  const isAuthenticated = Boolean(data?.claims);

  if (!isAuthenticated && !isPublicPath(pathname) && !pathname.startsWith("/api/")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthenticated && isPublicPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/sistema";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
