import { test } from "node:test";
import assert from "node:assert/strict";
import { DOCUMENTOS_VEICULO, progressoChecklist } from "./checklist.ts";

test("lista de documentos tem chaves únicas", () => {
  const chaves = DOCUMENTOS_VEICULO.map((d) => d.chave);
  assert.equal(new Set(chaves).size, chaves.length);
  assert.ok(chaves.length >= 6);
});

test("progresso sem registro: nada entregue", () => {
  const p = progressoChecklist(undefined);
  assert.equal(p.feitos, 0);
  assert.equal(p.total, DOCUMENTOS_VEICULO.length);
  assert.equal(p.pendentes.length, DOCUMENTOS_VEICULO.length);
});

test("progresso conta só valores sim", () => {
  const [a, b] = DOCUMENTOS_VEICULO;
  const p = progressoChecklist({ [a.chave]: "sim", [b.chave]: "nao", outro: "sim" });
  assert.equal(p.feitos, 1);
  assert.ok(!p.pendentes.some((d) => d.chave === a.chave));
  assert.ok(p.pendentes.some((d) => d.chave === b.chave));
});
