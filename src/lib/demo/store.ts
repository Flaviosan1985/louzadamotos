"use client";

import { DEMO_STORAGE_KEY } from "@/lib/demo/constants";
import { seedExtras } from "@/lib/demo/modules-seed";
import {
  demoClientes,
  demoFinanceiro,
  demoProfile,
  demoTenant,
  demoVeiculos,
} from "@/lib/demo/seed";
import type {
  Cliente,
  ClienteInsert,
  ClienteUpdate,
  FinanceiroInsert,
  FinanceiroUpdate,
  LancamentoFinanceiro,
  Tenant,
  TenantUpdate,
  Veiculo,
  VeiculoInsert,
  VeiculoUpdate,
} from "@/lib/types/database";
import type { DemoExtras, ExtraKey, ModuleRow } from "@/lib/types/modulos";

export interface DemoState {
  tenant: Tenant;
  profile: typeof demoProfile;
  veiculos: Veiculo[];
  clientes: Cliente[];
  financeiro: LancamentoFinanceiro[];
  extras: DemoExtras;
}

function seedState(): DemoState {
  return {
    tenant: structuredClone(demoTenant),
    profile: structuredClone(demoProfile),
    veiculos: structuredClone(demoVeiculos),
    clientes: structuredClone(demoClientes),
    financeiro: structuredClone(demoFinanceiro),
    extras: structuredClone(seedExtras()),
  };
}

function mergeDemoState(raw: Partial<DemoState>): DemoState {
  const seed = seedState();
  const extrasSeed = seed.extras;
  const extrasRaw = raw.extras ?? ({} as Partial<DemoExtras>);
  return {
    tenant: raw.tenant ?? seed.tenant,
    profile: raw.profile ?? seed.profile,
    veiculos: raw.veiculos ?? seed.veiculos,
    clientes: raw.clientes ?? seed.clientes,
    financeiro: raw.financeiro ?? seed.financeiro,
    extras: (Object.keys(extrasSeed) as ExtraKey[]).reduce((acc, key) => {
      acc[key] = extrasRaw[key] ?? extrasSeed[key];
      return acc;
    }, {} as DemoExtras),
  };
}

export function readDemoState(): DemoState {
  if (typeof window === "undefined") return seedState();
  const raw = window.localStorage.getItem(DEMO_STORAGE_KEY);
  if (!raw) {
    const initial = seedState();
    window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  try {
    return mergeDemoState(JSON.parse(raw) as Partial<DemoState>);
  } catch {
    const initial = seedState();
    window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
}

function writeDemoState(state: DemoState) {
  window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new Event("patio-demo-updated"));
}

function requireDemoItem<T>(item: T | undefined, message: string): T {
  if (!item) throw new Error(message);
  return item;
}

export function resetDemoState() {
  const initial = seedState();
  writeDemoState(initial);
  return initial;
}

export function demoUpdateTenant(patch: TenantUpdate) {
  const state = readDemoState();
  state.tenant = { ...state.tenant, ...patch };
  writeDemoState(state);
  return state.tenant;
}

export function demoUpdateProfile(patch: Partial<typeof demoProfile>) {
  const state = readDemoState();
  state.profile = { ...state.profile, ...patch };
  writeDemoState(state);
  return state.profile;
}

export function demoUpsertVeiculo(
  payload: VeiculoInsert | (VeiculoUpdate & { id: string }),
) {
  const state = readDemoState();
  const now = new Date().toISOString();
  if ("id" in payload && payload.id) {
    state.veiculos = state.veiculos.map((item) =>
      item.id === payload.id ? { ...item, ...payload, atualizado_em: now } : item,
    );
  } else {
    const created: Veiculo = {
      id: crypto.randomUUID(),
      tenant_id: state.tenant.id,
      tipo: payload.tipo ?? "carro",
      marca: payload.marca ?? "",
      modelo: payload.modelo ?? "",
      ano_fabricacao: payload.ano_fabricacao ?? new Date().getFullYear(),
      ano_modelo: payload.ano_modelo ?? new Date().getFullYear(),
      placa: payload.placa ?? null,
      renavam: payload.renavam ?? null,
      km: payload.km ?? 0,
      cor: payload.cor ?? null,
      preco_custo: Number(payload.preco_custo ?? 0),
      preco_venda: Number(payload.preco_venda ?? 0),
      status: payload.status ?? "disponivel",
      observacoes: payload.observacoes ?? null,
      fotos: payload.fotos ?? [],
      vendido_em: payload.vendido_em ?? null,
      criado_em: now,
      atualizado_em: now,
    };
    state.veiculos = [created, ...state.veiculos];
    writeDemoState(state);
    return created;
  }
  writeDemoState(state);
  return requireDemoItem(
    state.veiculos.find((item) => item.id === payload.id),
    "Veículo não encontrado na demonstração.",
  );
}

export function demoDeleteVeiculo(id: string) {
  const state = readDemoState();
  const found = state.veiculos.find((item) => item.id === id);
  if (found) {
    state.extras.excluidos = [
      {
        id: found.id,
        tenant_id: found.tenant_id,
        criado_em: new Date().toISOString(),
        veiculo: `${found.marca} ${found.modelo}`,
        placa: found.placa ?? "—",
        status: found.status,
        excluido_em: new Date().toISOString().slice(0, 10),
        snapshot: JSON.stringify(found),
      },
      ...state.extras.excluidos,
    ];
  }
  state.veiculos = state.veiculos.filter((item) => item.id !== id);
  writeDemoState(state);
}

export function demoRestoreExcluido(id: string) {
  const state = readDemoState();
  const found = state.extras.excluidos.find((item) => item.id === id);
  if (!found) throw new Error("Registro excluído não encontrado.");
  if (!found.snapshot) {
    throw new Error("Não há dados suficientes para devolver este veículo ao estoque.");
  }
  const vehicle = JSON.parse(found.snapshot) as Veiculo;
  state.extras.excluidos = state.extras.excluidos.filter((item) => item.id !== id);
  if (!state.veiculos.some((item) => item.id === vehicle.id)) {
    state.veiculos = [vehicle, ...state.veiculos];
  }
  writeDemoState(state);
  return found;
}

export function demoUpsertExtra(key: ExtraKey, payload: ModuleRow | (Partial<ModuleRow> & { id: string })) {
  const state = readDemoState();
  const now = new Date().toISOString();
  if ("id" in payload && payload.id && state.extras[key].some((item) => item.id === payload.id)) {
    state.extras[key] = state.extras[key].map((item) =>
      item.id === payload.id ? ({ ...item, ...payload } as ModuleRow) : item,
    );
    writeDemoState(state);
    return requireDemoItem(
      state.extras[key].find((item) => item.id === payload.id),
      "Registro não encontrado.",
    );
  }
  const created: ModuleRow = {
    ...payload,
    id: payload.id ?? crypto.randomUUID(),
    tenant_id: payload.tenant_id ?? state.tenant.id,
    criado_em: payload.criado_em ?? now,
  };
  state.extras[key] = [created, ...state.extras[key]];
  writeDemoState(state);
  return created;
}

export function demoDeleteExtra(key: ExtraKey, id: string) {
  const state = readDemoState();
  state.extras[key] = state.extras[key].filter((item) => item.id !== id);
  writeDemoState(state);
}

export function demoUpsertCliente(
  payload: ClienteInsert | (ClienteUpdate & { id: string }),
) {
  const state = readDemoState();
  const now = new Date().toISOString();
  if ("id" in payload && payload.id) {
    state.clientes = state.clientes.map((item) =>
      item.id === payload.id ? { ...item, ...payload } : item,
    );
    writeDemoState(state);
    return requireDemoItem(
      state.clientes.find((item) => item.id === payload.id),
      "Cliente não encontrado na demonstração.",
    );
  }
  const created: Cliente = {
    id: crypto.randomUUID(),
    tenant_id: state.tenant.id,
    nome: payload.nome ?? "",
    tipo_pessoa: payload.tipo_pessoa ?? "fisica",
    documento: payload.documento ?? null,
    telefone: payload.telefone ?? null,
    email: payload.email ?? null,
    endereco: payload.endereco ?? null,
    criado_em: now,
    anonimizado_em: payload.anonimizado_em ?? null,
  };
  state.clientes = [created, ...state.clientes];
  writeDemoState(state);
  return created;
}

export function demoDeleteCliente(id: string) {
  const state = readDemoState();
  state.clientes = state.clientes.filter((item) => item.id !== id);
  writeDemoState(state);
}

export function demoUpsertFinanceiro(
  payload: FinanceiroInsert | (FinanceiroUpdate & { id: string }),
) {
  const state = readDemoState();
  const now = new Date().toISOString();
  if ("id" in payload && payload.id) {
    state.financeiro = state.financeiro.map((item) =>
      item.id === payload.id ? { ...item, ...payload } : item,
    );
    writeDemoState(state);
    return requireDemoItem(
      state.financeiro.find((item) => item.id === payload.id),
      "Lançamento não encontrado na demonstração.",
    );
  }
  const created: LancamentoFinanceiro = {
    id: crypto.randomUUID(),
    tenant_id: state.tenant.id,
    tipo: payload.tipo ?? "receita",
    categoria: payload.categoria ?? "Outras receitas",
    descricao: payload.descricao ?? "",
    valor: Number(payload.valor ?? 0),
    data_vencimento: payload.data_vencimento ?? now.slice(0, 10),
    data_pagamento: payload.data_pagamento ?? null,
    status: payload.status ?? "pendente",
    veiculo_id: payload.veiculo_id ?? null,
    criado_em: now,
  };
  state.financeiro = [created, ...state.financeiro];
  writeDemoState(state);
  return created;
}

export function demoDeleteFinanceiro(id: string) {
  const state = readDemoState();
  state.financeiro = state.financeiro.filter((item) => item.id !== id);
  writeDemoState(state);
}
