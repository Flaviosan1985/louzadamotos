import { handleLogin, handleRegister } from "./routes/auth";
import { handleChangePassword, handleGetMe } from "./routes/me";
import {
  handleDeletePhoto,
  handleListVehiclePhotos,
  handlePresignedPhotoUrl,
  handlePublicPhotoProxy,
  handleUploadVehiclePhoto,
} from "./routes/photos";
import { handleListPublicVehicles } from "./routes/vehicles";
import type { Env } from "./types/env";
import { json } from "./utils/http";

function parseId(value: string | undefined): number | null {
  if (!value) return null;
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function matchVehiclePhotos(pathname: string) {
  return pathname.match(/^\/(?:vehicles|veiculos)\/(\d+)\/photos$/);
}

function matchPhotoUrl(pathname: string) {
  return pathname.match(/^\/(?:photos|fotos)\/(\d+)\/url$/);
}

function matchPhotoDelete(pathname: string) {
  return pathname.match(/^\/(?:photos|fotos)\/(\d+)$/);
}

function matchPublicPhoto(pathname: string) {
  return pathname.match(/^\/public\/(?:photos|fotos)\/(\d+)$/);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;
    const method = request.method;

    if (method === "GET" && pathname === "/health") {
      return json({ ok: true, service: "louzada-api" });
    }

    if (method === "POST" && pathname === "/auth/register") {
      return handleRegister(request, env);
    }
    if (method === "POST" && pathname === "/auth/login") {
      return handleLogin(request, env);
    }

    if (method === "GET" && pathname === "/me") {
      return handleGetMe(request, env);
    }
    if (method === "POST" && pathname === "/me/password") {
      return handleChangePassword(request, env);
    }

    if (method === "GET" && (pathname === "/public/vehicles" || pathname === "/public/veiculos")) {
      return handleListPublicVehicles(request, env);
    }

    let match = matchVehiclePhotos(pathname);
    if (match) {
      const veiculoId = parseId(match[1]);
      if (!veiculoId) return json({ error: "ID inválido" }, { status: 400 });
      if (method === "GET") return handleListVehiclePhotos(request, env, veiculoId);
      if (method === "POST") return handleUploadVehiclePhoto(request, env, veiculoId);
    }

    match = matchPhotoUrl(pathname);
    if (method === "GET" && match) {
      const fotoId = parseId(match[1]);
      if (!fotoId) return json({ error: "ID inválido" }, { status: 400 });
      return handlePresignedPhotoUrl(request, env, fotoId);
    }

    match = matchPhotoDelete(pathname);
    if (method === "DELETE" && match) {
      const fotoId = parseId(match[1]);
      if (!fotoId) return json({ error: "ID inválido" }, { status: 400 });
      return handleDeletePhoto(request, env, fotoId);
    }

    match = matchPublicPhoto(pathname);
    if (method === "GET" && match) {
      const fotoId = parseId(match[1]);
      if (!fotoId) return json({ error: "ID inválido" }, { status: 400 });
      return handlePublicPhotoProxy(request, env, fotoId);
    }

    return json({ error: "Rota não encontrada" }, { status: 404 });
  },
} satisfies ExportedHandler<Env>;
