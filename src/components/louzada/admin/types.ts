export type AdminTabId = "vehicles" | "register" | "photos" | "sold" | "leads";

export const ADMIN_TAB_LABELS: Record<AdminTabId, string> = {
  vehicles: "Veículos",
  register: "Cadastrar moto",
  photos: "Fotos",
  sold: "Vendidos",
  leads: "Interessados",
};
