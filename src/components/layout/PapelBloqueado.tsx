export function PapelBloqueado() {
  return (
    <div className="bg-card mx-auto max-w-lg space-y-2 rounded-xl border p-8 text-center">
      <h1 className="text-xl font-semibold">Sem permissão</h1>
      <p className="text-muted-foreground text-sm">
        Este perfil não acessa esta tela. Peça ao admin da loja se precisar deste módulo.
      </p>
    </div>
  );
}
