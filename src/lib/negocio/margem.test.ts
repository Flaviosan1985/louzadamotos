import { test } from "node:test";
import assert from "node:assert/strict";
import { margemVeiculo, margemMedia, percentualComissao } from "./margem.ts";

const veiculo = { id: "v", preco_custo: 80000, preco_venda: 100000 };
const lanc = (campos: Partial<{ tipo: string; categoria: string; valor: number; veiculo_id: string | null }>) => ({
  tipo: "despesa",
  categoria: "Oficina / preparação",
  valor: 0,
  veiculo_id: "v",
  ...campos,
});

test("margem desconta despesas do veículo e comissão", () => {
  const m = margemVeiculo(
    veiculo,
    [
      lanc({ valor: 1500 }),
      lanc({ valor: 500, categoria: "Documentação" }),
      lanc({ valor: 80000, categoria: "Compra de veículo" }),
      lanc({ valor: 999, veiculo_id: "outro" }),
      lanc({ valor: 100000, tipo: "receita", categoria: "Venda de veículo" }),
    ],
    1.5,
  );
  assert.equal(m.despesas, 2000);
  assert.equal(m.comissao, 1500);
  assert.equal(m.margem, 100000 - 80000 - 2000 - 1500);
  assert.equal(m.margemPct, m.margem / 100000);
});

test("veículo sem preço de venda tem margem percentual nula", () => {
  const m = margemVeiculo({ id: "v", preco_custo: 0, preco_venda: 0 }, [], 0);
  assert.equal(m.margemPct, null);
});

test("margem média dos percentuais válidos", () => {
  assert.equal(margemMedia([{ margemPct: 0.1 }, { margemPct: 0.2 }, { margemPct: null }]), 0.15000000000000002);
  assert.equal(margemMedia([]), null);
});

test("percentual de comissão lido do cadastro em formato brasileiro", () => {
  assert.equal(percentualComissao([{ percentual: "1,5" }]), 1.5);
  assert.equal(percentualComissao([{ percentual: "x" }]), 0);
  assert.equal(percentualComissao([]), 0);
});
