import { test } from "node:test";
import assert from "node:assert/strict";
import {
  VARIAVEIS_CONTRATO,
  congelarContrato,
  escaparHtml,
  extrairVariaveis,
  incrementarVersao,
  preencherModelo,
} from "./contrato.ts";

test("a lista de variáveis do contrato é fechada", () => {
  assert.ok(VARIAVEIS_CONTRATO.includes("cliente.nome"));
  assert.ok(VARIAVEIS_CONTRATO.includes("veiculo.placa"));
  assert.ok(VARIAVEIS_CONTRATO.includes("venda.numero"));
  assert.ok(VARIAVEIS_CONTRATO.includes("loja.nome"));
  assert.equal(new Set(VARIAVEIS_CONTRATO).size, VARIAVEIS_CONTRATO.length);
});

test("valores interpolados são escapados em HTML", () => {
  assert.equal(escaparHtml(`<script>alert("x")</script>`), "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;");
  const corpo = preencherModelo("Comprador: {{cliente.nome}}", {
    "cliente.nome": `<img src=x onerror=alert(1)>`,
  });
  assert.equal(corpo.includes("<img"), false);
  assert.equal(corpo.includes("&lt;img"), true);
});

test("variável fora da lista impede o preenchimento", () => {
  assert.deepEqual(extrairVariaveis("Olá {{cliente.nome}} e {{segredo}}"), ["cliente.nome", "segredo"]);
  assert.throws(
    () => preencherModelo("{{segredo}}", { segredo: "x" }),
    /variável não permitida/i,
  );
});

test("contrato gerado fica congelado com o texto já preenchido", () => {
  const gerado = congelarContrato("Texto {{cliente.nome}}", { "cliente.nome": "Ana" }, 3, "2026-10-16T12:00:00.000Z");
  assert.equal(gerado.corpo, "Texto Ana");
  assert.equal(gerado.versao_modelo, 3);
  assert.equal(gerado.gerado_em, "2026-10-16T12:00:00.000Z");
  assert.equal(Object.isFrozen(gerado), true);
});

test("editar o modelo sobe a versão", () => {
  assert.equal(incrementarVersao(1), 2);
});
