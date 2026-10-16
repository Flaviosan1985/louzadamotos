"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { loadAppSnapshot, saveTenant, uploadPublicFile } from "@/lib/data/app-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { FormField } from "@/components/shared/FormField";

export function PropriedadesForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [id, setId] = useState("");
  const [demo, setDemo] = useState(true);
  const [form, setForm] = useState({
    nome: "",
    cnpj: "",
    telefone: "",
    logo_url: "",
  });

  useEffect(() => {
    let cancelled = false;

    loadAppSnapshot()
      .then((snapshot) => {
        if (cancelled) return;
        setId(snapshot.tenant.id);
        setDemo(snapshot.mode === "demo");
        setForm({
          nome: snapshot.tenant.nome,
          cnpj: snapshot.tenant.cnpj ?? "",
          telefone: snapshot.tenant.telefone ?? "",
          logo_url: snapshot.tenant.logo_url ?? "",
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
  }, []);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      await saveTenant(
        id,
        {
          nome: form.nome,
          cnpj: form.cnpj || null,
          telefone: form.telefone || null,
          logo_url: form.logo_url || null,
        },
        demo,
      );
      toast.success("Dados da revenda atualizados.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Skeleton className="h-64 w-full" />;

  return (
    <form onSubmit={onSubmit} className="bg-card mx-auto max-w-xl space-y-4 rounded-xl border p-6">
      <div>
        <h1 className="text-2xl font-semibold">Propriedades</h1>
        <p className="text-muted-foreground text-sm">Nome, CNPJ e logotipo da revenda.</p>
      </div>
      <FormField label="Nome da loja">
        <Input required value={form.nome} onChange={(event) => setForm({ ...form, nome: event.target.value })} />
      </FormField>
      <FormField label="CNPJ">
        <Input value={form.cnpj} onChange={(event) => setForm({ ...form, cnpj: event.target.value })} />
      </FormField>
      <FormField label="Telefone">
        <Input value={form.telefone} onChange={(event) => setForm({ ...form, telefone: event.target.value })} />
      </FormField>
      <FormField label="Logotipo">
        <Input
          type="file"
          accept="image/*"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            try {
              const url = await uploadPublicFile({
                bucket: "logos",
                tenantId: id,
                file,
                prefix: "logo",
                demo,
              });
              setForm((current) => ({ ...current, logo_url: url }));
              toast.success("Logotipo enviado.");
            } catch (error) {
              toast.error(error instanceof Error ? error.message : "Falha no upload.");
            }
          }}
        />
        {form.logo_url ? (
          <img src={form.logo_url} alt="Logotipo da revenda" className="mt-3 h-16 object-contain" />
        ) : null}
      </FormField>
      <div className="flex justify-end">
        <Button type="submit" disabled={saving}>
          {saving ? "Salvando..." : "Salvar alterações"}
        </Button>
      </div>
    </form>
  );
}
