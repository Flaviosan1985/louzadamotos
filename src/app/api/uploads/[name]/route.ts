import fs from "node:fs";
import path from "node:path";
import { getUploadDir } from "@/lib/louzada/uploads";

type RouteContext = { params: Promise<{ name: string }> };

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export async function GET(_request: Request, context: RouteContext) {
  const { name } = await context.params;
  const safeName = path.basename(name);
  if (!safeName || safeName !== name) {
    return new Response("Arquivo inválido", { status: 400 });
  }

  const filePath = path.join(getUploadDir(), safeName);
  if (!fs.existsSync(filePath)) {
    return new Response("Não encontrado", { status: 404 });
  }

  const ext = path.extname(safeName).toLowerCase();
  const contentType = MIME[ext] ?? "application/octet-stream";
  const buffer = fs.readFileSync(filePath);

  return new Response(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
