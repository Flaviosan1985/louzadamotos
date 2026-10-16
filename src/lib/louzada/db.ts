import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { runSeedIfEmpty } from "@/lib/louzada/seed";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "louzada.db");

let db: Database.Database | null = null;

function initSchema(database: Database.Database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL CHECK(type IN ('moto', 'auto')),
      brand TEXT NOT NULL,
      model TEXT NOT NULL,
      year INTEGER NOT NULL,
      km INTEGER NOT NULL DEFAULT 0,
      color TEXT NOT NULL DEFAULT '',
      price REAL NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'disponivel' CHECK(status IN ('disponivel', 'vendido')),
      featured INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS photos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
      filename TEXT NOT NULL,
      position INTEGER NOT NULL DEFAULT 0
    );

    CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
    CREATE INDEX IF NOT EXISTS idx_vehicles_type ON vehicles(type);
    CREATE INDEX IF NOT EXISTS idx_photos_vehicle ON photos(vehicle_id);
  `);
}

export function getDb() {
  if (!db) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    initSchema(db);
    runSeedIfEmpty(db);
  }
  return db;
}
