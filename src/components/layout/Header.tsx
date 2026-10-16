"use client";

import { Fragment } from "react";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AccountMenu } from "@/components/layout/AccountMenu";

const SECTION_HREFS: Record<string, string> = {
  "/cadastros": "/cadastros/usuarios",
  "/veiculos": "/veiculos/a-venda",
  "/financeiro": "/financeiro/resumo",
  "/relatorios": "/relatorios/estatisticas",
  "/configuracoes": "/configuracoes/impressos",
  "/atalhos": "/atalhos/agenda",
};

const LABELS: Record<string, string> = {
  sistema: "Painel",
  cadastros: "Cadastros",
  usuarios: "Usuários",
  lojas: "Lojas/Locais",
  clientes: "Clientes",
  fornecedores: "Fornecedores",
  bancos: "Bancos",
  despachantes: "Despachantes",
  almoxarifado: "Almoxarifado",
  veiculos: "Veículos",
  adicionar: "Adicionar",
  "a-venda": "À venda",
  vendidos: "Vendidos",
  reservados: "Reservados",
  emprestados: "Emprestados",
  conferencia: "Conferência",
  renave: "Renave",
  pendencias: "Pendências",
  "cadastro-pendente": "Cadastro pendente",
  excluidos: "Excluídos",
  financeiro: "Financeiro",
  resumo: "Resumo",
  "fluxo-caixa": "Fluxo de caixa",
  painel: "Painel",
  relatorios: "Relatórios",
  estatisticas: "Estatísticas",
  financas: "Finanças",
  vendas: "Vendas",
  emails: "E-mails",
  estoque: "Listagem de estoque",
  acoes: "Ações de usuários",
  "via-percepcao": "Via de percepção",
  configuracoes: "Configurações",
  impressos: "Impressos",
  procedimentos: "Procedimentos",
  mensagens: "Mensagens",
  "link-site": "Link com o site",
  propriedades: "Propriedades",
  tutorial: "Tutorial",
  comissoes: "Gestão de comissões",
  modulos: "Módulos",
  api: "API",
  atalhos: "Atalhos",
  conta: "Conta",
  sobre: "Sobre",
  suporte: "Suporte",
};

export function Header() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <header className="sticky top-0 z-50 bg-[#F5F4F8]">
      <div className="mx-auto flex max-w-360 items-center justify-between gap-6 px-4 py-2 sm:px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="[&_svg]:size-5!" />
          <Separator orientation="vertical" className="hidden h-4! data-vertical:self-center sm:block" />
          <Breadcrumb className="hidden sm:block">
            <BreadcrumbList>
              {segments.length === 0 ? (
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              ) : (
                segments.map((segment, index) => {
                  const isLast = index === segments.length - 1;
                  const label = LABELS[segment] ?? segment;
                  const path = "/" + segments.slice(0, index + 1).join("/");
                  const href = SECTION_HREFS[path] ?? path;

                  return (
                    <Fragment key={path}>
                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage>{label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {!isLast ? <BreadcrumbSeparator /> : null}
                    </Fragment>
                  );
                })
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <AccountMenu />
      </div>
    </header>
  );
}
