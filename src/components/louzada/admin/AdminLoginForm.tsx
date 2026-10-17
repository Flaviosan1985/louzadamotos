"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminCardClass } from "@/lib/louzada/admin-theme";

type AdminLoginFormProps = {
  defaultNext?: string;
};

export function AdminLoginForm({ defaultNext = "/painel" }: AdminLoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, password }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Usuário ou senha inválidos.");
      return;
    }
    const next = searchParams.get("next") || defaultNext;
    router.push(next);
    router.refresh();
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`mx-auto w-full max-w-md space-y-5 ${adminCardClass} p-8 text-zinc-900`}
    >
      <div className="text-center">
        <Image
          src="/logo.jpg"
          alt="Louzada Motos"
          width={160}
          height={64}
          className="mx-auto h-14 w-auto object-contain"
          priority
        />
        <h1 className="mt-4 text-lg font-bold text-zinc-900">Painel Louzada Motos</h1>
        <p className="text-sm text-zinc-500">Acesso restrito ao administrador</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="user">Usuário</Label>
        <Input id="user" value={user} onChange={(e) => setUser(e.target.value)} autoComplete="username" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
      </div>
      {error ? <p className="text-sm text-[#E10600]">{error}</p> : null}
      <Button
        type="submit"
        className="w-full bg-[#E10600] hover:bg-[#C00500] text-white"
        disabled={loading}
      >
        {loading ? "Entrando…" : "Entrar"}
      </Button>
    </form>
  );
}
