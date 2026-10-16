import type { StatusVeiculo, TipoVeiculo } from "@/lib/types/database";

export type VeiculoFiltros = {
  busca: string;
  status: StatusVeiculo | "todos";
  marca: string;
  tipo: TipoVeiculo | "todos";
};
