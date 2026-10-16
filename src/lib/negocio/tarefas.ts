import { normalizarEtapa } from "./funil.ts";

export type Prioridade = "alta" | "media";

export type TipoTarefa =
  | "primeiro-contato"
  | "confirmar-24h"
  | "lembrete-2h"
  | "nao-compareceu"
  | "pos-test-drive"
  | "sem-resposta-48h"
  | "compromisso"
  | "transferencia";

export type Tarefa = {
  id: string;
  tipo: TipoTarefa;
  origemId: string;
  titulo: string;
  detalhe: string;
  prioridade: Prioridade;
  quando: Date;
  href: string;
};

type CartaoEntrada = {
  id: string;
  titulo?: string;
  cliente?: string;
  coluna?: string;
  etapa_em?: string;
  criado_em?: string;
  agendado_para?: string;
  test_drive_em?: string;
};

type AgendaEntrada = { id: string; titulo?: string; quando?: string; cliente?: string };

const MIN = 60_000;
const HORA = 60 * MIN;

/** Lê "AAAA-MM-DD HH:mm" (hora local) ou ISO. */
export function parseQuando(valor: string | undefined): Date | null {
  if (!valor) return null;
  const data = new Date(valor.includes("T") ? valor : valor.replace(" ", "T"));
  return Number.isNaN(data.getTime()) ? null : data;
}

export function tarefasTransferencia(
  pendentes: { veiculoId: string; diasRestantes: number; situacao: string; limite: Date }[],
  nomes: Record<string, string>,
): Tarefa[] {
  return pendentes
    .filter((p) => p.situacao !== "ok")
    .map((p) => ({
      id: `transferencia-${p.veiculoId}`,
      tipo: "transferencia" as const,
      origemId: p.veiculoId,
      titulo: `Transferência: ${nomes[p.veiculoId] ?? "veículo vendido"}`,
      detalhe:
        p.situacao === "vencido"
          ? `Prazo de 30 dias vencido há ${-p.diasRestantes} dia(s).`
          : `Faltam ${p.diasRestantes} dia(s) do prazo de 30 dias.`,
      prioridade: "alta" as const,
      quando: p.limite,
      href: `/veiculos/${p.veiculoId}`,
    }));
}

export function gerarTarefas({
  kanban,
  agenda,
  agora,
}: {
  kanban: CartaoEntrada[] | Record<string, string>[];
  agenda: AgendaEntrada[] | Record<string, string>[];
  agora: Date;
}): Tarefa[] {
  const t = agora.getTime();
  const tarefas: Tarefa[] = [];
  const add = (
    origemId: string,
    tipo: TipoTarefa,
    titulo: string,
    detalhe: string,
    prioridade: Prioridade,
    quando: Date,
    href: string,
  ) => tarefas.push({ id: `${tipo}-${origemId}`, tipo, origemId, titulo, detalhe, prioridade, quando, href });

  for (const card of kanban) {
    const etapa = normalizarEtapa(card.coluna);
    const nome = card.titulo || card.cliente || "Lead";
    const desde = parseQuando(card.etapa_em ?? card.criado_em);
    const parado = desde ? t - desde.getTime() : 0;
    const href = "/atalhos/kanban";

    if (etapa === "Novo lead" && desde && parado > 15 * MIN) {
      add(card.id, "primeiro-contato", `Fazer primeiro contato: ${nome}`, "Lead sem contato há mais de 15 minutos.", "alta", desde, href);
    }
    if ((etapa === "Contatado" || etapa === "Negociação") && desde && parado > 48 * HORA) {
      add(card.id, "sem-resposta-48h", `Retomar contato: ${nome}`, `Sem movimento há 48 h em ${etapa}.`, "media", desde, href);
    }
    if (etapa === "Agendamento") {
      const marcado = parseQuando(card.agendado_para);
      if (marcado) {
        const falta = marcado.getTime() - t;
        if (falta < 0) {
          add(card.id, "nao-compareceu", `Cliente compareceu? ${nome}`, "Horário agendado já passou; atualize a etapa.", "alta", marcado, href);
        } else if (falta <= 2 * HORA) {
          add(card.id, "lembrete-2h", `Visita em menos de 2 h: ${nome}`, "Envie o lembrete final.", "alta", marcado, href);
        } else if (falta <= 24 * HORA) {
          add(card.id, "confirmar-24h", `Confirmar visita: ${nome}`, "Agendamento nas próximas 24 h.", "media", marcado, href);
        }
      }
    }
    if (etapa === "Test drive") {
      const feito = parseQuando(card.test_drive_em);
      if (feito && t - feito.getTime() > 24 * HORA) {
        add(card.id, "pos-test-drive", `Acompanhar test drive: ${nome}`, "Test drive há mais de 24 h sem proposta.", "media", feito, href);
      }
    }
  }

  for (const item of agenda) {
    const quando = parseQuando(item.quando);
    if (!quando) continue;
    const falta = quando.getTime() - t;
    if (falta < 0 || falta > 24 * HORA) continue;
    add(
      item.id,
      "compromisso",
      item.titulo || "Compromisso",
      item.cliente ? `Com ${item.cliente}.` : "Compromisso da agenda.",
      falta <= 2 * HORA ? "alta" : "media",
      quando,
      "/atalhos/agenda",
    );
  }

  return tarefas.sort(
    (a, b) =>
      (a.prioridade === b.prioridade ? 0 : a.prioridade === "alta" ? -1 : 1) ||
      a.quando.getTime() - b.quando.getTime(),
  );
}
