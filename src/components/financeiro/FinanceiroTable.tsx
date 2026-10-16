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
import { formatCurrency, formatDate } from "@/lib/format";
import type { LancamentoFinanceiro } from "@/lib/types/database";

export function FinanceiroTable({
  lancamentos,
  onToggle,
}: {
  lancamentos: LancamentoFinanceiro[];
  onToggle: (item: LancamentoFinanceiro) => void;
}) {
  return (
    <div className="bg-card rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Descrição</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {lancamentos.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div className="font-medium">{item.descricao}</div>
                <div className="text-muted-foreground text-xs capitalize">{item.tipo}</div>
              </TableCell>
              <TableCell>{item.categoria}</TableCell>
              <TableCell>{formatDate(item.data_vencimento)}</TableCell>
              <TableCell>
                <Badge variant={item.status === "pago" ? "secondary" : "destructive"}>
                  {item.status === "pago" ? "Pago" : "Pendente"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">{formatCurrency(item.valor)}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => onToggle(item)}>
                  {item.status === "pago" ? "Reabrir" : "Dar baixa"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
