import { test } from "node:test";
import assert from "node:assert/strict";
import {
  validarCpf,
  validarCnpj,
  validarDocumento,
  mascaraDocumento,
  mascaraTelefone,
  mascaraCep,
  enderecoViaCep,
} from "./documento.ts";

test("CPF válido e inválido", () => {
  assert.equal(validarCpf("123.456.789-09"), true);
  assert.equal(validarCpf("987.654.321-00"), true);
  assert.equal(validarCpf("123.456.789-00"), false);
  assert.equal(validarCpf("111.111.111-11"), false);
  assert.equal(validarCpf("123"), false);
});

test("CNPJ válido e inválido", () => {
  assert.equal(validarCnpj("11.222.333/0001-81"), true);
  assert.equal(validarCnpj("11.222.333/0001-80"), false);
  assert.equal(validarCnpj("00.000.000/0000-00"), false);
});

test("validarDocumento usa o tipo de pessoa e aceita vazio", () => {
  assert.equal(validarDocumento("", "fisica"), null);
  assert.match(validarDocumento("123.456.789-00", "fisica") ?? "", /CPF/);
  assert.match(validarDocumento("123.456.789-09", "juridica") ?? "", /CNPJ/);
  assert.equal(validarDocumento("11.222.333/0001-81", "juridica"), null);
});

test("máscara de documento por tipo", () => {
  assert.equal(mascaraDocumento("12345678909", "fisica"), "123.456.789-09");
  assert.equal(mascaraDocumento("1234567", "fisica"), "123.456.7");
  assert.equal(mascaraDocumento("11222333000181", "juridica"), "11.222.333/0001-81");
  assert.equal(mascaraDocumento("123.456.789-0999", "fisica"), "123.456.789-09");
});

test("máscara de telefone fixo e celular", () => {
  assert.equal(mascaraTelefone("1140002020"), "(11) 4000-2020");
  assert.equal(mascaraTelefone("11977770101"), "(11) 97777-0101");
  assert.equal(mascaraTelefone("11"), "(11");
  assert.equal(mascaraTelefone(""), "");
});

test("máscara de CEP", () => {
  assert.equal(mascaraCep("01310100"), "01310-100");
  assert.equal(mascaraCep("0131"), "0131");
});

test("monta endereço a partir da resposta do ViaCEP", () => {
  const e = enderecoViaCep(
    { cep: "01310-100", logradouro: "Avenida Paulista", bairro: "Bela Vista", localidade: "São Paulo", uf: "SP" },
    "1000",
  );
  assert.equal(e, "Avenida Paulista, 1000 — Bela Vista — São Paulo/SP — CEP 01310-100");
});

test("endereço do ViaCEP sem logradouro (CEP geral da cidade)", () => {
  const e = enderecoViaCep({ cep: "13560-970", logradouro: "", bairro: "", localidade: "São Carlos", uf: "SP" }, "");
  assert.equal(e, "São Carlos/SP — CEP 13560-970");
});
