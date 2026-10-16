export function TutorialPage() {
  const steps = [
    { title: "Cadastre a loja", text: "Em Configurações → Propriedades, confirme nome, CNPJ e telefone." },
    { title: "Monte o pátio", text: "Adicione veículos com foto, placa e preços de custo e venda." },
    { title: "Traga os clientes", text: "Cadastre quem visita a loja para reservas, vendas e crédito." },
    { title: "Feche o caixa", text: "Registre receitas e despesas no Financeiro e baixe o que já foi pago." },
    { title: "Use os atalhos", text: "Renave, NF-e, agenda e kanban ficam na faixa da home." },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Tutorial</h1>
        <p className="text-muted-foreground text-sm">Caminho rápido para operar o Pátio no dia a dia.</p>
      </div>
      <ol className="space-y-3">
        {steps.map((step, index) => (
          <li key={step.title} className="bg-card rounded-xl border p-5">
            <p className="text-muted-foreground text-xs font-medium tracking-[0.16em] uppercase">
              Passo {index + 1}
            </p>
            <h2 className="mt-1 text-lg font-semibold">{step.title}</h2>
            <p className="text-muted-foreground mt-1 text-sm">{step.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
