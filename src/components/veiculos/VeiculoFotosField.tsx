"use client";

import { publicPhotoSrc } from "@/lib/catalog/from-dashboard";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/shared/FormField";

export function VeiculoFotosField({
  fotos,
  disabled,
  onAdd,
  onRemove,
}: {
  fotos: string[];
  disabled?: boolean;
  onAdd: (files: FileList | null) => void;
  onRemove: (src: string) => void;
}) {
  return (
    <FormField
      label="Fotos da vitrine"
      htmlFor="veiculo-fotos"
    >
      <label
        htmlFor="veiculo-fotos"
        className="border-input hover:border-primary/40 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed bg-[#F5F4F8] px-4 py-6 text-center"
      >
        <span className="text-sm font-medium">Clique para enviar fotos</span>
        <span className="text-muted-foreground mt-1 text-xs">
          JPG ou PNG. A primeira foto vira a capa no site.
        </span>
        <input
          id="veiculo-fotos"
          type="file"
          accept="image/*"
          multiple
          disabled={disabled}
          className="sr-only"
          onChange={(event) => {
            onAdd(event.target.files);
            event.target.value = "";
          }}
        />
      </label>
      {fotos.length ? (
        <ul className="mt-3 flex flex-wrap gap-3">
          {fotos.map((foto, index) => (
            <li key={`${foto}-${index}`} className="relative">
              <img
                src={publicPhotoSrc(foto)}
                alt={`Foto ${index + 1}`}
                className="size-24 rounded-lg object-cover"
              />
              {index === 0 ? (
                <span className="absolute top-1 left-1 rounded bg-[#E10600] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  Capa
                </span>
              ) : null}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 bottom-0 h-7 px-2 text-xs"
                onClick={() => onRemove(foto)}
              >
                Tirar
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground mt-2 text-xs">
          Sem foto o anúncio entra no site, mas a vitrine mostra o logo da loja.
        </p>
      )}
    </FormField>
  );
}
