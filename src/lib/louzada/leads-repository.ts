import { getDb } from "@/lib/louzada/db";

export type VehicleLead = {
  id: number;
  vehicle_id: number;
  customer_name: string;
  phone: string;
  message: string;
  created_at: string;
};

export type VehicleLeadWithVehicle = VehicleLead & {
  brand: string;
  model: string;
  year: number;
};

export function createLead(input: {
  vehicleId: number;
  customerName: string;
  phone: string;
  message: string;
}) {
  const database = getDb();
  const result = database
    .prepare(
      `INSERT INTO vehicle_leads (vehicle_id, customer_name, phone, message)
       VALUES (@vehicleId, @customerName, @phone, @message)`,
    )
    .run({
      vehicleId: input.vehicleId,
      customerName: input.customerName.trim(),
      phone: input.phone.replace(/\D/g, ""),
      message: input.message.trim(),
    });

  return database
    .prepare(
      "SELECT id, vehicle_id, customer_name, phone, message, created_at FROM vehicle_leads WHERE id = ?",
    )
    .get(result.lastInsertRowid) as VehicleLead;
}

export function listLeads(vehicleId?: number): VehicleLeadWithVehicle[] {
  const database = getDb();
  if (vehicleId) {
    return database
      .prepare(
        `SELECT l.id, l.vehicle_id, l.customer_name, l.phone, l.message, l.created_at,
                v.brand, v.model, v.year
         FROM vehicle_leads l
         JOIN vehicles v ON v.id = l.vehicle_id
         WHERE l.vehicle_id = ?
         ORDER BY l.created_at DESC`,
      )
      .all(vehicleId) as VehicleLeadWithVehicle[];
  }

  return database
    .prepare(
      `SELECT l.id, l.vehicle_id, l.customer_name, l.phone, l.message, l.created_at,
              v.brand, v.model, v.year
       FROM vehicle_leads l
       JOIN vehicles v ON v.id = l.vehicle_id
       ORDER BY l.created_at DESC`,
    )
    .all() as VehicleLeadWithVehicle[];
}

export function countLeadsByVehicle(vehicleId: number) {
  const database = getDb();
  const row = database
    .prepare("SELECT COUNT(*) AS c FROM vehicle_leads WHERE vehicle_id = ?")
    .get(vehicleId) as { c: number };
  return row.c;
}
