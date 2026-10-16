"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useAppSnapshot } from "@/hooks/use-app-snapshot";
import { saveModuleRow } from "@/lib/data/app-data";
import { formatCurrency, formatPlaca } from "@/lib/format";
import { AVISO_SIMULACAO } from "@/lib/negocio/avisos";
import {
  parseDecimalBR,
  simular,
  validarSimulacao,
  type SimulacaoEntrada,
} from "@/lib/negocio/simulacao";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/FormField";
import { AvisoLegal } from "@/components/shared/AvisoLegal";
import { ModuleHeader } from "@/components/shared/ModuleHeader";
import { QueryState } from "@/components/shared/QueryState";
import { SimulacaoCenarioCard } from "@/components/atalhos/SimulacaoCenarioCard";
import { SimulacoesSalvas } from "@/components/atalhos/SimulacoesSalvas";

type Campo = keyof SimulacaoEntrada;

const CAMPOS: { key: Campo; label: string; inputMode: "decimal" | "numeric" }[] = [
  { key: "valor", label: "Valor do veículo (R$)", inputMode: "decimal" },
  { key: "desconto", label: "Desconto (R$)", inputMode: "decimal" },
  { key: "entrada", label: "Entrada (R$)", inputMode: "decimal" },
  { key: "troca", label: "Valor da troca (R$)", inputMode: "decimal" },
  { key: "prazo", label: "Prazo (12 a 60 meses)", inputMode: "numeric" },
  { key: "taxaMensalPct", label: "Taxa ao mês (%)", inputMode: "decimal" },
  { key: "tarifas", label: "Tarifas (R$)", inputMode: "decimal" },
  { key: "iof", label: "IOF (R$)", inputMode: "decimal" },
  { key: "renda", label: "Renda mensal do cliente (R$)", inputMode: "decimal" },
];

const INICIAL: Record<Campo, string> = {
  valor: "",
  desconto: "0",
  entrada: "0",
  troca: "0",
  prazo: "36",
  taxaMensalPct: "1,79",
  tarifas: "0",
  iof: "0",
  renda: "",
};

const selectClass = "border-input h-9 w-full rounded-md border bg-transparent px-2.5 text-sm";

export function CalculadoraPage() {
  const { data, error, loading, refetch } = useAppSnapshot();
  const [form, setForm] = useState(INICIAL);
  const [veiculoId, setVeiculoId] = useState("");
  const [clienteId, setClienteId] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const estoque = useMemo(
    () => (data?.veiculos ?? []).filter((v) => v.status !== "vendido"),
    [data?.veiculos],
  );

  const entrada = useMemo(
    () =>
      Object.fromEntries(CAMPOS.map(({ key }) => [key, parseDecimalBR(form[key])])) as SimulacaoEntrada,
    [form],
  );
  const errors = useMemo(() => validarSimulacao(entrada), [entrada]);
  const valido = Object.keys(errors).length === 0;
  const resultado = useMemo(() => (valido ? simular(entrada) : null), [entrada, valido]);

  function setCampo(key: Campo, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function escolherVeiculo(id: string) {
    setVeiculoId(id);
    const veiculo = estoque.find((v) => v.id === id);
    if (veiculo) setCampo("valor", String(veiculo.preco_venda).replace(".", ","));
  }

  async function salvar() {
    setSubmitted(true);
    if (!data || !resultado) return;
    const veiculo = estoque.find((v) => v.id === veiculoId);
    const cliente = data.clientes.find((c) => c.id === clienteId);
    const cenario = resultado.comTroca ?? resultado.financiado;
    setSaving(true);
    try {
      await saveModuleRow("simulacoes", {
        id: crypto.randomUUID(),
        tenant_id: data.tenant.id,
        criado_em: new Date().toISOString(),
        veiculo_id: veiculo?.id ?? "",
        veiculo: veiculo ? `${veiculo.marca} ${veiculo.modelo} · ${formatPlaca(veiculo.placa)}` : "",
        cliente_id: cliente?.id ?? "",
        cliente: cliente?.nome ?? "",
        ...Object.fromEntries(CAMPOS.map(({ key }) => [key, String(entrada[key])])),
        parcela: cenario ? cenario.parcela.toFixed(2) : "",
        cet_anual: cenario ? cenario.cetAnual.toFixed(6) : "",
        status: "rascunho",
      });
      toast.success("Simulação salva.");
      await refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha ao salvar a simulação.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <QueryState loading={loading && !data} error={error} empty={false} onRetry={refetch}>
      <QueryState.Loading />
      <QueryState.Error />
      <QueryState.Ready>
        <div className="space-y-5">
          <ModuleHeader
            title="Simulador de venda"
            count={`${data?.extras.simulacoes.length ?? 0} simulação(ões) salva(s)`}
          />
          <p className="text-muted-foreground -mt-3 text-sm">
            Compare à vista, financiado e com troca usando a tabela Price.
          </p>
          <div className="grid gap-5 lg:grid-cols-[minmax(0,22rem)_1fr]">
            <form
              className="bg-card space-y-4 rounded-xl border p-5"
              onSubmit={(event) => {
                event.preventDefault();
                setSubmitted(true);
              }}
              noValidate
            >
              <FormField htmlFor="veiculo" label="Veículo do estoque">
                <select
                  id="veiculo"
                  className={selectClass}
                  value={veiculoId}
                  onChange={(event) => escolherVeiculo(event.target.value)}
                >
                  <option value="">Digitar valor manualmente</option>
                  {estoque.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.marca} {v.modelo} · {formatPlaca(v.placa)} · {formatCurrency(v.preco_venda)}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField htmlFor="cliente" label="Cliente (opcional)">
                <select
                  id="cliente"
                  className={selectClass}
                  value={clienteId}
                  onChange={(event) => setClienteId(event.target.value)}
                >
                  <option value="">Sem cliente</option>
                  {(data?.clientes ?? []).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  ))}
                </select>
              </FormField>
              <div className="grid grid-cols-2 gap-3">
                {CAMPOS.map(({ key, label, inputMode }) => {
                  const erro = submitted ? errors[key] : undefined;
                  return (
                    <FormField key={key} htmlFor={key} label={label} error={erro}>
                      <Input
                        id={key}
                        inputMode={inputMode}
                        aria-invalid={Boolean(erro)}
                        aria-describedby={erro ? `${key}-error` : undefined}
                        value={form[key]}
                        onChange={(event) => setCampo(key, event.target.value)}
                      />
                    </FormField>
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="submit">Calcular</Button>
                <Button type="button" variant="outline" disabled={saving} onClick={() => void salvar()}>
                  {saving ? "Salvando…" : "Salvar simulação"}
                </Button>
              </div>
            </form>
            <div className="space-y-4" aria-live="polite">
              {submitted && resultado ? (
                <>
                  <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                    <section aria-label="À vista" className="bg-card space-y-3 rounded-xl border p-5">
                      <h2 className="font-semibold">À vista</h2>
                      <p className="text-2xl font-semibold tabular-nums">
                        {formatCurrency(resultado.aVista.total)}
                      </p>
                      <p className="text-muted-foreground text-sm">Valor com desconto, sem troca.</p>
                    </section>
                    <SimulacaoCenarioCard
                      titulo="Financiado"
                      cenario={resultado.financiado}
                      prazo={entrada.prazo}
                      vazio="A entrada quita o veículo; não há saldo a financiar."
                    />
                    <SimulacaoCenarioCard
                      titulo="Com troca"
                      cenario={resultado.comTroca}
                      prazo={entrada.prazo}
                      vazio={
                        entrada.troca > 0
                          ? "Entrada e troca quitam o veículo."
                          : "Informe o valor da troca para comparar."
                      }
                    />
                  </div>
                  <AvisoLegal texto={AVISO_SIMULACAO} />
                </>
              ) : (
                <p className="text-muted-foreground bg-card rounded-xl border p-5 text-sm">
                  {submitted ? "Corrija os campos destacados para ver os cenários." : "Preencha os valores e clique em Calcular."}
                </p>
              )}
              <SimulacoesSalvas rows={data?.extras.simulacoes ?? []} />
            </div>
          </div>
        </div>
      </QueryState.Ready>
    </QueryState>
  );
}
