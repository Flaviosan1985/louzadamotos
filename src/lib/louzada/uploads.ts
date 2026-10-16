import fs from "node:fs";
import path from "node:path";
import { UPLOAD_DIR } from "@/lib/louzada/constants";

export function getUploadDir() {
  const dir = path.join(process.cwd(), UPLOAD_DIR);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export function photoPublicUrl(filename: string) {
  return `/api/uploads/${encodeURIComponent(filename)}`;
}

export function safeUploadFilename(original: string) {
  const ext = path.extname(original).toLowerCase().slice(0, 8);
  const base = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  return `${base}${ext || ".jpg"}`;
}
