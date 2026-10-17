"use client";

import { loadAppSnapshot, saveModuleRow } from "@/lib/data/app-data";
import { leadParaKanban, leadParaRegistro, validarLeadPublico } from "@/lib/negocio/lead-publico";
import { buildWhatsAppUrl, leadWhatsAppMessage } from "@/lib/louzada/whatsapp";

export async function registrarInteresseSite(input: {
  veiculoId: string;
  brand: string;
  model: string;
  year: number;
  displacement?: number | null;
  nome: string;
  telefone: string;
  proposta: string;
}) {
  const validado = validarLeadPublico({
    origem: "formulario",
    nome: input.nome,
    telefone: input.telefone,
    interesse: `${input.brand} ${input.model}`,
    veiculo_site_id: input.veiculoId,
  });
  if (!validado.ok) {
    throw new Error(validado.erro);
  }

  const snapshot = await loadAppSnapshot();
  const agora = new Date().toISOString();
  const ids = { id: crypto.randomUUID(), tenant_id: snapshot.tenant.id, criado_em: agora };

  await saveModuleRow("leads", {
    ...leadParaRegistro(validado.lead, ids),
    proposta: input.proposta.trim(),
  });
  await saveModuleRow("kanban", leadParaKanban(validado.lead, { ...ids, id: crypto.randomUUID() }));

  const wa = buildWhatsAppUrl(
    leadWhatsAppMessage({
      brand: input.brand,
      model: input.model,
      year: input.year,
      displacement: input.displacement,
      customerName: validado.lead.nome,
      phone: input.telefone,
      proposal: input.proposta,
    }),
    snapshot.tenant.telefone,
  );

  return { wa };
}
