"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Car } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/FormField";
import { Toaster } from "@/components/ui/sonner";

export default function LoginPage() {
  const router = useRouter();
  const configured = getSupabaseEnv().isConfigured;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!configured) {
      toast.error("Configure o Supabase ou entre na demonstração.");
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Sessão iniciada.");
      router.push("/sistema");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível entrar.");
    } finally {
      setLoading(false);
    }
  }

  async function enterDemo() {
    setLoading(true);
    try {
      const response = await fetch("/api/demo/login", { method: "POST" });
      if (!response.ok) throw new Error("Falha ao abrir a demonstração.");
      router.push("/sistema");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha na demonstração.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/40 p-6">
      <Toaster />
      <div className="bg-card w-full max-w-md rounded-xl border p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <span className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-md">
            <Car className="size-5" />
          </span>
          <div>
            <h1 className="text-xl font-semibold">Admycar</h1>
            <p className="text-muted-foreground text-sm">Entre para gerir o pátio</p>
          </div>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <FormField label="E-mail">
            <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required={configured} />
          </FormField>
          <FormField label="Senha">
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required={configured}
            />
          </FormField>
          <Button type="submit" className="w-full" disabled={loading || !configured}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
        <Button variant="outline" className="mt-3 w-full" onClick={enterDemo} disabled={loading}>
          Acessar demonstração
        </Button>
        <p className="text-muted-foreground mt-4 text-center text-sm">
          Nova revenda?{" "}
          <Link className="text-foreground underline" href="/cadastro">
            Criar conta
          </Link>
        </p>
      </div>
    </main>
  );
}
