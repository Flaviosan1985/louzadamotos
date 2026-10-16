import { test } from "node:test";
import assert from "node:assert/strict";
import { prazoTransferencia, transferenciasPendentes } from "./transferencia.ts";

const agora = new Date("2026-10-16T12:00:00");

test("prazo de 30 dias a partir da venda", () => {
  const p = prazoTransferencia("2026-10-04T15:00:00", agora);
  assert.equal(p.limite.getDate(), 3);
  assert.equal(p.limite.getMonth(), 10);
  assert.equal(p.diasRestantes, 18);
  assert.equal(p.situacao, "ok");
});

test("alerta quando faltam 5 dias ou menos", () => {
  const p = prazoTransferencia("2026-09-21T10:00:00", agora);
  assert.equal(p.diasRestantes, 5);
  assert.equal(p.situacao, "alerta");
});

test("vencido depois de 30 dias", () => {
  const p = prazoTransferencia("2026-09-01T10:00:00", agora);
  assert.ok(p.diasRestantes < 0);
  assert.equal(p.situacao, "vencido");
});

test("no dia limite ainda conta como alerta com zero dias", () => {
  const p = prazoTransferencia("2026-09-16T08:00:00", agora);
  assert.equal(p.diasRestantes, 0);
  assert.equal(p.situacao, "alerta");
});

test("pendentes ignora concluídas e veículos não vendidos", () => {
  const r = transferenciasPendentes(
    [
      { id: "a", status: "vendido", vendido_em: "2026-10-04T15:00:00" },
      { id: "b", status: "vendido", vendido_em: "2026-09-22T13:40:00" },
      { id: "c", status: "disponivel", vendido_em: null },
      { id: "d", status: "vendido", vendido_em: null },
    ],
    [{ veiculo_id: "b", status: "concluida" }],
    agora,
  );
  assert.deepEqual(r.map((x) => x.veiculoId), ["a"]);
  assert.equal(r[0].status, "pendente");
});

test("pendentes ordena pelo prazo mais curto", () => {
  const r = transferenciasPendentes(
    [
      { id: "a", status: "vendido", vendido_em: "2026-10-10T10:00:00" },
      { id: "b", status: "vendido", vendido_em: "2026-09-25T10:00:00" },
    ],
    [{ veiculo_id: "a", status: "em andamento" }],
    agora,
  );
  assert.deepEqual(r.map((x) => [x.veiculoId, x.status]), [
    ["b", "pendente"],
    ["a", "em andamento"],
  ]);
});
