import type Database from "better-sqlite3";
import { getDb } from "@/lib/louzada/db";
import { photoPublicUrl } from "@/lib/louzada/uploads";
import type {
  Photo,
  Vehicle,
  VehicleListFilters,
  VehicleWithPhotos,
  VehicleStatus,
  VehicleType,
} from "@/lib/louzada/types";

function mapVehicle(row: Vehicle): Vehicle {
  return {
    ...row,
    featured: Number(row.featured),
    price: Number(row.price),
    year: Number(row.year),
    km: Number(row.km),
  };
}

function attachPhotos(database: Database.Database, vehicle: Vehicle): VehicleWithPhotos {
  const photos = database
    .prepare(
      "SELECT id, vehicle_id, filename, position FROM photos WHERE vehicle_id = ? ORDER BY position ASC, id ASC",
    )
    .all(vehicle.id) as Photo[];

  const cover = photos[0];
  return {
    ...vehicle,
    photos,
    coverUrl: cover ? photoPublicUrl(cover.filename) : null,
  };
}

function buildListQuery(filters: VehicleListFilters) {
  const clauses: string[] = [];
  const params: unknown[] = [];

  if (filters.type) {
    clauses.push("type = ?");
    params.push(filters.type);
  }
  if (filters.brand?.trim()) {
    clauses.push("LOWER(brand) = LOWER(?)");
    params.push(filters.brand.trim());
  }
  if (filters.q?.trim()) {
    clauses.push("(LOWER(brand) LIKE ? OR LOWER(model) LIKE ? OR LOWER(description) LIKE ?)");
    const like = `%${filters.q.trim().toLowerCase()}%`;
    params.push(like, like, like);
  }
  if (filters.minPrice != null && !Number.isNaN(filters.minPrice)) {
    clauses.push("price >= ?");
    params.push(filters.minPrice);
  }
  if (filters.maxPrice != null && !Number.isNaN(filters.maxPrice)) {
    clauses.push("price <= ?");
    params.push(filters.maxPrice);
  }
  if (filters.hideSold) {
    clauses.push("status = 'disponivel'");
  }

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  return { where, params };
}

export function listVehicles(filters: VehicleListFilters = {}): VehicleWithPhotos[] {
  const database = getDb();
  const { where, params } = buildListQuery(filters);
  const rows = database
    .prepare(
      `SELECT * FROM vehicles ${where}
       ORDER BY
         CASE WHEN status = 'vendido' THEN 1 ELSE 0 END,
         featured DESC,
         created_at DESC`,
    )
    .all(...params) as Vehicle[];

  return rows.map((row) => attachPhotos(database, mapVehicle(row)));
}

export function listBrands(type?: VehicleType) {
  const database = getDb();
  if (type) {
    return database
      .prepare(
        "SELECT DISTINCT brand FROM vehicles WHERE type = ? ORDER BY brand COLLATE NOCASE",
      )
      .all(type)
      .map((r) => (r as { brand: string }).brand);
  }
  return database
    .prepare("SELECT DISTINCT brand FROM vehicles ORDER BY brand COLLATE NOCASE")
    .all()
    .map((r) => (r as { brand: string }).brand);
}

export function getVehicleById(id: number): VehicleWithPhotos | null {
  const database = getDb();
  const row = database.prepare("SELECT * FROM vehicles WHERE id = ?").get(id) as
    | Vehicle
    | undefined;
  if (!row) return null;
  return attachPhotos(database, mapVehicle(row));
}

export type CreateVehicleInput = {
  type: VehicleType;
  brand: string;
  model: string;
  year: number;
  km: number;
  color: string;
  price: number;
  description: string;
  featured?: boolean;
};

export function createVehicle(input: CreateVehicleInput) {
  const database = getDb();
  const result = database
    .prepare(
      `INSERT INTO vehicles (type, brand, model, year, km, color, price, description, featured)
       VALUES (@type, @brand, @model, @year, @km, @color, @price, @description, @featured)`,
    )
    .run({
      ...input,
      featured: input.featured ? 1 : 0,
    });
  return getVehicleById(Number(result.lastInsertRowid));
}

export type UpdateVehicleInput = Partial<CreateVehicleInput> & {
  status?: VehicleStatus;
};

export function updateVehicle(id: number, input: UpdateVehicleInput) {
  const database = getDb();
  const current = getVehicleById(id);
  if (!current) return null;

  const next = {
    type: input.type ?? current.type,
    brand: input.brand ?? current.brand,
    model: input.model ?? current.model,
    year: input.year ?? current.year,
    km: input.km ?? current.km,
    color: input.color ?? current.color,
    price: input.price ?? current.price,
    description: input.description ?? current.description,
    status: input.status ?? current.status,
    featured: input.featured != null ? (input.featured ? 1 : 0) : current.featured,
  };

  database
    .prepare(
      `UPDATE vehicles SET
        type = @type, brand = @brand, model = @model, year = @year, km = @km,
        color = @color, price = @price, description = @description,
        status = @status, featured = @featured
       WHERE id = @id`,
    )
    .run({ ...next, id });

  return getVehicleById(id);
}

export function deleteVehicle(id: number) {
  const database = getDb();
  const result = database.prepare("DELETE FROM vehicles WHERE id = ?").run(id);
  return result.changes > 0;
}

export function listSoldVehicles() {
  return listVehicles({ hideSold: false }).filter((v) => v.status === "vendido");
}
