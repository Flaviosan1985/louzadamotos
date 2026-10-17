"use client";

import { createClient } from "@/lib/supabase/client";
import { getSupabaseEnv } from "@/lib/supabase/env";
import {
  demoDeleteExtra,
  demoDeleteFinanceiro,
  demoDeleteVeiculo,
  demoRestoreExcluido,
  demoUpdateProfile,
  demoUpdateTenant,
  demoUpsertCliente,
  demoUpsertExtra,
  demoUpsertFinanceiro,
  demoUpsertVeiculo,
  readDemoState,
} from "@/lib/demo/store";
import { recusarExclusao } from "@/lib/negocio/privacidade";
import type { DemoExtras, ExtraKey, ModuleRow } from "@/lib/types/modulos";
import type {
  Cliente,
  ClienteInsert,
  ClienteUpdate,
  FinanceiroInsert,
  FinanceiroUpdate,
  LancamentoFinanceiro,
  Profile,
  Tenant,
  TenantUpdate,
  Veiculo,
  VeiculoInsert,
  VeiculoUpdate,
} from "@/lib/types/database";

export interface AppSnapshot {
  mode: "demo" | "supabase";
  tenant: Tenant;
  profile: Profile;
  veiculos: Veiculo[];
  clientes: Cliente[];
  financeiro: LancamentoFinanceiro[];
  extras: DemoExtras;
}

export function isDemoMode() {
  if (typeof document === "undefined") return false;
  return document.cookie.split("; ").some((row) => row === "patio_demo=1");
}

function mapVeiculo(row: Veiculo): Veiculo {
  return {
    ...row,
    preco_custo: Number(row.preco_custo),
    preco_venda: Number(row.preco_venda),
    km: Number(row.km),
    cilindrada: row.cilindrada == null ? null : Number(row.cilindrada),
    fotos: row.fotos ?? [],
  };
}

function mapFinanceiro(row: LancamentoFinanceiro): LancamentoFinanceiro {
  return { ...row, valor: Number(row.valor) };
}

async function syncVitrineFromClient(veiculos: Veiculo[]) {
  if (typeof window === "undefined") return;
  try {
    await fetch("/api/vitrine/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ veiculos }),
    });
  } catch {
    // vitrine opcional em ambientes sem filesystem
  }
}

export async function loadAppSnapshot(): Promise<AppSnapshot> {
  if (isDemoMode() || !getSupabaseEnv().isConfigured) {
    const demo = readDemoState();
    return { mode: "demo", ...demo };
  }

  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error("Sessão expirada. Entre novamente.");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  if (profileError || !profile) {
    throw new Error("Perfil da revenda não encontrado.");
  }

  const [tenantRes, veiculosRes, clientesRes, financeiroRes] = await Promise.all([
    supabase.from("tenants").select("*").eq("id", profile.tenant_id).single(),
    supabase
      .from("veiculos")
      .select("*")
      .eq("tenant_id", profile.tenant_id)
      .order("criado_em", { ascending: false }),
    supabase
      .from("clientes")
      .select("*")
      .eq("tenant_id", profile.tenant_id)
      .order("criado_em", { ascending: false }),
    supabase
      .from("financeiro")
      .select("*")
      .eq("tenant_id", profile.tenant_id)
      .order("data_vencimento", { ascending: false }),
  ]);

  if (tenantRes.error || !tenantRes.data) {
    throw new Error("Não foi possível carregar os dados da loja.");
  }
  if (veiculosRes.error) {
    throw new Error("Não foi possível carregar os veículos.");
  }
  if (clientesRes.error) {
    throw new Error("Não foi possível carregar os clientes.");
  }
  if (financeiroRes.error) {
    throw new Error("Não foi possível carregar o financeiro.");
  }

  return {
    mode: "supabase",
    tenant: tenantRes.data as Tenant,
    profile: profile as Profile,
    veiculos: ((veiculosRes.data ?? []) as Veiculo[]).map(mapVeiculo),
    clientes: (clientesRes.data ?? []) as Cliente[],
    financeiro: ((financeiroRes.data ?? []) as LancamentoFinanceiro[]).map(
      mapFinanceiro,
    ),
    extras: readDemoState().extras,
  };
}

export async function saveModuleRow(
  key: ExtraKey,
  payload: ModuleRow | (Partial<ModuleRow> & { id: string }),
) {
  return demoUpsertExtra(key, payload);
}

export async function removeModuleRow(key: ExtraKey, id: string) {
  return demoDeleteExtra(key, id);
}

export async function restoreExcluido(id: string) {
  return demoRestoreExcluido(id);
}

export async function saveProfile(id: string, patch: Pick<Profile, "nome">, demo: boolean) {
  if (demo) return demoUpdateProfile(patch);
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as Profile;
}

export async function saveTenant(id: string, patch: TenantUpdate, demo: boolean) {
  if (demo) return demoUpdateTenant(patch);
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tenants")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as Tenant;
}

export async function saveVeiculo(
  payload: VeiculoInsert | (VeiculoUpdate & { id: string }),
  demo: boolean,
) {
  if (demo) return demoUpsertVeiculo(payload);
  const supabase = createClient();
  let saved: Veiculo;
  if ("id" in payload && payload.id) {
    const { id, ...patch } = payload;
    const { data, error } = await supabase
      .from("veiculos")
      .update(patch as VeiculoUpdate)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    saved = mapVeiculo(data as Veiculo);
  } else {
    const { data, error } = await supabase
      .from("veiculos")
      .insert(payload as VeiculoInsert)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    saved = mapVeiculo(data as Veiculo);
  }
  const snap = await loadAppSnapshot();
  await syncVitrineFromClient(snap.veiculos);
  return saved;
}

export async function removeVeiculo(id: string, demo: boolean) {
  if (demo) {
    demoDeleteVeiculo(id);
    return;
  }
  const supabase = createClient();
  const { error } = await supabase.from("veiculos").delete().eq("id", id);
  if (error) throw new Error(error.message);
  const snap = await loadAppSnapshot();
  await syncVitrineFromClient(snap.veiculos);
}

export async function saveCliente(
  payload: ClienteInsert | (ClienteUpdate & { id: string }),
  demo: boolean,
) {
  if (demo) return demoUpsertCliente(payload);
  const supabase = createClient();
  if ("id" in payload && payload.id) {
    const { id, ...patch } = payload;
    const { data, error } = await supabase
      .from("clientes")
      .update(patch as ClienteUpdate)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return data as Cliente;
  }
  const { data, error } = await supabase
    .from("clientes")
    .insert(payload as ClienteInsert)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as Cliente;
}

export async function removeCliente(_id: string, _demo: boolean) {
  throw new Error(recusarExclusao());
}

export async function saveFinanceiro(
  payload: FinanceiroInsert | (FinanceiroUpdate & { id: string }),
  demo: boolean,
) {
  if (demo) return demoUpsertFinanceiro(payload);
  const supabase = createClient();
  if ("id" in payload && payload.id) {
    const { id, ...patch } = payload;
    const { data, error } = await supabase
      .from("financeiro")
      .update(patch as FinanceiroUpdate)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return mapFinanceiro(data as LancamentoFinanceiro);
  }
  const { data, error } = await supabase
    .from("financeiro")
    .insert(payload as FinanceiroInsert)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return mapFinanceiro(data as LancamentoFinanceiro);
}

export async function removeFinanceiro(id: string, demo: boolean) {
  if (demo) return demoDeleteFinanceiro(id);
  const supabase = createClient();
  const { error } = await supabase.from("financeiro").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function uploadPublicFile(options: {
  bucket: "veiculos" | "logos";
  tenantId: string;
  file: File;
  prefix?: string;
  demo: boolean;
}) {
  if (options.demo) {
    const dataUrl = await fileToDataUrl(options.file);
    return dataUrl;
  }

  const supabase = createClient();
  const rawExt = options.file.name.includes(".")
    ? options.file.name.split(".").pop()?.toLowerCase()
    : undefined;
  const ext = rawExt && /^[a-z0-9]+$/.test(rawExt) ? rawExt : "jpg";
  const path = `${options.tenantId}/${options.prefix ?? "arquivo"}-${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from(options.bucket)
    .upload(path, options.file, {
      upsert: true,
      contentType: options.file.type,
    });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from(options.bucket).getPublicUrl(path);
  return data.publicUrl;
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Falha ao ler o arquivo"));
    reader.readAsDataURL(file);
  });
}
