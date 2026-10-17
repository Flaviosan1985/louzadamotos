# Migração Supabase / SQLite → Cloudflare

Este repositório suporta **dois backends** para o Louzada Motos:

| Modo | Quando usar |
|------|-------------|
| `LOUZADA_BACKEND=local` (padrão) | Dev com `better-sqlite3` + pasta `uploads/` |
| `LOUZADA_BACKEND=cloudflare` | Produção com Workers + D1 + R2 |

O painel Admycar (`/veiculos`, Supabase) continua independente até você migrar o ERP para D1/Workers.

## 1. Provisionar Cloudflare

1. Crie banco **D1** `louzada-db`.
2. Crie bucket **R2** privado `louzada-fotos-privadas` (sem domínio público).
3. Gere **R2 API token** (read/write no bucket).
4. Deploy do Worker em `workers/` (ver [`workers/README.md`](../workers/README.md)).

## 2. Aplicar schema D1

Ordem:

1. `workers/schema/0001_auth.sql` — usuários e sessões
2. `workers/schema/0002_louzada.sql` — veículos, fotos (`r2_object_key`), leads

Espelha `src/lib/louzada/db.ts` com fotos apontando para R2 em vez de `filename` local.

## 3. Variáveis no Next.js

```env
LOUZADA_BACKEND=cloudflare
CLOUDFLARE_API_URL=https://louzada-api.seudominio.workers.dev
SESSION_SECRET=...   # cookie do middleware Louzada (gate /painel)
```

Supabase (ERP) permanece:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## 4. Autenticação

| Antes | Depois |
|-------|--------|
| `ADMIN_USER` / `ADMIN_PASSWORD` | `POST /auth/register` + login email/senha |
| Cookie `louzada_session` (HMAC) | Mantido para o middleware Next; login Cloudflare também grava `louzada_token` (JWT) |

No formulário do painel, o campo **Usuário** aceita o **email** cadastrado no Worker.

Senhas: **PBKDF2-SHA256** (210k iterações) via Web Crypto no Worker — ver `workers/src/crypto/password.ts`.

## 5. Fotos

| Local | Cloudflare |
|-------|------------|
| `/api/uploads/:name` público | R2 privado |
| `photos.filename` | `photos.r2_object_key` |
| — | Vitrine: `GET /public/photos/:id` (só veículo `disponivel`) |
| — | Admin: upload autenticado + `GET /photos/:id/url` (presigned 5 min) |

Cliente Next: `cloudflarePublicPhotoUrl(id)` em `src/lib/cloudflare/client.ts`.

## 6. Leads

Tabela `vehicle_leads` já está no D1. Próximo passo: mover `POST /api/leads` para o Worker (mesmo padrão de validação + rate limit).

## 7. Mapa RLS → Worker

| Supabase RLS | Worker |
|--------------|--------|
| `auth.uid()` | JWT `sub` → `userId` |
| `tenant_id = current_tenant()` | Futuro: coluna `tenant_id` + filtro em toda query |
| Storage policies | R2 privado + proxy/presigned |
| `profiles` / papéis | `users.role` + checks no handler |

## 8. Checklist de cutover

- [ ] Migrar dados SQLite → D1 (script ETL ou export CSV)
- [ ] Copiar arquivos `uploads/` → R2 com keys `users/...`
- [ ] Apontar `LOUZADA_BACKEND=cloudflare`
- [ ] Testar login, upload, vitrine pública, troca de senha
- [ ] Desligar `ADMIN_USER` em produção
