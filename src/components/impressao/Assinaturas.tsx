export function Assinaturas({ partes }: { partes: { papel: string; nome: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-10 pt-16 print:break-inside-avoid">
      {partes.map((p) => (
        <div key={p.papel} className="border-t border-black pt-1 text-center text-xs">
          <p className="font-medium">{p.nome || "\u00a0"}</p>
          <p>{p.papel}</p>
        </div>
      ))}
    </div>
  );
}
