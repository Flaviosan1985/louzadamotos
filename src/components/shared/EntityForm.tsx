"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/shared/FormField";
import type { CatalogField, ModuleRow } from "@/lib/types/modulos";

export function EntityForm({
  fields,
  initial,
  submitLabel,
  onCancel,
  onSave,
}: {
  fields: CatalogField[];
  initial?: ModuleRow | null;
  submitLabel: string;
  onCancel: () => void;
  onSave: (payload: Record<string, string>) => Promise<void>;
}) {
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      fields.map((field) => [
        field.key,
        initial?.[field.key] ??
          (field.type === "select" ? (field.options?.[0]?.value ?? "") : ""),
      ]),
    ),
  );

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    for (const field of fields) {
      if (field.required && !form[field.key]?.trim()) {
        nextErrors[field.key] = `Informe ${field.label.toLowerCase()}.`;
      }
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    try {
      await onSave(form);
    } catch {
      // Toast fica no caller.
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="bg-card space-y-4 rounded-xl border p-5" noValidate>
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((field) => {
          const invalid = Boolean(errors[field.key]);
          const describedBy = invalid ? `${field.key}-error` : undefined;
          const setValue = (value: string) =>
            setForm((current) => ({ ...current, [field.key]: value }));

          return (
            <FormField key={field.key} htmlFor={field.key} label={field.label} error={errors[field.key]}>
              {field.type === "textarea" ? (
                <Textarea
                  id={field.key}
                  aria-invalid={invalid}
                  aria-describedby={describedBy}
                  value={form[field.key] ?? ""}
                  onChange={(event) => setValue(event.target.value)}
                />
              ) : field.type === "select" ? (
                <select
                  id={field.key}
                  aria-invalid={invalid}
                  aria-describedby={describedBy}
                  className="border-input h-9 w-full rounded-md border bg-transparent px-2.5 text-sm"
                  value={form[field.key] ?? ""}
                  onChange={(event) => setValue(event.target.value)}
                >
                  {(field.options ?? []).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  id={field.key}
                  type={field.type ?? "text"}
                  aria-invalid={invalid}
                  aria-describedby={describedBy}
                  value={form[field.key] ?? ""}
                  onChange={(event) => setValue(event.target.value)}
                />
              )}
            </FormField>
          );
        })}
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? "Salvando..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
