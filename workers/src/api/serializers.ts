import type { FotoRow } from "../db/fotos";
import type { VeiculoRow } from "../db/veiculos";

/** Compatível com tipos legados do Next.js (brand/model/disponivel). */
export function serializeVeiculo(v: VeiculoRow) {
  return {
    id: v.id,
    brand: v.marca,
    model: v.modelo,
    year: v.ano,
    price: v.preco,
    status: statusLegado(v.status),
    marca: v.marca,
    modelo: v.modelo,
    ano: v.ano,
    preco: v.preco,
    criado_em: v.criado_em,
    created_at: v.criado_em,
  };
}

export function serializeFoto(f: FotoRow) {
  return {
    id: f.id,
    vehicle_id: f.veiculo_id,
    veiculo_id: f.veiculo_id,
    r2_key: f.r2_key,
    position: f.ordem,
    ordem: f.ordem,
    criado_em: f.criado_em,
    created_at: f.criado_em,
  };
}

function statusLegado(status: VeiculoRow["status"]): "disponivel" | "vendido" | "reservado" {
  switch (status) {
    case "Disponível":
      return "disponivel";
    case "Vendido":
      return "vendido";
    case "Reservado":
      return "reservado";
    default:
      return "disponivel";
  }
}
