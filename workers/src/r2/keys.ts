export function photoObjectKey(
  userId: string,
  vehicleId: number,
  opaqueId: string,
  ext: string,
) {
  const safeExt = ext.replace(/[^a-z0-9]/gi, "").toLowerCase() || "jpg";
  const safeId = opaqueId.replace(/[^a-z0-9]/gi, "").toLowerCase() || crypto.randomUUID().replace(/-/g, "");
  return `users/${userId}/vehicles/${vehicleId}/photos/${safeId}.${safeExt}`;
}

export function guessContentType(key: string): string {
  const ext = key.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    default:
      return "application/octet-stream";
  }
}
