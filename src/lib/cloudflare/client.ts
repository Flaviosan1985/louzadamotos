import { getCloudflareApiUrl } from "@/lib/cloudflare/config";

type LoginResponse = {
  token: string;
  user: { id: string; email: string; role: string };
};

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const base = getCloudflareApiUrl();
  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) {
    throw new Error(typeof data.error === "string" ? data.error : `Erro ${res.status}`);
  }
  return data;
}

export async function cloudflareLogin(email: string, password: string) {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function cloudflareRegister(email: string, password: string) {
  return apiFetch<LoginResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function cloudflarePublicPhotoUrl(photoId: number) {
  return `${getCloudflareApiUrl()}/public/photos/${photoId}`;
}
