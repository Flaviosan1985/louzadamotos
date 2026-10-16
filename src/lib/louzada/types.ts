export type VehicleType = "moto" | "auto";
export type VehicleStatus = "disponivel" | "vendido";

export type Vehicle = {
  id: number | string;
  type: VehicleType;
  brand: string;
  model: string;
  year: number;
  km: number;
  color: string;
  price: number;
  description: string;
  status: VehicleStatus;
  featured: number;
  created_at: string;
};

export type Photo = {
  id: number;
  vehicle_id: number | string;
  filename: string;
  position: number;
};

export type VehicleWithPhotos = Vehicle & {
  photos: Photo[];
  coverUrl: string | null;
};

export type VehicleListFilters = {
  type?: VehicleType | "";
  brand?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  hideSold?: boolean;
};
