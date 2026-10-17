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

    if (method === "GET" && pathname === "/public/vehicles") {
      return handleListPublicVehicles(request, env);
    }

    let match = pathname.match(/^\/vehicles\/(\d+)\/photos$/);
    if (match) {
      const vehicleId = parseId(match[1]);
      if (!vehicleId) return json({ error: "ID inválido" }, { status: 400 });
      if (method === "GET") return handleListVehiclePhotos(request, env, vehicleId);
      if (method === "POST") return handleUploadVehiclePhoto(request, env, vehicleId);
    }

    match = pathname.match(/^\/photos\/(\d+)\/url$/);
    if (method === "GET" && match) {
      const photoId = parseId(match[1]);
      if (!photoId) return json({ error: "ID inválido" }, { status: 400 });
      return handlePresignedPhotoUrl(request, env, photoId);
    }

    match = pathname.match(/^\/photos\/(\d+)$/);
    if (method === "DELETE" && match) {
      const photoId = parseId(match[1]);
      if (!photoId) return json({ error: "ID inválido" }, { status: 400 });
      return handleDeletePhoto(request, env, photoId);
    }

    match = pathname.match(/^\/public\/photos\/(\d+)$/);
    if (method === "GET" && match) {
      const photoId = parseId(match[1]);
      if (!photoId) return json({ error: "ID inválido" }, { status: 400 });
      return handlePublicPhotoProxy(request, env, photoId);
    }

    return json({ error: "Rota não encontrada" }, { status: 404 });
  },
} satisfies ExportedHandler<Env>;
