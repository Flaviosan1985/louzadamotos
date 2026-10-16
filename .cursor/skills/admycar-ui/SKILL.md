---
name: admycar-ui
description: Define a interface do Admycar com sidebar que recolhe para ícones, grupos que abrem sozinhos na rota ativa, e um componente por arquivo. Use ao criar, alterar ou corrigir layout, menu, dashboard, páginas, sidebar ou qualquer componente visual do Admycar.
---

# Interface do Admycar

A home atual é https://admycar.com.br/3.4_Ajx/ADM. A casca visual vem do AdminCN Free em `reference/admincn`. O conteúdo do produto é o do Admycar, não o demo de pedidos, mail e calendário.

Antes de mexer na casca, leia `reference/admincn/src/components/layout/Sidebar.tsx`, `reference/admincn/src/components/ui/sidebar.tsx` e `reference/admincn/src/configs/navConfig.tsx`. Não importe esses arquivos em runtime. Não copie links marcados como Pro.

Se copiar trechos relevantes do template, mantenha o aviso de copyright MIT do shadcn/studio.

## Sidebar que recolhe

- `Sidebar` com `collapsible="icon"` dentro de `SidebarProvider`.
- Aberto: grupos com rótulo e subitens. Recolhido: só a trilha de ícones.
- No modo ícone, filhos abrem num flyout à direita. No mobile, a sidebar vira sheet em largura cheia, sem trilha de ícones.
- O grupo que contém a rota ativa abre sozinho. Um clique do usuário nesse grupo prevalece sobre a abertura automática enquanto a sessão da sidebar durar.
- O botão de recolher fica no header (`SidebarTrigger`), separado da sidebar.

O mapa dos grupos está em [menu.md](menu.md). Dados de navegação ficam em `src/configs/navConfig.ts`. A sidebar só renderiza esses dados.

## Um componente por arquivo

Cada arquivo exporta um componente e cobre uma região visual. Correção futura edita esse arquivo, não um arquivo que mistura várias regiões.

Separe antes de escrever se o arquivo for ganhar uma segunda responsabilidade:

| Arquivo | Responsabilidade |
| --- | --- |
| `src/components/layout/AppShell.tsx` | Compõe provider, sidebar, header e conteúdo |
| `src/components/layout/Sidebar.tsx` | Casca da sidebar; não lista itens na mão |
| `src/components/layout/sidebar/SidebarNavGroup.tsx` | Um grupo aberto |
| `src/components/layout/sidebar/SidebarFlyout.tsx` | Filhos no modo ícone |
| `src/components/layout/Header.tsx` | Trigger, breadcrumb e conta |
| `src/components/layout/AccountMenu.tsx` | Conta, Sobre, Suporte, Tutorial, Sair |
| `src/components/layout/ShortcutBar.tsx` | Faixa de atalhos da home |
| `src/configs/navConfig.ts` | Grupos e hrefs, sem JSX de página |
| `src/components/<modulo>/<Nome>.tsx` | Uma seção ou uma tela daquele módulo |

Regras:

- Não junte dois grupos do menu, duas seções de página, ou layout com conteúdo de página no mesmo arquivo.
- Tipos compartilhados de um módulo ficam em `types.ts` ao lado dele.
- Nome do arquivo igual ao componente.
- Ao corrigir, ache o arquivo da região visível e altere só ele e o que ele importa. Se a correção exigir outra região, crie outro arquivo.

## O que não entra no código

- Nome, telefone ou ID da loja logada. A loja atual vem da sessão.
- Dados de demonstração do AdminCN e atalhos para o template pago.
- Vários componentes exportados no mesmo arquivo para "adiantar".
