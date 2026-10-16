import { demoTenant } from "@/lib/demo/seed";
import type { DemoExtras, ModuleRow } from "@/lib/types/modulos";

const T = demoTenant.id;

function row(id: string, fields: Record<string, string>): ModuleRow {
  return {
    id,
    tenant_id: T,
    criado_em: "2026-10-01T10:00:00.000Z",
    ...fields,
  };
}

export function seedExtras(): DemoExtras {
  return {
    usuarios: [
      row("u-1", { nome: "Ana Louzada", email: "ana@patio.com", papel: "admin", loja: "Matriz", ativo: "sim" }),
      row("u-2", { nome: "Bruno Dias", email: "bruno@patio.com", papel: "vendedor", loja: "Matriz", ativo: "sim" }),
      row("u-3", { nome: "Carla Nunes", email: "carla@patio.com", papel: "financeiro", loja: "Matriz", ativo: "sim" }),
    ],
    lojas: [
      row("l-1", { nome: "Matriz", cidade: "São Paulo", uf: "SP", telefone: "(11) 98888-1200", responsavel: "Ana Louzada" }),
      row("l-2", { nome: "Pátio Guarulhos", cidade: "Guarulhos", uf: "SP", telefone: "(11) 97777-3300", responsavel: "Bruno Dias" }),
    ],
    fornecedores: [
      row("fo-1", { nome: "Honda Premium SP", documento: "11.222.333/0001-44", telefone: "(11) 3000-1000", cidade: "São Paulo" }),
      row("fo-2", { nome: "Multimarcas Leilões", documento: "22.333.444/0001-55", telefone: "(11) 3000-2000", cidade: "Osasco" }),
    ],
    bancos: [
      row("b-1", { nome: "Banco Pan", agencia: "0001", conta: "12345-6", pix: "12.345.678/0001-90" }),
      row("b-2", { nome: "Santander", agencia: "0333", conta: "98765-4", pix: "ana@patio.com" }),
    ],
    despachantes: [
      row("d-1", { nome: "Despachante Central", telefone: "(11) 3222-1100", cidade: "São Paulo" }),
      row("d-2", { nome: "Rápido Detran", telefone: "(11) 3222-2200", cidade: "Guarulhos" }),
    ],
    almoxarifado: [
      row("a-1", { item: "Capacete extra", quantidade: "8", unidade: "un", local: "Loja matriz" }),
      row("a-2", { item: "Capa de chuva", quantidade: "20", unidade: "un", local: "Estoque fundo" }),
      row("a-3", { item: "Kit estética", quantidade: "4", unidade: "kit", local: "Oficina" }),
    ],
    emprestimos: [
      row("e-1", { veiculo: "Yamaha MT-07", placa: "GHP8C33", cliente: "Pedro Henrique Costa", saida: "2026-10-10", previsao: "2026-10-17", status: "aberto" }),
    ],
    conferencia: [
      row("cf-1", { veiculo: "Honda CB 500F", tipo: "entrada", status: "conferido", data: "2026-08-02" }),
      row("cf-2", { veiculo: "Fiat Pulse Audace", tipo: "entrada", status: "pendente", data: "2026-10-01" }),
      row("cf-3", { veiculo: "Chevrolet Onix Plus", tipo: "saida", status: "conferido", data: "2026-10-04" }),
    ],
    renave: [
      row("r-1", { veiculo: "Honda CB 500F", placa: "RTA4B21", status: "baixado", protocolo: "RN-90811" }),
      row("r-2", { veiculo: "Volkswagen T-Cross", placa: "FKL2A90", status: "enviado", protocolo: "RN-91002" }),
      row("r-3", { veiculo: "Fiat Pulse Audace", placa: "PLS9A44", status: "pendente", protocolo: "—" }),
    ],
    pendencias: [
      row("p-1", { veiculo: "Volkswagen T-Cross", tipo: "Laudo cautelar", descricao: "Aguardando segunda via", status: "aberta" }),
      row("p-2", { veiculo: "Honda CB 500F", tipo: "CRLV", descricao: "Transferência em andamento", status: "aberta" }),
    ],
    excluidos: [],
    emails: [
      row("em-1", { destinatario: "mariana.alves@email.com", assunto: "Proposta Honda CB 500F", status: "enviado", quando: "2026-10-12 09:40" }),
      row("em-2", { destinatario: "pedro.costa@email.com", assunto: "Confirmação de reserva MT-07", status: "enviado", quando: "2026-10-10 16:40" }),
    ],
    acoes: [
      row("ac-1", { usuario: "Ana Louzada", acao: "Cadastrou Fiat Pulse Audace", quando: "2026-10-01 12:00" }),
      row("ac-2", { usuario: "Bruno Dias", acao: "Reservou Yamaha MT-07", quando: "2026-10-10 16:20" }),
      row("ac-3", { usuario: "Carla Nunes", acao: "Baixou venda Onix Plus", quando: "2026-10-04 15:10" }),
    ],
    impressos: [
      row("im-1", { nome: "Contrato de venda", modelo: "contrato-venda", atualizado: "2026-09-01" }),
      row("im-2", { nome: "Recibo de venda", modelo: "recibo-venda", atualizado: "2026-09-01" }),
      row("im-3", { nome: "Termo de responsabilidade", modelo: "tr", atualizado: "2026-08-15" }),
    ],
    procedimentos: [
      row("pr-1", { nome: "Compra", etapa: "Checklist de entrada", conteudo: "Fotos, laudo, CRV, chave reserva e conferência de km." }),
      row("pr-2", { nome: "Venda", etapa: "Checklist de saída", conteudo: "Contrato, recibo, Renave e entrega das chaves." }),
    ],
    mensagens: [
      row("m-1", { canal: "WhatsApp", titulo: "Primeiro contato", texto: "Olá! Vi que você tem interesse no {{veiculo}}. Posso te atender?" }),
      row("m-2", { canal: "SMS", titulo: "Lembrete de visita", texto: "Lembrete: avaliação agendada hoje no Pátio." }),
    ],
    linkSite: [
      row("ls-1", { url: "https://vitrine.patio.com.br", token: "vt_8f3a", publicado: "sim" }),
    ],
    comissoes: [
      row("co-1", { vendedor: "Bruno Dias", percentual: "1,5", venda: "Onix Plus Premier", valor: "1093,50" }),
      row("co-2", { vendedor: "Bruno Dias", percentual: "1,5", venda: "BMW G 310 GS", valor: "494,85" }),
    ],
    modulos: [
      row("mo-1", { nome: "Renave", ativo: "sim" }),
      row("mo-2", { nome: "Nota fiscal", ativo: "sim" }),
      row("mo-3", { nome: "Kanban", ativo: "sim" }),
      row("mo-4", { nome: "Leilão", ativo: "nao" }),
    ],
    apiKeys: [
      row("k-1", { nome: "Site vitrine", chave: "pk_live_patio_vitrine_8341", criado: "2026-03-12" }),
    ],
    leilao: [
      row("le-1", { placa: "QWE1D22", resultado: "Nada consta", consultado: "2026-10-04" }),
      row("le-2", { placa: "FKL2A90", resultado: "1 registro em 2023 — baixado", consultado: "2026-09-05" }),
    ],
    ipva: [
      row("ip-1", { veiculo: "Honda CB 500F", placa: "RTA4B21", ano: "2026", status: "pago", valor: "890,00" }),
      row("ip-2", { veiculo: "Volkswagen T-Cross", placa: "FKL2A90", ano: "2026", status: "pendente", valor: "2140,00" }),
    ],
    credito: [
      row("cr-1", { cliente: "Mariana Alves", banco: "Banco Pan", valor: "28000,00", status: "aprovada" }),
      row("cr-2", { cliente: "Pedro Henrique Costa", banco: "Santander", valor: "32000,00", status: "em analise" }),
    ],
    leads: [
      row("ld-1", { nome: "Juliana Prado", telefone: "(11) 95555-1010", interesse: "Honda CB 500F", status: "novo", origem: "Instagram" }),
      row("ld-2", { nome: "Ricardo Melo", telefone: "(11) 95555-2020", interesse: "T-Cross Comfortline", status: "atendimento", origem: "Site" }),
    ],
    procurados: [
      row("pv-1", { marca: "Toyota", modelo: "Corolla", ano: "2022+", cliente: "Mariana Alves", telefone: "(11) 97777-0101" }),
      row("pv-2", { marca: "Yamaha", modelo: "MT-03", ano: "2024+", cliente: "Pedro Henrique Costa", telefone: "(11) 96666-3030" }),
    ],
    agenda: [
      row("ag-1", { titulo: "Entrega MT-07", quando: "2026-10-17 10:00", cliente: "Pedro Henrique Costa", local: "Matriz" }),
      row("ag-2", { titulo: "Avaliação T-Cross", quando: "2026-10-16 15:00", cliente: "Ricardo Melo", local: "Matriz" }),
    ],
    arquivos: [
      row("ar-1", { nome: "CRLV CB 500F.pdf", pasta: "Documentos / motos", atualizado: "2026-08-03" }),
      row("ar-2", { nome: "Contrato Onix Plus.pdf", pasta: "Vendas / 2026-10", atualizado: "2026-10-04" }),
    ],
    notas: [
      row("nf-1", { numero: "00021", cliente: "Pedro Henrique Costa", veiculo: "BMW G 310 GS", valor: "32990,00", status: "emitida", emitida: "2026-09-22" }),
      row("nf-2", { numero: "00022", cliente: "Transportes Norte Sul LTDA", veiculo: "Onix Plus Premier", valor: "72900,00", status: "emitida", emitida: "2026-10-04" }),
    ],
    kanban: [
      row("kb-1", { titulo: "CB 500F — Juliana", coluna: "Novo lead", etapa_em: "2026-10-16T08:00:00.000Z", cliente: "Juliana Prado", telefone: "(11) 95555-1010", veiculo: "Honda CB 500F", veiculo_id: "v-1" }),
      row("kb-2", { titulo: "T-Cross — Ricardo", coluna: "Agendamento", etapa_em: "2026-10-14T13:00:00.000Z", agendado_para: "2026-10-16 15:00", cliente: "Ricardo Melo", telefone: "(11) 95555-2020", veiculo: "Volkswagen T-Cross", veiculo_id: "v-3" }),
      row("kb-3", { titulo: "MT-07 — Pedro", coluna: "Negociação", etapa_em: "2026-10-12T18:00:00.000Z", test_drive_em: "2026-10-12T15:00:00.000Z", cliente: "Pedro Henrique Costa", veiculo: "Yamaha MT-07", veiculo_id: "v-2" }),
      row("kb-4", { titulo: "Onix — Norte Sul", coluna: "Vendido", etapa_em: "2026-10-04T15:00:00.000Z", data_entrega: "2026-10-04", cliente: "Transportes Norte Sul LTDA", veiculo: "Chevrolet Onix Plus", veiculo_id: "v-4" }),
      row("kb-5", { titulo: "Pulse — Mariana", coluna: "Test drive", etapa_em: "2026-10-13T16:00:00.000Z", test_drive_em: "2026-10-13T16:00:00.000Z", cliente: "Mariana Alves", veiculo: "Fiat Pulse Audace", veiculo_id: "v-6" }),
    ],
    simulacoes: [
      row("sim-1", {
        veiculo_id: "v-4",
        veiculo: "Chevrolet Onix Plus Premier · QWE1D22",
        cliente_id: "c-2",
        cliente: "Transportes Norte Sul LTDA",
        valor: "72900",
        desconto: "0",
        entrada: "14000",
        troca: "0",
        prazo: "36",
        taxaMensalPct: "1.79",
        tarifas: "900",
        iof: "500",
        renda: "12000",
        status: "rascunho",
      }),
    ],
    transferencias: [
      row("tr-v-5", { veiculo_id: "v-5", status: "concluida", comunicacao_venda: "sim", despachante: "Despachante Central" }),
      row("tr-v-4", { veiculo_id: "v-4", status: "em andamento", comunicacao_venda: "nao", despachante: "Rápido Detran" }),
    ],
    checklists: [
      row("ck-v-1", { veiculo_id: "v-1", doc_crv: "sim", doc_crlv: "sim", doc_debitos: "sim", doc_leilao: "sim", doc_cautelar: "sim" }),
      row("ck-v-3", { veiculo_id: "v-3", doc_crlv: "sim", doc_leilao: "sim" }),
    ],
    tarefas: [
      row("tf-1", { titulo: "Ligar para Juliana", vencimento: "2026-10-16", status: "aberta", tipo: "primeiro-contato" }),
    ],
    vendas: [
      row("vd-1", {
        numero: "VD-2026-00001",
        cliente_id: "c-2",
        cliente: "Transportes Norte Sul LTDA",
        veiculo_id: "v-4",
        veiculo: "Chevrolet Onix Plus",
        kanban_id: "kb-4",
        valor: "72900",
        data: "2026-10-04",
        status: "fechada",
      }),
    ],
    documentos: [
      row("dc-1", { cliente_id: "c-3", tipo: "cnh", nome_arquivo: "cnh-pedro.pdf", storage_path: "" }),
    ],
    contratos: [
      row("ct-1", {
        numero: "CT-2026-00001",
        venda_id: "vd-1",
        cliente_id: "c-2",
        veiculo_id: "v-4",
        modelo_id: "mc-1",
        versao_modelo: "1",
        corpo: "Contrato de venda do Onix Plus para Transportes Norte Sul LTDA.",
        gerado_em: "2026-10-04T15:20:00.000Z",
      }),
    ],
    modelosContrato: [
      row("mc-1", {
        nome: "Contrato de compra e venda",
        versao: "1",
        ativo: "sim",
        corpo: "Contrato entre {{loja.nome}} (CNPJ {{loja.cnpj}}) e {{cliente.nome}}, documento {{cliente.documento}}, referente ao veículo {{veiculo.marca}} {{veiculo.modelo}}, placa {{veiculo.placa}}, venda {{venda.numero}} no valor de {{venda.valor}} em {{venda.data}}.",
      }),
    ],
    auditLog: [
      row("au-1", { usuario: "Ana Louzada", acao: "create", entidade: "veiculos", entidade_id: "v-6", quando: "2026-10-01 12:00" }),
    ],
  };
}
