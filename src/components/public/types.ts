// Public types for motorcycles (subset of admin types)
export interface Motorcycle {
  id: number;
  brand: string;
  modelName: string;
  year: number;
  odometer: number;
  upgrades: string[];
  price: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface MotorcycleFilters {
  brand: string;
  minYear: string;
  maxYear: string;
  minPrice: string;
  maxPrice: string;
  status?: string;
}
