export interface Buyer {
  id: number;
  userId: string;
  firstName: string;
  lastName: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Bid {
  id: number;
  motorcycleId: number;
  buyerId: number;
  bidAmount: number;
  status: "pending" | "accepted" | "rejected" | "withdrawn";
  message?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BidWithMotorcycle extends Bid {
  motorcycle: {
    id: number;
    brand: string;
    modelName: string;
    year: number;
    price: number;
    status: string;
    odometer: number;
    upgrades: string[];
  };
}

export interface BuyerFilters {
  name: string;
  city: string;
  state: string;
  verified: string; // 'all' | 'verified' | 'unverified'
}
