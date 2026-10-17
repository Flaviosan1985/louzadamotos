# Louzada API (Cloudflare Workers + D1 + R2)

Back-end serverless para migrar o Louzada Motos off Supabase/local SQLite.

## Stack

| Recurso | Cloudflare |
|--------|------------|
| Dados | **D1** (`schema/0001_auth.sql`, `0002_louzada.sql`) |
| Fotos | **R2** (bucket privado) |
| API | **Workers** (`src/index.ts`) |

## Setup rápido

```bash
cd workers
cp wrangler.toml.example wrangler.toml
npm install
npm run db:migrate          # D1 local
npm run dev
```

Secrets:

```bash
npx wrangler secret put JWT_SECRET
npx wrangler secret put R2_ACCESS_KEY_ID
npx wrangler secret put R2_SECRET_ACCESS_KEY
```

Produção:

```bash
npm run db:migrate:remote
npm run deploy
```

## Autorização (substitui RLS)

- **D1 não tem RLS** — toda query sensível usa `requireAuth()` e filtra por `userId` / metadados R2.
- **Senha:** nunca retornada; troca só em `POST /me/password` com senha atual.
- **Fotos admin:** upload/list/delete exigem JWT; objeto R2 inclui `customMetadata.userId`.
- **Vitrine:** `GET /public/photos/:id` só se o veículo estiver `disponivel`.

## Rotas

| Método | Rota | Auth |
|--------|------|------|
| POST | `/auth/register` | — |
| POST | `/auth/login` | — |
| GET | `/me` | JWT |
| POST | `/me/password` | JWT |
| GET | `/public/vehicles` | — |
| GET/POST | `/vehicles/:id/photos` | JWT |
| GET | `/photos/:id/url` | JWT (presigned) |
| DELETE | `/photos/:id` | JWT |
| GET | `/public/photos/:id` | — (veículo disponível) |

JWT: header `Authorization: Bearer …` ou cookie `louzada_token`.

## Next.js

No `.env.local` da raiz do monorepo:

```env
LOUZADA_BACKEND=cloudflare
CLOUDFLARE_API_URL=http://127.0.0.1:8787
```

O login em `/api/auth/login` usa email/senha contra o Worker quando `LOUZADA_BACKEND=cloudflare`.

Documentação completa da migração: [`docs/cloudflare-migracao.md`](../docs/cloudflare-migracao.md).
