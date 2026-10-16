import type {
  StatusFinanceiro,
  StatusVeiculo,
  TipoFinanceiro,
  TipoPessoa,
  TipoVeiculo,
} from "@/lib/types/database";

export const STATUS_VEICULO: { value: StatusVeiculo; label: string }[] = [
  { value: "disponivel", label: "Disponível" },
  { value: "reservado", label: "Reservado" },
  { value: "vendido", label: "Vendido" },
];

export const TIPOS_VEICULO: { value: TipoVeiculo; label: string }[] = [
  { value: "carro", label: "Carro" },
  { value: "moto", label: "Moto" },
];

export const TIPOS_PESSOA: { value: TipoPessoa; label: string }[] = [
  { value: "fisica", label: "Pessoa física" },
  { value: "juridica", label: "Pessoa jurídica" },
];

export const TIPOS_FINANCEIRO: { value: TipoFinanceiro; label: string }[] = [
  { value: "receita", label: "Receita" },
  { value: "despesa", label: "Despesa" },
];

export const STATUS_FINANCEIRO: { value: StatusFinanceiro; label: string }[] = [
  { value: "pendente", label: "Pendente" },
  { value: "pago", label: "Pago" },
];

export const CATEGORIAS_RECEITA = [
  "Venda de veículo",
  "Entrada / sinal",
  "Financiamento",
  "Serviços",
  "Outras receitas",
];

export const CATEGORIAS_DESPESA = [
  "Compra de veículo",
  "Comissão",
  "Oficina / preparação",
  "IPVA / documentação",
  "Aluguel",
  "Marketing",
  "Outras despesas",
];
