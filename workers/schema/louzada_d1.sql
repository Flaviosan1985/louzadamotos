-- Louzada Motos — Cloudflare D1 (SQLite)
-- Sem Supabase. Aplicar com: wrangler d1 execute louzada-db --local|--remote --file=./schema/louzada_d1.sql

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS usuarios (
  id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  email       TEXT NOT NULL COLLATE NOCASE,
  senha_hash  TEXT NOT NULL,
  criado_em   TEXT NOT NULL DEFAULT (datetime('now')),
  CONSTRAINT usuarios_email_unique UNIQUE (email)
);

CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios (email);

CREATE TABLE IF NOT EXISTS veiculos (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  marca     TEXT NOT NULL,
  modelo    TEXT NOT NULL,
  ano       INTEGER NOT NULL CHECK (ano >= 1900 AND ano <= 2100),
  preco     REAL NOT NULL CHECK (preco >= 0),
  status    TEXT NOT NULL DEFAULT 'Disponível' CHECK (
    status IN ('Disponível', 'Vendido', 'Reservado')
  ),
  criado_em TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_veiculos_status ON veiculos (status);
CREATE INDEX IF NOT EXISTS idx_veiculos_marca ON veiculos (marca);

CREATE TABLE IF NOT EXISTS fotos (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  veiculo_id INTEGER NOT NULL,
  r2_key     TEXT NOT NULL,
  ordem      INTEGER NOT NULL DEFAULT 0,
  criado_em  TEXT NOT NULL DEFAULT (datetime('now')),
  CONSTRAINT fotos_veiculo_fk
    FOREIGN KEY (veiculo_id) REFERENCES veiculos (id)
    ON DELETE CASCADE,
  CONSTRAINT fotos_r2_key_unique UNIQUE (r2_key)
);

CREATE INDEX IF NOT EXISTS idx_fotos_veiculo ON fotos (veiculo_id);
CREATE INDEX IF NOT EXISTS idx_fotos_veiculo_ordem ON fotos (veiculo_id, ordem);
