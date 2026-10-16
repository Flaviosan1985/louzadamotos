import { test } from "node:test";
import assert from "node:assert/strict";
import { navItems } from "../../configs/navConfig.ts";
import {
  filtrarNav,
  pode,
  rotaPermitida,
  type Acao,
} from "./permissoes.ts";

const ACOES: Acao[] = [
  "financeiro.acessar",
  "usuarios.gerenciar",
  "configuracoes.editar",
  "modelos_contrato.editar",
  "cliente.anonimizar",
  "cliente.excluir",
  "cliente.exportar",
  "comercial.escrever",
  "documentos.anexar",
  "audit.ler",
  "contratos.gerar",
];

test("ninguém exclui cliente — só anonimiza", () => {
  for (const papel of ["admin", "vendedor", "financeiro"] as const) {
    assert.equal(pode(papel, "cliente.excluir"), false);
  }
  assert.equal(pode("admin", "cliente.anonimizar"), true);
  assert.equal(pode("vendedor", "cliente.anonimizar"), false);
});

test("admin opera o comercial e o caixa, vendedor não entra no financeiro", () => {
  assert.equal(pode("admin", "financeiro.acessar"), true);
  assert.equal(pode("admin", "comercial.escrever"), true);
  assert.equal(pode("vendedor", "financeiro.acessar"), false);
  assert.equal(pode("vendedor", "comercial.escrever"), true);
  assert.equal(pode("vendedor", "documentos.anexar"), true);
  assert.equal(pode("vendedor", "contratos.gerar"), true);
  assert.equal(pode("vendedor", "usuarios.gerenciar"), false);
  assert.equal(pode("vendedor", "modelos_contrato.editar"), false);
});

test("financeiro vê o caixa e o audit, não gera venda", () => {
  assert.equal(pode("financeiro", "financeiro.acessar"), true);
  assert.equal(pode("financeiro", "audit.ler"), true);
  assert.equal(pode("financeiro", "comercial.escrever"), false);
  assert.equal(pode("financeiro", "usuarios.gerenciar"), false);
  assert.equal(pode("financeiro", "configuracoes.editar"), false);
});

test("rotas de usuários e financeiro respeitam o papel", () => {
  assert.equal(rotaPermitida("/cadastros/usuarios", "admin"), true);
  assert.equal(rotaPermitida("/cadastros/usuarios", "vendedor"), false);
  assert.equal(rotaPermitida("/financeiro/resumo", "vendedor"), false);
  assert.equal(rotaPermitida("/financeiro/resumo", "admin"), true);
  assert.equal(rotaPermitida("/financeiro/resumo", "financeiro"), true);
  assert.equal(rotaPermitida("/atalhos/kanban", "vendedor"), true);
  assert.equal(rotaPermitida("/configuracoes/contratos", "vendedor"), false);
  assert.equal(rotaPermitida("/configuracoes/contratos", "admin"), true);
  assert.equal(rotaPermitida("/cadastros/clientes", "vendedor"), true);
  assert.equal(rotaPermitida("/relatorios/acoes", "vendedor"), false);
  assert.equal(rotaPermitida("/relatorios/acoes", "admin"), true);
});

test("menu esconde usuários e financeiro do vendedor", () => {
  const filtrado = filtrarNav(navItems, "vendedor");
  const labels = filtrado.flatMap((g) => g.items.map((i) => i.label));
  assert.equal(labels.includes("Financeiro"), false);
  const cadastros = filtrado[0]?.items.find((i) => i.label === "Cadastros");
  const filhos = cadastros?.childItems?.map((c) => ("label" in c ? c.label : "")) ?? [];
  assert.equal(filhos.includes("Usuários"), false);
  assert.equal(filhos.includes("Clientes"), true);
});

test("toda ação conhecida tem resposta boolean", () => {
  for (const acao of ACOES) {
    assert.equal(typeof pode("admin", acao), "boolean");
  }
});
