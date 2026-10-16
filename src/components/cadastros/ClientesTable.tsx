import Link from "next/link";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Cliente } from "@/lib/types/database";

export function ClientesTable({
  clientes,
  onEdit,
  onDelete,
}: {
  clientes: Cliente[];
  onEdit: (cliente: Cliente) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="bg-card rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Documento</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {clientes.map((cliente) => (
            <TableRow key={cliente.id}>
              <TableCell>
                <div className="font-medium">{cliente.nome}</div>
                <div className="text-muted-foreground text-xs">
                  {cliente.tipo_pessoa === "juridica" ? "Pessoa jurídica" : "Pessoa física"}
                </div>
              </TableCell>
              <TableCell>{cliente.documento ?? "—"}</TableCell>
              <TableCell>{cliente.telefone ?? "—"}</TableCell>
              <TableCell>{cliente.email ?? "—"}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  nativeButton={false}
                  render={<Link href={`/imprimir/ficha/${cliente.id}`} target="_blank" />}
                >
                  <Printer aria-hidden />
                  Ficha
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onEdit(cliente)}>
                  Editar
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(cliente.id)}>
                  Excluir
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
