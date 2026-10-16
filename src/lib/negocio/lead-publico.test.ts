import { test } from "node:test";
import assert from "node:assert/strict";
import { leadParaKanban, leadParaRegistro, validarLeadPublico } from "./lead-publico.ts";

test("clique Tenho interesse no site exige só o veículo", () => {
  const ok = validarLeadPublico({
    origem: "site",
    interesse: "Honda CB 500F",
    veiculo_site_id: "12",
  });
  assert.equal(ok.ok, true);
  if (!ok.ok) return;
  assert.equal(ok.lead.nome, "Visitante do site");
  assert.equal(ok.lead.origem, "site");
  assert.equal(ok.lead.status, "novo");
});

test("lead manual exige nome e telefone", () => {
  const falha = validarLeadPublico({ origem: "formulario", interesse: "Onix" });
  assert.equal(falha.ok, false);
  if (falha.ok) return;
  assert.equal(falha.status, 400);
});

test("JSON inválido e campos vazios são rejeitados", () => {
  assert.equal(validarLeadPublico("x").ok, false);
  assert.equal(validarLeadPublico({ origem: "site" }).ok, false);
  const tel = validarLeadPublico({
    origem: "formulario",
    nome: "Ana",
    telefone: "1199",
    interesse: "Moto",
  });
  assert.equal(tel.ok, false);
});

test("o lead vira cartão de Novo lead no funil", () => {
  const ok = validarLeadPublico({
    origem: "site",
    interesse: "Yamaha MT-07",
    veiculo_site_id: "2",
  });
  assert.equal(ok.ok, true);
  if (!ok.ok) return;
  const agora = "2026-10-16T12:00:00.000Z";
  const lead = leadParaRegistro(ok.lead, { id: "ld-9", tenant_id: "t-1", criado_em: agora });
  assert.equal(lead.interesse, "Yamaha MT-07");
  assert.equal(lead.origem, "site");
  const card = leadParaKanban(ok.lead, { id: "kb-9", tenant_id: "t-1", criado_em: agora });
  assert.equal(card.coluna, "Novo lead");
  assert.equal(card.veiculo, "Yamaha MT-07");
});
