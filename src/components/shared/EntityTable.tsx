import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CatalogColumn, ModuleRow } from "@/lib/types/modulos";

export function EntityTable({
  columns,
  rows,
  onEdit,
  onDelete,
  extraAction,
}: {
  columns: CatalogColumn[];
  rows: ModuleRow[];
  onEdit?: (row: ModuleRow) => void;
  onDelete?: (id: string) => void;
  extraAction?: (row: ModuleRow) => React.ReactNode;
}) {
  return (
    <div className="bg-card rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.header}>{column.header}</TableHead>
            ))}
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              {columns.map((column) => (
                <TableCell key={column.header}>{column.render(row)}</TableCell>
              ))}
              <TableCell className="text-right whitespace-nowrap">
                {extraAction?.(row)}
                {onEdit ? (
                  <Button variant="ghost" size="sm" onClick={() => onEdit(row)}>
                    Editar
                  </Button>
                ) : null}
                {onDelete ? (
                  <Button variant="ghost" size="sm" onClick={() => onDelete(row.id)}>
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
