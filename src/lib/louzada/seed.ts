import fs from "node:fs";
import path from "node:path";
import type Database from "better-sqlite3";
import { getUploadDir } from "@/lib/louzada/uploads";

function copyPlaceholder(filename: string) {
  const logo = path.join(process.cwd(), "public", "logo.jpg");
  const dest = path.join(getUploadDir(), filename);
  if (fs.existsSync(logo)) {
    fs.copyFileSync(logo, dest);
  } else {
    fs.writeFileSync(dest, Buffer.alloc(0));
  }
}

export function runSeedIfEmpty(database: Database.Database) {
  const count = database.prepare("SELECT COUNT(*) AS c FROM vehicles").get() as {
    c: number;
  };
  if (count.c > 0) return;

  const insertVehicle = database.prepare(`
    INSERT INTO vehicles (type, brand, model, year, km, color, price, description, status, featured)
    VALUES (@type, @brand, @model, @year, @km, @color, @price, @description, @status, @featured)
  `);

  const insertPhoto = database.prepare(`
    INSERT INTO photos (vehicle_id, filename, position) VALUES (@vehicle_id, @filename, @position)
  `);

  const vehicles = [
    {
      type: "moto",
      brand: "Honda",
      model: "CB 500F",
      year: 2022,
      km: 12500,
      color: "Vermelha",
      price: 32900,
      description:
        "Moto impecável, revisões em dia, pneus novos. Ideal para cidade e estrada.",
      status: "disponivel",
      featured: 1,
      photo: "seed-cb500.jpg",
    },
    {
      type: "moto",
      brand: "Yamaha",
      model: "MT-03",
      year: 2021,
      km: 8900,
      color: "Preta",
      price: 28500,
      description: "Naked ágil, único dono, manual e chave reserva.",
      status: "disponivel",
      featured: 1,
      photo: "seed-mt03.jpg",
    },
    {
      type: "moto",
      brand: "Kawasaki",
      model: "Ninja 400",
      year: 2020,
      km: 15200,
      color: "Verde",
      price: 26800,
      description: "Esportiva equilibrada, aceita troca em auto de maior valor.",
      status: "vendido",
      featured: 0,
      photo: "seed-ninja400.jpg",
    },
    {
      type: "auto",
      brand: "Volkswagen",
      model: "Polo Track",
      year: 2023,
      km: 22000,
      color: "Branco",
      price: 72900,
      description: "Completo, ar digital, multimídia. IPVA pago.",
      status: "disponivel",
      featured: 1,
      photo: "seed-polo.jpg",
    },
    {
      type: "auto",
      brand: "Hyundai",
      model: "HB20 1.0",
      year: 2022,
      km: 31000,
      color: "Prata",
      price: 64900,
      description: "Econômico, revisado na concessionária, sem sinistro.",
      status: "disponivel",
      featured: 0,
      photo: "seed-hb20.jpg",
    },
  ] as const;

  for (const item of vehicles) {
    copyPlaceholder(item.photo);
    const result = insertVehicle.run({
      type: item.type,
      brand: item.brand,
      model: item.model,
      year: item.year,
      km: item.km,
      color: item.color,
      price: item.price,
      description: item.description,
      status: item.status,
      featured: item.featured,
    });
    insertPhoto.run({
      vehicle_id: result.lastInsertRowid,
      filename: item.photo,
      position: 0,
    });
  }
}
