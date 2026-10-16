export function SobrePage() {
  return (
    <div className="bg-card mx-auto max-w-xl space-y-4 rounded-xl border p-6">
      <div>
        <h1 className="text-2xl font-semibold">Sobre</h1>
        <p className="text-muted-foreground text-sm">O Pátio organiza o dia a dia da revenda multimarcas.</p>
      </div>
      <p className="text-sm leading-6">
        Cadastre veículos e clientes, acompanhe o caixa, emita notas, consulte Renave e IPVA e acompanhe o funil
        comercial no kanban. Cada loja vê só os próprios dados.
      </p>
      <dl className="grid gap-3 text-sm">
        <div>
          <dt className="text-muted-foreground text-xs uppercase">Produto</dt>
          <dd className="font-medium">Pátio</dd>
        </div>
        <div>
          <dt className="text-muted-foreground text-xs uppercase">Versão</dt>
          <dd className="font-medium">0.1.0</dd>
        </div>
      </dl>
    </div>
  );
}
