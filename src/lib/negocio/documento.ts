export const somenteDigitos = (valor: string) => valor.replace(/\D/g, "");

const todosIguais = (d: string) => /^(\d)\1+$/.test(d);

function digitoVerificador(base: string, pesoInicial: number) {
  const soma = [...base].reduce((acc, n, i) => acc + Number(n) * (pesoInicial - i), 0);
  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
}

export function validarCpf(valor: string) {
  const d = somenteDigitos(valor);
  if (d.length !== 11 || todosIguais(d)) return false;
  const d1 = digitoVerificador(d.slice(0, 9), 10);
  const d2 = digitoVerificador(d.slice(0, 10), 11);
  return d1 === Number(d[9]) && d2 === Number(d[10]);
}

function digitoCnpj(base: string) {
  const pesos = base.length === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const soma = [...base].reduce((acc, n, i) => acc + Number(n) * pesos[i], 0);
  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
}

export function validarCnpj(valor: string) {
  const d = somenteDigitos(valor);
  if (d.length !== 14 || todosIguais(d)) return false;
  return digitoCnpj(d.slice(0, 12)) === Number(d[12]) && digitoCnpj(d.slice(0, 13)) === Number(d[13]);
}

export function validarDocumento(valor: string, tipo: "fisica" | "juridica"): string | null {
  if (!valor.trim()) return null;
  if (tipo === "fisica") return validarCpf(valor) ? null : "CPF inválido.";
  return validarCnpj(valor) ? null : "CNPJ inválido.";
}

function aplicar(digitos: string, padrao: string) {
  let i = 0;
  let saida = "";
  for (const c of padrao) {
    if (i >= digitos.length) break;
    if (c === "#") saida += digitos[i++];
    else saida += c;
  }
  return saida;
}

export function mascaraDocumento(valor: string, tipo: "fisica" | "juridica") {
  const d = somenteDigitos(valor);
  return tipo === "fisica"
    ? aplicar(d.slice(0, 11), "###.###.###-##")
    : aplicar(d.slice(0, 14), "##.###.###/####-##");
}

export function mascaraTelefone(valor: string) {
  const d = somenteDigitos(valor).slice(0, 11);
  if (!d) return "";
  return aplicar(d, d.length === 11 ? "(##) #####-####" : "(##) ####-####");
}

export function mascaraCep(valor: string) {
  return aplicar(somenteDigitos(valor).slice(0, 8), "#####-###");
}

export type RespostaViaCep = {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean | string;
};

export function enderecoViaCep(r: RespostaViaCep, numero: string) {
  const rua = r.logradouro ? [r.logradouro, numero.trim()].filter(Boolean).join(", ") : "";
  return [rua, r.bairro, `${r.localidade}/${r.uf}`, `CEP ${r.cep}`].filter(Boolean).join(" — ");
}
