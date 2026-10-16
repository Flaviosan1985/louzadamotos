import type { TipoPessoa } from "@/lib/types/database";
import { somenteDigitos, validarDocumento } from "@/lib/negocio/documento";

export interface ClienteFormValues {
  nome: string;
  tipo_pessoa: TipoPessoa;
  documento: string;
  telefone: string;
  email: string;
  endereco: string;
}

export type ClienteFormErrors = Partial<Record<keyof ClienteFormValues, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateCliente(form: ClienteFormValues): ClienteFormErrors {
  const errors: ClienteFormErrors = {};

  if (!form.nome.trim()) {
    errors.nome = "Informe o nome do cliente.";
  } else if (form.nome.trim().length > 120) {
    errors.nome = "Nome deve ter no máximo 120 caracteres.";
  }

  const documento = validarDocumento(form.documento, form.tipo_pessoa);
  if (documento) errors.documento = documento;

  const telefone = somenteDigitos(form.telefone);
  if (telefone && telefone.length !== 10 && telefone.length !== 11) {
    errors.telefone = "Telefone com DDD: 10 ou 11 dígitos.";
  }

  if (form.email && !emailPattern.test(form.email)) {
    errors.email = "E-mail inválido.";
  }

  return errors;
}
