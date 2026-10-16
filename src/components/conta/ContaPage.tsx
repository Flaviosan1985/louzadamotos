"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { saveProfile } from "@/lib/data/app-data";
import { useAppSnapshot } from "@/hooks/use-app-snapshot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QueryState } from "@/components/shared/QueryState";
import { FormField } from "@/components/shared/FormField";

const PAPEIS: Record<string, string> = {
  admin: "Admin",
  vendedor: "Vendedor",
  financeiro: "Financeiro",
};

export function ContaPage() {
  const { data, error, loading, refetch } = useAppSnapshot();
  const [nome, setNome] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) setNome(data.profile.nome);
  }, [data]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!data) return;
    const trimmed = nome.trim();
    if (!trimmed) {
      toast.error("Informe o nome.");
      return;
    }
    setSaving(true);
    try {
      await saveProfile(data.profile.id, { nome: trimmed }, data.mode === "demo");
      toast.success("Conta atualizada.");
      await refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <QueryState loading={loading && !data} error={error} empty={false} onRetry={refetch}>
      <QueryState.Loading />
      <QueryState.Error />
      <QueryState.Ready>
        <form onSubmit={onSubmit} className="bg-card mx-auto max-w-xl space-y-4 rounded-xl border p-6" noValidate>
          <div>
            <h1 className="text-2xl font-semibold">Conta</h1>
            <p className="text-muted-foreground text-sm">Seu perfil nesta revenda.</p>
          </div>
          <FormField htmlFor="conta-nome" label="Nome">
            <Input id="conta-nome" value={nome} onChange={(event) => setNome(event.target.value)} />
          </FormField>
          <FormField htmlFor="conta-papel" label="Papel">
            <Input id="conta-papel" value={PAPEIS[data?.profile.papel ?? ""] ?? data?.profile.papel ?? ""} disabled />
          </FormField>
          <FormField htmlFor="conta-revenda" label="Revenda">
            <Input id="conta-revenda" value={data?.tenant.nome ?? ""} disabled />
          </FormField>
          <FormField htmlFor="conta-modo" label="Modo">
            <Input id="conta-modo" value={data?.mode === "demo" ? "Demonstração" : "Produção"} disabled />
          </FormField>
          <Button type="submit" disabled={saving}>
            {saving ? "Salvando..." : "Salvar"}
          </Button>
        </form>
      </QueryState.Ready>
    </QueryState>
  );
}
