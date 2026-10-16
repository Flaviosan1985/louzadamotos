import { Input } from "@/components/ui/input";
import { STATUS_VEICULO, TIPOS_VEICULO } from "@/lib/constants";
import type { VeiculoFiltros } from "@/components/veiculos/types";

export function VeiculosFilters({
  value,
  marcas,
  onChange,
}: {
  value: VeiculoFiltros;
  marcas: string[];
  onChange: (value: VeiculoFiltros) => void;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-4">
      <Input
        placeholder="Buscar placa ou modelo"
        value={value.busca}
        onChange={(event) => onChange({ ...value, busca: event.target.value })}
      />
      <select
        className="border-input h-9 rounded-md border bg-transparent px-2.5 text-sm"
        value={value.status}
        onChange={(event) =>
          onChange({ ...value, status: event.target.value as VeiculoFiltros["status"] })
        }
      >
        <option value="todos">Todos os status</option>
        {STATUS_VEICULO.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
      <select
        className="border-input h-9 rounded-md border bg-transparent px-2.5 text-sm"
        value={value.marca}
        onChange={(event) => onChange({ ...value, marca: event.target.value })}
      >
        <option value="">Todas as marcas</option>
        {marcas.map((marca) => (
          <option key={marca} value={marca}>
            {marca}
          </option>
        ))}
      </select>
      <select
        className="border-input h-9 rounded-md border bg-transparent px-2.5 text-sm"
        value={value.tipo}
        onChange={(event) =>
          onChange({ ...value, tipo: event.target.value as VeiculoFiltros["tipo"] })
        }
      >
        <option value="todos">Carros e motos</option>
        {TIPOS_VEICULO.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
}
