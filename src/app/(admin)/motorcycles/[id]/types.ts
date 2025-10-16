import { Motorcycle } from "../types";

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

export interface BidWithBuyer extends Bid {
  buyer: {
    id: number;
    firstName: string;
    lastName: string;
    contactEmail: string;
    contactPhone?: string;
    city?: string;
    state?: string;
    verified: boolean;
  };
}

export interface MotorcycleWithBids extends Motorcycle {
  bids: BidWithBuyer[];
  seller?: {
    id: number;
    businessName?: string;
    contactEmail?: string;
    contactPhone?: string;
    city?: string;
    state?: string;
    rating?: number;
    verified: boolean;
  };
}
