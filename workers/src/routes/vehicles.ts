import { serializeVeiculo } from "../api/serializers";
import { listVeiculosPublicos } from "../db/veiculos";
import type { Env } from "../types/env";
import { json } from "../utils/http";

export async function handleListPublicVehicles(_request: Request, env: Env) {
  const veiculos = await listVeiculosPublicos(env);
  const vehicles = veiculos.map(serializeVeiculo);
  return json({ veiculos: vehicles, vehicles });
}
