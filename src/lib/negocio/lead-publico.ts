import { somenteDigitos } from "./documento.ts";

export type LeadPublico = {
  nome: string;
  telefone: string;
  email: string;
  interesse: string;
  origem: string;
  status: "novo";
  veiculo_site_id: string;
};

export type LeadValidado =
  | { ok: true; lead: LeadPublico }
  | { ok: false; erro: string; status: number };

function texto(valor: unknown) {
  return typeof valor === "string" ? valor.trim() : "";
}

export function validarLeadPublico(input: unknown): LeadValidado {
  if (!input || typeof input !== "object") {
    return { ok: false, erro: "JSON inválido.", status: 400 };
  }
  const body = input as Record<string, unknown>;
  const origem = texto(body.origem) || "site";
  const interesse = texto(body.interesse) || texto(body.veiculo);
  const nomeInformado = texto(body.nome);
  const telefone = somenteDigitos(texto(body.telefone));
  const email = texto(body.email);
  const veiculo_site_id = texto(body.veiculo_site_id ?? body.veiculo_id);

  if (origem === "site") {
    if (!interesse) return { ok: false, erro: "Informe o veículo de interesse.", status: 400 };
    return {
      ok: true,
      lead: {
        nome: nomeInformado || "Visitante do site",
        telefone,
        email,
        interesse,
        origem: "site",
        status: "novo",
        veiculo_site_id,
      },
    };
  }

  if (!nomeInformado || nomeInformado.length < 2) {
    return { ok: false, erro: "Informe o nome.", status: 400 };
  }
  if (telefone.length !== 10 && telefone.length !== 11) {
    return { ok: false, erro: "Telefone com DDD inválido.", status: 400 };
  }
  if (!interesse) return { ok: false, erro: "Informe o interesse.", status: 400 };

  return {
    ok: true,
    lead: {
      nome: nomeInformado,
      telefone,
      email,
      interesse,
      origem,
      status: "novo",
      veiculo_site_id,
    },
  };
}

export function leadParaRegistro(
  lead: LeadPublico,
  ids: { id: string; tenant_id: string; criado_em: string },
) {
  return {
    id: ids.id,
    tenant_id: ids.tenant_id,
    criado_em: ids.criado_em,
    nome: lead.nome,
    telefone: lead.telefone,
    email: lead.email,
    interesse: lead.interesse,
    origem: lead.origem,
    status: lead.status,
    veiculo_site_id: lead.veiculo_site_id,
  };
}

export function leadParaKanban(
  lead: LeadPublico,
  ids: { id: string; tenant_id: string; criado_em: string },
) {
  return {
    id: ids.id,
    tenant_id: ids.tenant_id,
    criado_em: ids.criado_em,
    titulo: `${lead.interesse} — ${lead.nome}`,
    cliente: lead.nome,
    telefone: lead.telefone,
    veiculo: lead.interesse,
    coluna: "Novo lead",
    etapa_em: ids.criado_em,
    origem: lead.origem,
  };
}
