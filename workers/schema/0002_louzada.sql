-- Louzada Motos — espelha src/lib/louzada/db.ts (SQLite local → D1)
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS vehicles (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  type         TEXT NOT NULL CHECK (type IN ('moto', 'auto')),
  brand        TEXT NOT NULL,
  model        TEXT NOT NULL,
  year         INTEGER NOT NULL,
  km           INTEGER NOT NULL DEFAULT 0,
  color        TEXT NOT NULL DEFAULT '',
  price        REAL NOT NULL,
  description  TEXT NOT NULL DEFAULT '',
  status       TEXT NOT NULL DEFAULT 'disponivel' CHECK (status IN ('disponivel', 'vendido')),
  featured     INTEGER NOT NULL DEFAULT 0,
  displacement INTEGER,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles (status);
CREATE INDEX IF NOT EXISTS idx_vehicles_type ON vehicles (type);

CREATE TABLE IF NOT EXISTS photos (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  vehicle_id    INTEGER NOT NULL,
  r2_object_key TEXT NOT NULL,
  position      INTEGER NOT NULL DEFAULT 0,
  caption       TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (vehicle_id) REFERENCES vehicles (id) ON DELETE CASCADE,
  CONSTRAINT photos_r2_key_unique UNIQUE (r2_object_key)
);

CREATE INDEX IF NOT EXISTS idx_photos_vehicle ON photos (vehicle_id);

CREATE TABLE IF NOT EXISTS vehicle_leads (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  vehicle_id    INTEGER NOT NULL,
  customer_name TEXT NOT NULL DEFAULT '',
  phone         TEXT NOT NULL,
  message       TEXT NOT NULL DEFAULT '',
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (vehicle_id) REFERENCES vehicles (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_leads_vehicle ON vehicle_leads (vehicle_id);
CREATE INDEX IF NOT EXISTS idx_leads_created ON vehicle_leads (created_at);
