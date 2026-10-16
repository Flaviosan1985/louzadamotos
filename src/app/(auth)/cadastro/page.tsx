"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/FormField";
import { Toaster } from "@/components/ui/sonner";

export default function CadastroPage() {
  const router = useRouter();
  const configured = getSupabaseEnv().isConfigured;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    nomeLoja: "",
    email: "",
    password: "",
  });

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!configured) {
      toast.error("Configure o Supabase para criar uma revenda real.");
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            nome: form.nome,
            nome_loja: form.nomeLoja,
          },
        },
      });
      if (error) throw error;
      toast.success("Conta criada. Verifique o e-mail se a confirmação estiver ativa.");
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível cadastrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/40 p-6">
      <Toaster />
      <form onSubmit={onSubmit} className="bg-card w-full max-w-md space-y-4 rounded-xl border p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Cadastrar revenda</h1>
        <FormField label="Seu nome">
          <Input required value={form.nome} onChange={(event) => setForm({ ...form, nome: event.target.value })} />
        </FormField>
        <FormField label="Nome da loja">
          <Input
            required
            value={form.nomeLoja}
            onChange={(event) => setForm({ ...form, nomeLoja: event.target.value })}
          />
        </FormField>
        <FormField label="E-mail">
          <Input
            type="email"
            required
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
        </FormField>
        <FormField label="Senha">
          <Input
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
          />
        </FormField>
        <Button type="submit" className="w-full" disabled={loading || !configured}>
          {loading ? "Criando..." : "Criar conta"}
        </Button>
        <p className="text-muted-foreground text-center text-sm">
          Já tem acesso?{" "}
          <Link className="text-foreground underline" href="/login">
            Entrar
          </Link>
        </p>
      </form>
    </main>
  );
}
