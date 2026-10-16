# Admycar

ERP para lojas e agências de veículos multimarcas. A casca visual vem do [AdminCN Free](https://github.com/themeselection/shadcn-nextjs-admincn-admin-template-free) (MIT, Copyright (c) 2026 shadcn/studio). O conteúdo é do Admycar.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS + Lucide
- Supabase (Postgres, Auth, Storage)

## Setup

1. Copie `.env.example` para `.env.local` e preencha:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

2. No SQL Editor do Supabase, execute `supabase/migrations/20261015120000_init_patio.sql`.
3. Instale e rode:

```bash
npm install
npm run dev
```

Sem credenciais do Supabase, use **Acessar demonstração** na tela de login.

## Vitrine

O site público fica na raiz (`/`). O estoque é o mesmo do dashboard: **Veículos → À venda**, **Vendidos** e **Adicionar**.

`/admin` redireciona para `/veiculos/a-venda`. Não há um segundo painel.

`NEXT_PUBLIC_WHATSAPP` no `.env.local` usa só dígitos (DDI + DDD + número) e abre o WhatsApp da vitrine.

## Deploy

O projeto está pronto para Vercel. Configure as mesmas variáveis de ambiente no painel.
