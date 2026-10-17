import { listPublicVehicles } from "../db/vehicles";
import type { Env } from "../types/env";
import { json } from "../utils/http";

export async function handleListPublicVehicles(_request: Request, env: Env) {
  const vehicles = await listPublicVehicles(env);
  return json({ vehicles });
}
