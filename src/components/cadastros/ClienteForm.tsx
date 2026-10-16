"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/FormField";
import { TIPOS_PESSOA } from "@/lib/constants";
import {
  validateCliente,
  type ClienteFormErrors,
  type ClienteFormValues,
} from "@/lib/cadastros/validate-cliente";
import {
  enderecoViaCep,
  mascaraCep,
  mascaraDocumento,
  mascaraTelefone,
  somenteDigitos,
  type RespostaViaCep,
} from "@/lib/negocio/documento";
import type { Cliente, TipoPessoa } from "@/lib/types/database";

type BuscaCep = { estado: "ocioso" | "buscando" } | { estado: "erro"; mensagem: string };

export function ClienteForm({
  initial,
  onCancel,
  onSave,
}: {
  initial?: Cliente | null;
  onCancel: () => void;
  onSave: (payload: {
    nome: string;
    tipo_pessoa: TipoPessoa;
    documento: string | null;
    telefone: string | null;
    email: string | null;
    endereco: string | null;
  }) => Promise<void>;
}) {
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<ClienteFormErrors>({});
  const [form, setForm] = useState<ClienteFormValues>({
    nome: initial?.nome ?? "",
    tipo_pessoa: (initial?.tipo_pessoa ?? "fisica") as TipoPessoa,
    documento: initial?.documento ?? "",
    telefone: initial?.telefone ?? "",
    email: initial?.email ?? "",
    endereco: initial?.endereco ?? "",
  });
  const [cep, setCep] = useState("");
  const [numero, setNumero] = useState("");
  const [busca, setBusca] = useState<BuscaCep>({ estado: "ocioso" });
  const ultimaBusca = useRef<AbortController | null>(null);

  function update<K extends keyof ClienteFormValues>(key: K, value: ClienteFormValues[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function buscarCep(valor: string, numeroAtual: string) {
    const digitos = somenteDigitos(valor);
    if (digitos.length !== 8) return;
    ultimaBusca.current?.abort();
    const controller = new AbortController();
    ultimaBusca.current = controller;
    setBusca({ estado: "buscando" });
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digitos}/json/`, { signal: controller.signal });
      if (!res.ok) throw new Error();
      const json = (await res.json()) as RespostaViaCep;
      if (json.erro) {
        setBusca({ estado: "erro", mensagem: "CEP não encontrado." });
        return;
      }
      update("endereco", enderecoViaCep(json, numeroAtual));
      setBusca({ estado: "ocioso" });
    } catch (error) {
      if ((error as Error).name === "AbortError") return;
      setBusca({ estado: "erro", mensagem: "Não foi possível consultar o CEP. Preencha o endereço à mão." });
    }
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors = validateCliente(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    try {
      await onSave({
        nome: form.nome.trim(),
        tipo_pessoa: form.tipo_pessoa,
        documento: form.documento || null,
        telefone: form.telefone || null,
        email: form.email || null,
        endereco: form.endereco || null,
      });
    } catch {
      // Toast de erro fica a cargo de onSave.
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="bg-card space-y-4 rounded-xl border p-5" noValidate>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField htmlFor="cliente-nome" label="Nome" error={errors.nome}>
          <Input
            id="cliente-nome"
            aria-invalid={Boolean(errors.nome)}
            value={form.nome}
            onChange={(event) => update("nome", event.target.value)}
          />
        </FormField>
        <FormField htmlFor="cliente-tipo" label="Tipo">
          <select
            id="cliente-tipo"
            className="border-input h-9 w-full rounded-md border bg-transparent px-2.5 text-sm"
            value={form.tipo_pessoa}
            onChange={(event) => {
              const tipo = event.target.value as TipoPessoa;
              setForm((current) => ({
                ...current,
                tipo_pessoa: tipo,
                documento: mascaraDocumento(current.documento, tipo),
              }));
            }}
          >
            {TIPOS_PESSOA.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </FormField>
        <FormField
          htmlFor="cliente-documento"
          label={form.tipo_pessoa === "juridica" ? "CNPJ" : "CPF"}
          error={errors.documento}
        >
          <Input
            id="cliente-documento"
            inputMode="numeric"
            aria-invalid={Boolean(errors.documento)}
            value={form.documento}
            onChange={(event) => update("documento", mascaraDocumento(event.target.value, form.tipo_pessoa))}
          />
        </FormField>
        <FormField htmlFor="cliente-telefone" label="Telefone" error={errors.telefone}>
          <Input
            id="cliente-telefone"
            type="tel"
            inputMode="tel"
            aria-invalid={Boolean(errors.telefone)}
            value={form.telefone}
            onChange={(event) => update("telefone", mascaraTelefone(event.target.value))}
          />
        </FormField>
        <FormField htmlFor="cliente-email" label="E-mail" error={errors.email}>
          <Input
            id="cliente-email"
            type="email"
            aria-invalid={Boolean(errors.email)}
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
          />
        </FormField>
        <div className="grid grid-cols-[minmax(0,1fr)_6rem] gap-3">
          <FormField
            htmlFor="cliente-cep"
            label={busca.estado === "buscando" ? "CEP (buscando…)" : "CEP"}
            error={busca.estado === "erro" ? busca.mensagem : undefined}
          >
            <Input
              id="cliente-cep"
              inputMode="numeric"
              aria-invalid={busca.estado === "erro"}
              value={cep}
              onChange={(event) => {
                const valor = mascaraCep(event.target.value);
                setCep(valor);
                if (busca.estado === "erro") setBusca({ estado: "ocioso" });
                if (somenteDigitos(valor).length === 8) void buscarCep(valor, numero);
              }}
              onBlur={() => {
                const digitos = somenteDigitos(cep).length;
                if (digitos > 0 && digitos < 8) setBusca({ estado: "erro", mensagem: "CEP deve ter 8 dígitos." });
              }}
            />
          </FormField>
          <FormField htmlFor="cliente-numero" label="Número">
            <Input
              id="cliente-numero"
              value={numero}
              onChange={(event) => setNumero(event.target.value)}
              onBlur={() => {
                if (somenteDigitos(cep).length === 8) void buscarCep(cep, numero);
              }}
            />
          </FormField>
        </div>
      </div>
      <FormField htmlFor="cliente-endereco" label="Endereço">
        <Input
          id="cliente-endereco"
          value={form.endereco}
          onChange={(event) => update("endereco", event.target.value)}
        />
      </FormField>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? "Salvando..." : "Salvar cliente"}
        </Button>
      </div>
    </form>
  );
}
