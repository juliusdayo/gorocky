import { createClient } from "@/lib/supabase/client";
import { Buyer } from "../types";

export const fetchBuyers = async (): Promise<{
  data: Buyer[];
  error: string | null;
}> => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("buyers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching buyers:", error);
      return { data: [], error: "Failed to fetch buyers" };
    }

    // Convert snake_case to camelCase to match the interface
    const formattedData: Buyer[] =
      data?.map((buyer) => ({
        id: buyer.id,
        userId: buyer.user_id,
        firstName: buyer.first_name,
        lastName: buyer.last_name,
        contactPhone: buyer.contact_phone,
        contactEmail: buyer.contact_email,
        address: buyer.address,
        city: buyer.city,
        state: buyer.state,
        zipCode: buyer.zip_code,
        verified: buyer.verified,
        createdAt: buyer.created_at,
        updatedAt: buyer.updated_at,
      })) || [];

    return { data: formattedData, error: null };
  } catch (err) {
    console.error("Error fetching buyers:", err);
    return { data: [], error: "An error occurred while fetching buyers" };
  }
};
