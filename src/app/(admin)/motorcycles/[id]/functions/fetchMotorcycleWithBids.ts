import { createClient } from "../../../../../lib/supabase/client";
import { MotorcycleWithBids } from "../types";

// Define types for the raw database response
interface RawBidResponse {
  id: number;
  motorcycle_id: number;
  buyer_id: number;
  bid_amount: number;
  status: string;
  message: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
  buyer: {
    id: number;
    first_name: string;
    last_name: string;
    contact_email: string;
    contact_phone: string | null;
    city: string;
    state: string;
    verified: boolean;
  };
}

export async function fetchMotorcycleWithBids(
  id: number
): Promise<{ data?: MotorcycleWithBids; error?: string }> {
  try {
    const supabase = createClient();

    // Fetch motorcycle details with seller information
    const { data: motorcycle, error: motorcycleError } = await supabase
      .from("motorcycles")
      .select(
        `
        *,
        brands (
          id,
          name,
          logo_url,
          country_of_origin,
          founded_year,
          website_url,
          description,
          is_active,
          created_at,
          updated_at
        ),
        seller:sellers(
          id,
          business_name,
          contact_email,
          contact_phone,
          city,
          state,
          rating,
          verified
        )
      `
      )
      .eq("id", id)
      .single();

    if (motorcycleError) {
      console.error("Error fetching motorcycle:", motorcycleError);
      return { error: "Failed to fetch motorcycle" };
    }

    if (!motorcycle) {
      return { error: "Motorcycle not found" };
    }

    // Fetch bids with buyer information
    const { data: bids, error: bidsError } = await supabase
      .from("bids")
      .select(
        `
        *,
        buyer:buyers(
          id,
          first_name,
          last_name,
          contact_email,
          contact_phone,
          city,
          state,
          verified
        )
      `
      )
      .eq("motorcycle_id", id)
      .order("bid_amount", { ascending: false }); // Order by highest bid first

    if (bidsError) {
      console.error("Error fetching bids:", bidsError);
      return { error: "Failed to fetch bids" };
    }

    // Transform the data to match our TypeScript interfaces
    const brandData = motorcycle.brands as {
      id: number;
      name: string;
      logo_url?: string;
      country_of_origin?: string;
      founded_year?: number;
      website_url?: string;
      description?: string;
      is_active?: boolean;
      created_at?: string;
      updated_at?: string;
    } | null;

    const transformedMotorcycle: MotorcycleWithBids = {
      id: motorcycle.id,
      brand_id: motorcycle.brand_id,
      brand_name: brandData?.name || "Unknown",
      brand: brandData
        ? {
            id: brandData.id,
            name: brandData.name,
            logo_url: brandData.logo_url,
            country_of_origin: brandData.country_of_origin,
            founded_year: brandData.founded_year,
            website_url: brandData.website_url,
            description: brandData.description,
            is_active: brandData.is_active ?? true,
            created_at: brandData.created_at ?? new Date().toISOString(),
            updated_at: brandData.updated_at ?? new Date().toISOString(),
          }
        : undefined,
      modelName: motorcycle.model_name,
      year: motorcycle.year,
      odometer: motorcycle.odometer,
      upgrades: motorcycle.upgrades || [],
      price: motorcycle.price,
      status: motorcycle.status,
      userId: motorcycle.user_id,
      createdAt: motorcycle.created_at,
      updatedAt: motorcycle.updated_at,
      seller: motorcycle.seller
        ? {
            id: motorcycle.seller.id,
            businessName: motorcycle.seller.business_name,
            contactEmail: motorcycle.seller.contact_email,
            contactPhone: motorcycle.seller.contact_phone,
            city: motorcycle.seller.city,
            state: motorcycle.seller.state,
            rating: motorcycle.seller.rating,
            verified: motorcycle.seller.verified,
          }
        : undefined,
      bids: (bids || []).map((bid: RawBidResponse) => ({
        id: bid.id,
        motorcycleId: bid.motorcycle_id,
        buyerId: bid.buyer_id,
        bidAmount: bid.bid_amount,
        status: bid.status as "pending" | "accepted" | "rejected" | "withdrawn",
        message: bid.message || undefined,
        expiresAt: bid.expires_at || undefined,
        createdAt: bid.created_at,
        updatedAt: bid.updated_at,
        buyer: {
          id: bid.buyer.id,
          firstName: bid.buyer.first_name,
          lastName: bid.buyer.last_name,
          contactEmail: bid.buyer.contact_email,
          contactPhone: bid.buyer.contact_phone || undefined,
          city: bid.buyer.city,
          state: bid.buyer.state,
          verified: bid.buyer.verified,
        },
      })),
    };

    return { data: transformedMotorcycle };
  } catch (error) {
    console.error("Error in fetchMotorcycleWithBids:", error);
    return { error: "An unexpected error occurred" };
  }
}
