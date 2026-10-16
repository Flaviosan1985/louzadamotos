import { test } from "node:test";
import assert from "node:assert/strict";
import { anonimizarCliente, exportarDadosCliente, recusarExclusao } from "./privacidade.ts";

const cliente = {
  id: "c-1",
  tenant_id: "t-1",
  nome: "Mariana Alves",
  tipo_pessoa: "fisica" as const,
  documento: "123.456.789-09",
  telefone: "(11) 97777-0101",
  email: "mariana@email.com",
  endereco: "Rua A, 10",
  criado_em: "2026-01-01T00:00:00.000Z",
  anonimizado_em: null as string | null,
};

test("anonimiza dados pessoais e preserva o id fiscal", () => {
  const out = anonimizarCliente(cliente, "2026-10-16T12:00:00.000Z");
  assert.equal(out.id, "c-1");
  assert.equal(out.tipo_pessoa, "fisica");
  assert.equal(out.nome, "Cliente anonimizado");
  assert.equal(out.documento, null);
  assert.equal(out.telefone, null);
  assert.equal(out.email, null);
  assert.equal(out.endereco, null);
  assert.equal(out.anonimizado_em, "2026-10-16T12:00:00.000Z");
});

test("cliente já anonimizado não é processado de novo", () => {
  const first = anonimizarCliente(cliente, "2026-10-16T12:00:00.000Z");
  assert.throws(() => anonimizarCliente(first, "2026-10-17T00:00:00.000Z"), /já anonimizado/i);
});

test("exclusão é recusada por causa dos documentos fiscais", () => {
  assert.match(recusarExclusao(), /anonimizar/i);
});

test("exportação reúne cadastro, vendas e anexos sem apagar nada", () => {
  const json = exportarDadosCliente({
    cliente,
    vendas: [{ numero: "VD-2026-00001", veiculo: "Onix", valor: "72900" }],
    documentos: [{ tipo: "cnh", nome_arquivo: "cnh.pdf" }],
    contratos: [{ numero: "CT-2026-00001" }],
  });
  assert.equal(json.cliente.nome, "Mariana Alves");
  assert.equal(json.vendas[0]?.numero, "VD-2026-00001");
  assert.equal(json.documentos.length, 1);
  assert.equal(json.contratos[0]?.numero, "CT-2026-00001");
});
