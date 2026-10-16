export interface VeiculoFormValues {
  marca: string;
  modelo: string;
  ano_fabricacao: number;
  ano_modelo: number;
  km: number;
  preco_custo: number;
  preco_venda: number;
}

export type VeiculoFormErrors = Partial<Record<keyof VeiculoFormValues, string>>;

export function validateVeiculo(form: VeiculoFormValues): VeiculoFormErrors {
  const currentYear = new Date().getFullYear();
  const errors: VeiculoFormErrors = {};

  if (!form.marca.trim()) {
    errors.marca = "Informe a marca.";
  }

  if (!form.modelo.trim()) {
    errors.modelo = "Informe o modelo.";
  }

  if (form.ano_fabricacao < 1950 || form.ano_fabricacao > currentYear + 1) {
    errors.ano_fabricacao = "Ano de fabricação inválido.";
  }

  if (form.ano_modelo < form.ano_fabricacao || form.ano_modelo > currentYear + 1) {
    errors.ano_modelo = "Ano modelo inválido.";
  }

  if (form.km < 0) {
    errors.km = "KM não pode ser negativo.";
  }

  if (form.preco_custo < 0) {
    errors.preco_custo = "Custo não pode ser negativo.";
  }

  if (form.preco_venda <= 0) {
    errors.preco_venda = "Informe o preço de venda.";
  }

  return errors;
}
