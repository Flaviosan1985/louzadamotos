"use client";

import { createElement, type ComponentType, type ReactNode } from "react";
import { matchVeiculoId, normalizePanelPath } from "@/lib/panel/paths";
import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { UsuariosPage } from "@/components/cadastros/UsuariosPage";
import { LojasPage } from "@/components/cadastros/LojasPage";
import { ClientesPage } from "@/components/cadastros/ClientesPage";
import { FornecedoresPage } from "@/components/cadastros/FornecedoresPage";
import { BancosPage } from "@/components/cadastros/BancosPage";
import { DespachantesPage } from "@/components/cadastros/DespachantesPage";
import { AlmoxarifadoPage } from "@/components/cadastros/AlmoxarifadoPage";
import { VeiculoAdicionarPage } from "@/components/veiculos/VeiculoAdicionarPage";
import { VeiculoEditarPage } from "@/components/veiculos/VeiculoEditarPage";
import { VeiculosPage } from "@/components/veiculos/VeiculosPage";
import { EmprestadosPage } from "@/components/veiculos/EmprestadosPage";
import { ConferenciaPage } from "@/components/veiculos/ConferenciaPage";
import { RenavePage } from "@/components/veiculos/RenavePage";
import { PendenciasPage } from "@/components/veiculos/PendenciasPage";
import { CadastroPendentePage } from "@/components/veiculos/CadastroPendentePage";
import { ExcluidosPage } from "@/components/veiculos/ExcluidosPage";
import { FinanceiroPage } from "@/components/financeiro/FinanceiroPage";
import { RelatorioEstatisticasPage } from "@/components/relatorios/RelatorioEstatisticasPage";
import { RelatorioFinancasPage } from "@/components/relatorios/RelatorioFinancasPage";
import { RelatorioVeiculosPage } from "@/components/relatorios/RelatorioVeiculosPage";
import { RelatorioClientesPage } from "@/components/relatorios/RelatorioClientesPage";
import { RelatorioVendasPage } from "@/components/relatorios/RelatorioVendasPage";
import { RelatorioEmailsPage } from "@/components/relatorios/RelatorioEmailsPage";
import { RelatorioEstoquePage } from "@/components/relatorios/RelatorioEstoquePage";
import { RelatorioAcoesPage } from "@/components/relatorios/RelatorioAcoesPage";
import { RelatorioViaPercepcaoPage } from "@/components/relatorios/RelatorioViaPercepcaoPage";
import { ImpressosPage } from "@/components/configuracoes/ImpressosPage";
import { ProcedimentosPage } from "@/components/configuracoes/ProcedimentosPage";
import { MensagensPage } from "@/components/configuracoes/MensagensPage";
import { LinkSitePage } from "@/components/configuracoes/LinkSitePage";
import { PropriedadesForm } from "@/components/configuracoes/PropriedadesForm";
import { TutorialPage } from "@/components/configuracoes/TutorialPage";
import { ComissoesPage } from "@/components/configuracoes/ComissoesPage";
import { ModulosPage } from "@/components/configuracoes/ModulosPage";
import { ApiPage } from "@/components/configuracoes/ApiPage";
import { LeilaoPage } from "@/components/atalhos/LeilaoPage";
import { IpvaPage } from "@/components/atalhos/IpvaPage";
import { CreditoPage } from "@/components/atalhos/CreditoPage";
import { LeadsPage } from "@/components/atalhos/LeadsPage";
import { ProcuradosPage } from "@/components/atalhos/ProcuradosPage";
import { AgendaPage } from "@/components/atalhos/AgendaPage";
import { ArquivosPage } from "@/components/atalhos/ArquivosPage";
import { CalculadoraPage } from "@/components/atalhos/CalculadoraPage";
import { NfePage } from "@/components/atalhos/NfePage";
import { KanbanPage } from "@/components/atalhos/KanbanPage";
import { ContaPage } from "@/components/conta/ContaPage";
import { SobrePage } from "@/components/conta/SobrePage";
import { SuportePage } from "@/components/conta/SuportePage";
import { PanelNotFound } from "@/components/layout/panel/PanelNotFound";

type PanelView = {
  Component: ComponentType<object>;
  props?: object;
};

function view<P extends object>(Component: ComponentType<P>, props?: P): PanelView {
  return { Component: Component as ComponentType<object>, props };
}

const PANEL_VIEWS: Record<string, PanelView> = {
  "/sistema": view(DashboardPage),
  "/sistema/sobre": view(SobrePage),
  "/cadastros/usuarios": view(UsuariosPage),
  "/cadastros/lojas": view(LojasPage),
  "/cadastros/clientes": view(ClientesPage),
  "/cadastros/fornecedores": view(FornecedoresPage),
  "/cadastros/bancos": view(BancosPage),
  "/cadastros/despachantes": view(DespachantesPage),
  "/cadastros/almoxarifado": view(AlmoxarifadoPage),
  "/veiculos/adicionar": view(VeiculoAdicionarPage),
  "/veiculos/a-venda": view(VeiculosPage, { title: "À venda", lockedStatus: "disponivel" }),
  "/veiculos/vendidos": view(VeiculosPage, { title: "Vendidos", lockedStatus: "vendido" }),
  "/veiculos/reservados": view(VeiculosPage, { title: "Reservados", lockedStatus: "reservado" }),
  "/veiculos/emprestados": view(EmprestadosPage),
  "/veiculos/conferencia": view(ConferenciaPage),
  "/veiculos/renave": view(RenavePage),
  "/veiculos/pendencias": view(PendenciasPage),
  "/veiculos/cadastro-pendente": view(CadastroPendentePage),
  "/veiculos/excluidos": view(ExcluidosPage),
  "/financeiro/resumo": view(FinanceiroPage, { title: "Resumo financeiro" }),
  "/financeiro/fluxo-caixa": view(FinanceiroPage, { title: "Fluxo de caixa" }),
  "/financeiro/painel": view(FinanceiroPage, { title: "Painel financeiro" }),
  "/relatorios/estatisticas": view(RelatorioEstatisticasPage),
  "/relatorios/financas": view(RelatorioFinancasPage),
  "/relatorios/veiculos": view(RelatorioVeiculosPage),
  "/relatorios/clientes": view(RelatorioClientesPage),
  "/relatorios/vendas": view(RelatorioVendasPage),
  "/relatorios/emails": view(RelatorioEmailsPage),
  "/relatorios/estoque": view(RelatorioEstoquePage),
  "/relatorios/acoes": view(RelatorioAcoesPage),
  "/relatorios/via-percepcao": view(RelatorioViaPercepcaoPage),
  "/configuracoes/impressos": view(ImpressosPage),
  "/configuracoes/procedimentos": view(ProcedimentosPage),
  "/configuracoes/mensagens": view(MensagensPage),
  "/configuracoes/link-site": view(LinkSitePage),
  "/configuracoes/propriedades": view(PropriedadesForm),
  "/configuracoes/tutorial": view(TutorialPage),
  "/configuracoes/comissoes": view(ComissoesPage),
  "/configuracoes/modulos": view(ModulosPage),
  "/configuracoes/api": view(ApiPage),
  "/atalhos/leilao": view(LeilaoPage),
  "/atalhos/ipva": view(IpvaPage),
  "/atalhos/credito": view(CreditoPage),
  "/atalhos/leads": view(LeadsPage),
  "/atalhos/procurados": view(ProcuradosPage),
  "/atalhos/agenda": view(AgendaPage),
  "/atalhos/arquivos": view(ArquivosPage),
  "/atalhos/calculadora": view(CalculadoraPage),
  "/atalhos/nfe": view(NfePage),
  "/atalhos/kanban": view(KanbanPage),
  "/conta": view(ContaPage),
  "/suporte": view(SuportePage),
};

export function renderPanelView(pathname: string): ReactNode {
  const path = normalizePanelPath(pathname);
  const entry = PANEL_VIEWS[path];
  if (entry) {
    return createElement(entry.Component, entry.props);
  }
  const veiculoId = matchVeiculoId(path);
  if (veiculoId) {
    return createElement(VeiculoEditarPage, { veiculoId });
  }
  return createElement(PanelNotFound);
}
