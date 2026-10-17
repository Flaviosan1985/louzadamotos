import type { Env } from "../types/env";
import { guessContentType } from "./keys";

export async function getObjectResponse(
  env: Env,
  objectKey: string,
  cache: "no-store" | "force-cache" = "no-store",
) {
  const obj = await env.PHOTOS_BUCKET.get(objectKey);
  if (!obj) return null;

  const headers = new Headers();
  headers.set("Content-Type", obj.httpMetadata?.contentType ?? guessContentType(objectKey));
  headers.set("Cache-Control", cache === "no-store" ? "private, no-store" : "public, max-age=86400");

  return new Response(obj.body, { headers });
}
