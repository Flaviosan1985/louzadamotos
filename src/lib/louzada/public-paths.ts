const EXACT = new Set([
  "/",
  "/motos",
  "/autos",
  "/sobre",
  "/contato",
  "/admin/login",
]);

const PREFIXES = ["/veiculo/", "/api/uploads/"];

export function isLouzadaPublicPath(pathname: string) {
  if (EXACT.has(pathname)) return true;
  if (PREFIXES.some((prefix) => pathname.startsWith(prefix))) return true;
  if (pathname === "/api/vehicles") return true;
  if (/^\/api\/vehicles\/\d+$/.test(pathname)) return true;
  if (pathname === "/api/auth/login") return true;
  return false;
}

export function isLouzadaAdminPath(pathname: string) {
  return pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");
}

export function isLouzadaWriteApi(pathname: string, method: string) {
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") return false;
  if (pathname === "/api/auth/login" || pathname === "/api/auth/logout") return false;
  if (pathname.startsWith("/api/vehicles")) return true;
  if (pathname.startsWith("/api/photos")) return true;
  return false;
}
