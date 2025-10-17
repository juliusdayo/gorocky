export interface Brand {
  id: number;
  name: string;
  logo_url?: string;
  country_of_origin?: string;
  founded_year?: number;
  website_url?: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Motorcycle {
  id: number;
  brand_id: number;
  brand?: Brand; // Optional populated brand object
  brand_name?: string; // For backward compatibility and display
  modelName: string;
  year: number;
  odometer: number;
  upgrades: string[];
  price: number;
  status: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface MotorcycleFilters {
  brand: string;
  minYear: string;
  maxYear: string;
  minPrice: string;
  maxPrice: string;
}
