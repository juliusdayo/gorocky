import { createClient } from "@/lib/supabase/client";
import { BidWithMotorcycle } from "../types";

export const fetchBuyerBids = async (
  buyerId: number
): Promise<{
  data: BidWithMotorcycle[];
  error: string | null;
}> => {
  try {
    const supabase = createClient();

    // Fetch bids with motorcycle information using a join
    const { data, error } = await supabase
      .from("bids")
      .select(
        `
        *,
        motorcycles (
          id,
          brand,
          model_name,
          year,
          price,
          status,
          odometer,
          upgrades
        )
      `
      )
      .eq("buyer_id", buyerId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching buyer bids:", error);
      return { data: [], error: "Failed to fetch buyer bids" };
    }

    // Convert snake_case to camelCase and format the data
    const formattedData: BidWithMotorcycle[] =
      data?.map((bid) => ({
        id: bid.id,
        motorcycleId: bid.motorcycle_id,
        buyerId: bid.buyer_id,
        bidAmount: bid.bid_amount,
        status: bid.status,
        message: bid.message,
        expiresAt: bid.expires_at,
        createdAt: bid.created_at,
        updatedAt: bid.updated_at,
        motorcycle: {
          id: bid.motorcycles.id,
          brand: bid.motorcycles.brand,
          modelName: bid.motorcycles.model_name,
          year: bid.motorcycles.year,
          price: bid.motorcycles.price,
          status: bid.motorcycles.status,
          odometer: bid.motorcycles.odometer,
          upgrades: bid.motorcycles.upgrades || [],
        },
      })) || [];

    return { data: formattedData, error: null };
  } catch (err) {
    console.error("Error fetching buyer bids:", err);
    return { data: [], error: "An error occurred while fetching buyer bids" };
  }
};
