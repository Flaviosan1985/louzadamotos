import { Suspense } from "react";
import { AdminLoginForm } from "@/components/louzada/admin/AdminLoginForm";

export default function PainelLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Suspense fallback={<p className="text-sm text-zinc-500">Carregando…</p>}>
        <AdminLoginForm defaultNext="/painel" />
      </Suspense>
    </div>
  );
}
