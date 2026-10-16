export function DadosTabela({ titulo, linhas }: { titulo: string; linhas: [string, string][] }) {
  return (
    <section className="print:break-inside-avoid">
      <h2 className="mb-1 text-xs font-semibold tracking-wide uppercase">{titulo}</h2>
      <table className="w-full border-collapse text-sm">
        <tbody>
          {linhas.map(([rotulo, valor]) => (
            <tr key={rotulo} className="border-b border-black/10">
              <th scope="row" className="w-1/3 py-1 pr-3 text-left font-normal text-black/60">
                {rotulo}
              </th>
              <td className="py-1">{valor || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
