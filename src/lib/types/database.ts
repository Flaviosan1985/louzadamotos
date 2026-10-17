export type TipoVeiculo = "carro" | "moto";
export type StatusVeiculo = "disponivel" | "reservado" | "vendido";
export type TipoPessoa = "fisica" | "juridica";
export type TipoFinanceiro = "receita" | "despesa";
export type StatusFinanceiro = "pendente" | "pago";
export type PapelUsuario = "admin" | "vendedor" | "financeiro";

export interface Tenant {
  id: string;
  nome: string;
  cnpj: string | null;
  telefone: string | null;
  logo_url: string | null;
  criado_em: string;
}

export interface Profile {
  id: string;
  tenant_id: string;
  nome: string;
  papel: PapelUsuario;
  criado_em: string;
}

export interface Veiculo {
  id: string;
  tenant_id: string;
  tipo: TipoVeiculo;
  marca: string;
  modelo: string;
  ano_fabricacao: number;
  ano_modelo: number;
  placa: string | null;
  renavam: string | null;
  km: number;
  cor: string | null;
  cilindrada: number | null;
  preco_custo: number;
  preco_venda: number;
  status: StatusVeiculo;
  observacoes: string | null;
  fotos: string[];
  vendido_em: string | null;
  criado_em: string;
  atualizado_em: string;
}

export interface Cliente {
  id: string;
  tenant_id: string;
  nome: string;
  tipo_pessoa: TipoPessoa;
  documento: string | null;
  telefone: string | null;
  email: string | null;
  endereco: string | null;
  criado_em: string;
  anonimizado_em: string | null;
}

export interface LancamentoFinanceiro {
  id: string;
  tenant_id: string;
  tipo: TipoFinanceiro;
  categoria: string;
  descricao: string;
  valor: number;
  data_vencimento: string;
  data_pagamento: string | null;
  status: StatusFinanceiro;
  veiculo_id: string | null;
  criado_em: string;
}

export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: Tenant;
        Insert: Omit<Tenant, "id" | "criado_em"> & {
          id?: string;
          criado_em?: string;
        };
        Update: Partial<Omit<Tenant, "id" | "criado_em">>;
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "criado_em"> & { criado_em?: string };
        Update: Partial<Omit<Profile, "id">>;
      };
      veiculos: {
        Row: Veiculo;
        Insert: Omit<Veiculo, "id" | "criado_em" | "atualizado_em"> & {
          id?: string;
          criado_em?: string;
          atualizado_em?: string;
          fotos?: string[];
        };
        Update: Partial<Omit<Veiculo, "id" | "tenant_id" | "criado_em">>;
      };
      clientes: {
        Row: Cliente;
        Insert: Omit<Cliente, "id" | "criado_em" | "anonimizado_em"> & {
          id?: string;
          criado_em?: string;
          anonimizado_em?: string | null;
        };
        Update: Partial<Omit<Cliente, "id" | "tenant_id" | "criado_em">>;
      };
      financeiro: {
        Row: LancamentoFinanceiro;
        Insert: Omit<LancamentoFinanceiro, "id" | "criado_em"> & {
          id?: string;
          criado_em?: string;
        };
        Update: Partial<
          Omit<LancamentoFinanceiro, "id" | "tenant_id" | "criado_em">
        >;
      };
    };
  };
}

export type VeiculoInsert = Database["public"]["Tables"]["veiculos"]["Insert"];
export type VeiculoUpdate = Database["public"]["Tables"]["veiculos"]["Update"];
export type ClienteInsert = Database["public"]["Tables"]["clientes"]["Insert"];
export type ClienteUpdate = Database["public"]["Tables"]["clientes"]["Update"];
export type FinanceiroInsert =
  Database["public"]["Tables"]["financeiro"]["Insert"];
export type FinanceiroUpdate =
  Database["public"]["Tables"]["financeiro"]["Update"];
export type TenantUpdate = Database["public"]["Tables"]["tenants"]["Update"];
