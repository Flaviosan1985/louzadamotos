import { test } from "node:test";
import assert from "node:assert/strict";
import { formatarNumero, proximoValor, vinculoVenda } from "./numeracao.ts";

test("numeração sequencial de venda e contrato", () => {
  assert.equal(formatarNumero("venda", 1, 2026), "VD-2026-00001");
  assert.equal(formatarNumero("contrato", 12, 2026), "CT-2026-00012");
  assert.equal(proximoValor(0), 1);
  assert.equal(proximoValor(41), 42);
});

test("venda amarra cliente, veículo e número", () => {
  const venda = vinculoVenda({
    id: "vd-1",
    tenant_id: "t-1",
    numero: "VD-2026-00001",
    cliente_id: "c-2",
    veiculo_id: "v-4",
    kanban_id: "kb-4",
    valor: "72900",
    data: "2026-10-04",
    criado_em: "2026-10-04T15:00:00.000Z",
  });
  assert.equal(venda.cliente_id, "c-2");
  assert.equal(venda.veiculo_id, "v-4");
  assert.equal(venda.numero, "VD-2026-00001");
  assert.throws(
    () =>
      vinculoVenda({
        id: "vd-2",
        tenant_id: "t-1",
        numero: "VD-2026-00002",
        cliente_id: "",
        veiculo_id: "v-4",
        kanban_id: "kb-4",
        valor: "1",
        data: "2026-10-04",
        criado_em: "2026-10-04T15:00:00.000Z",
      }),
    /cliente/i,
  );
});
