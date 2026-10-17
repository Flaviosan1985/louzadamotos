"use client";

import { useEffect, useState } from "react";
import { usePanelNav } from "@/components/layout/panel/PanelNavProvider";
import { toast } from "sonner";
import { loadAppSnapshot, saveVeiculo, uploadPublicFile } from "@/lib/data/app-data";
import { STATUS_VEICULO, TIPOS_VEICULO } from "@/lib/constants";
import type { StatusVeiculo, TipoVeiculo, Veiculo } from "@/lib/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { FormField } from "@/components/shared/FormField";
import {
  validateVeiculo,
  type VeiculoFormErrors,
} from "@/lib/veiculos/validate-veiculo";

const currentYear = new Date().getFullYear();

export function VeiculoForm({ veiculoId }: { veiculoId?: string }) {
  const { navigate } = usePanelNav();
  const [loading, setLoading] = useState(Boolean(veiculoId));
  const [saving, setSaving] = useState(false);
  const [tenantId, setTenantId] = useState("");
  const [demo, setDemo] = useState(true);
  const [fotos, setFotos] = useState<string[]>([]);
  const [vendidoEm, setVendidoEm] = useState<string | null>(null);
  const [errors, setErrors] = useState<VeiculoFormErrors>({});
  const [form, setForm] = useState({
    tipo: "carro" as TipoVeiculo,
    marca: "",
    modelo: "",
    ano_fabricacao: currentYear,
    ano_modelo: currentYear,
    placa: "",
    renavam: "",
    km: 0,
    cor: "",
    preco_custo: 0,
    preco_venda: 0,
    status: "disponivel" as StatusVeiculo,
    observacoes: "",
  });

  useEffect(() => {
    let cancelled = false;

    loadAppSnapshot()
      .then((snapshot) => {
        if (cancelled) return;
        setTenantId(snapshot.tenant.id);
        setDemo(snapshot.mode === "demo");
        if (!veiculoId) return;
        const found = snapshot.veiculos.find((item) => item.id === veiculoId);
        if (!found) throw new Error("Veículo não encontrado.");
        setFotos(found.fotos ?? []);
        setVendidoEm(found.vendido_em);
        setForm({
          tipo: found.tipo,
          marca: found.marca,
          modelo: found.modelo,
          ano_fabricacao: found.ano_fabricacao,
          ano_modelo: found.ano_modelo,
          placa: found.placa ?? "",
          renavam: found.renavam ?? "",
          km: found.km,
          cor: found.cor ?? "",
          preco_custo: found.preco_custo,
          preco_venda: found.preco_venda,
          status: found.status,
          observacoes: found.observacoes ?? "",
        });
      })
      .catch((error: Error) => {
        if (!cancelled) toast.error(error.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [veiculoId]);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function onUpload(files: FileList | null) {
    if (!files?.length) return;
    try {
      const urls = await Promise.all(
        Array.from(files).map((file) =>
          uploadPublicFile({
            bucket: "veiculos",
            tenantId,
            file,
            prefix: veiculoId ?? "novo",
            demo,
          }),
        ),
      );
      setFotos((current) => [...current, ...urls]);
      toast.success("Foto enviada.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha no upload.");
    }
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors = validateVeiculo(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    try {
      const payload = {
        ...(veiculoId ? { id: veiculoId } : { tenant_id: tenantId }),
        ...form,
        placa: form.placa || null,
        renavam: form.renavam || null,
        cor: form.cor || null,
        observacoes: form.observacoes || null,
        fotos,
        vendido_em: form.status === "vendido" ? (vendidoEm ?? new Date().toISOString()) : null,
      };
      const saved = await saveVeiculo(payload, demo);
      toast.success(veiculoId ? "Veículo atualizado." : "Veículo cadastrado.");
      navigate(saved.status === "vendido" ? "/veiculos/vendidos" : "/veiculos/a-venda");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível salvar.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Skeleton className="h-96 w-full" />;

  return (
    <form onSubmit={onSubmit} className="bg-card space-y-5 rounded-xl border p-6" noValidate>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Tipo">
          <select
            className="border-input h-9 w-full rounded-md border bg-transparent px-2.5 text-sm"
            value={form.tipo}
            onChange={(event) => update("tipo", event.target.value as TipoVeiculo)}
          >
            {TIPOS_VEICULO.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Status">
          <select
            className="border-input h-9 w-full rounded-md border bg-transparent px-2.5 text-sm"
            value={form.status}
            onChange={(event) => update("status", event.target.value as StatusVeiculo)}
          >
            {STATUS_VEICULO.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Marca" error={errors.marca}>
          <Input
            aria-invalid={Boolean(errors.marca)}
            value={form.marca}
            onChange={(event) => update("marca", event.target.value)}
          />
        </FormField>
        <FormField label="Modelo" error={errors.modelo}>
          <Input
            aria-invalid={Boolean(errors.modelo)}
            value={form.modelo}
            onChange={(event) => update("modelo", event.target.value)}
          />
        </FormField>
        <FormField label="Ano fabricação" error={errors.ano_fabricacao}>
          <Input
            type="number"
            aria-invalid={Boolean(errors.ano_fabricacao)}
            value={form.ano_fabricacao}
            onChange={(event) => update("ano_fabricacao", Number(event.target.value))}
          />
        </FormField>
        <FormField label="Ano modelo" error={errors.ano_modelo}>
          <Input
            type="number"
            aria-invalid={Boolean(errors.ano_modelo)}
            value={form.ano_modelo}
            onChange={(event) => update("ano_modelo", Number(event.target.value))}
          />
        </FormField>
        <FormField label="Placa">
          <Input value={form.placa} onChange={(event) => update("placa", event.target.value.toUpperCase())} />
        </FormField>
        <FormField label="Renavam">
          <Input value={form.renavam} onChange={(event) => update("renavam", event.target.value)} />
        </FormField>
        <FormField label="KM" error={errors.km}>
          <Input
            type="number"
            aria-invalid={Boolean(errors.km)}
            value={form.km}
            onChange={(event) => update("km", Number(event.target.value))}
          />
        </FormField>
        <FormField label="Cor">
          <Input value={form.cor} onChange={(event) => update("cor", event.target.value)} />
        </FormField>
        <FormField label="Preço de custo" error={errors.preco_custo}>
          <Input
            type="number"
            step="0.01"
            aria-invalid={Boolean(errors.preco_custo)}
            value={form.preco_custo}
            onChange={(event) => update("preco_custo", Number(event.target.value))}
          />
        </FormField>
        <FormField label="Preço de venda" error={errors.preco_venda}>
          <Input
            type="number"
            step="0.01"
            aria-invalid={Boolean(errors.preco_venda)}
            value={form.preco_venda}
            onChange={(event) => update("preco_venda", Number(event.target.value))}
          />
        </FormField>
      </div>
      <FormField label="Observações">
        <Textarea value={form.observacoes} onChange={(event) => update("observacoes", event.target.value)} />
      </FormField>
      <FormField label="Fotos">
        <Input type="file" accept="image/*" multiple onChange={(event) => onUpload(event.target.files)} />
        {fotos.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {fotos.map((foto) => (
              <img key={foto} src={foto} alt="" className="size-20 rounded-md object-cover" />
            ))}
          </div>
        ) : null}
      </FormField>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Cancelar
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? "Salvando..." : "Salvar veículo"}
        </Button>
      </div>
    </form>
  );
}
