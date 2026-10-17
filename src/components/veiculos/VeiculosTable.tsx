import { PanelLink } from "@/components/layout/panel/PanelLink";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatKm, formatPlaca } from "@/lib/format";
import type { StatusVeiculo, Veiculo } from "@/lib/types/database";

const statusLabel: Record<StatusVeiculo, string> = {
  disponivel: "Disponível",
  reservado: "Reservado",
  vendido: "Vendido",
};

export function VeiculosTable({
  veiculos,
  onDelete,
}: {
  veiculos: Veiculo[];
  onDelete?: (id: string) => void;
}) {
  return (
    <div className="bg-card rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Placa</TableHead>
            <TableHead>Veículo</TableHead>
            <TableHead>Ano</TableHead>
            <TableHead>KM</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Venda</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {veiculos.map((veiculo) => (
            <TableRow key={veiculo.id}>
              <TableCell className="font-mono font-semibold">{formatPlaca(veiculo.placa)}</TableCell>
              <TableCell>
                <div className="font-medium">
                  {veiculo.marca} {veiculo.modelo}
                </div>
                <div className="text-muted-foreground text-xs capitalize">{veiculo.tipo}</div>
              </TableCell>
              <TableCell>
                {veiculo.ano_fabricacao}/{veiculo.ano_modelo}
              </TableCell>
              <TableCell>{formatKm(veiculo.km)}</TableCell>
              <TableCell>
                <Badge variant={veiculo.status === "disponivel" ? "default" : "secondary"}>
                  {statusLabel[veiculo.status]}
                </Badge>
              </TableCell>
              <TableCell className="text-right">{formatCurrency(veiculo.preco_venda)}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" nativeButton={false} render={<PanelLink href={`/veiculos/${veiculo.id}`} />}>
                  Editar
                </Button>
                {onDelete ? (
                  <Button variant="ghost" size="sm" onClick={() => onDelete(veiculo.id)}>
                    Excluir
                  </Button>
                ) : null}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
