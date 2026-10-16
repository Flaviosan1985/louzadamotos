export type AdminTabId = "vehicles" | "register" | "photos" | "sold";

export const ADMIN_TAB_LABELS: Record<AdminTabId, string> = {
  vehicles: "Veículos",
  register: "Cadastrar veículo",
  photos: "Fotos",
  sold: "Vendidos",
};
