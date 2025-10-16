import { createClient } from "@/lib/supabase/client";
import { Motorcycle } from "../types";

export const fetchMotorcycles = async (): Promise<{
  data: Motorcycle[];
  error: string | null;
}> => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("motorcycles").select("*");
    if (error) {
      console.error("Error fetching motorcycles:", error);
      return { data: [], error: "Failed to fetch motorcycles" };
    }

    // Convert snake_case to camelCase to match the interface
    const formattedData: Motorcycle[] =
      data?.map((motorcycle) => ({
        id: motorcycle.id,
        brand: motorcycle.brand,
        modelName: motorcycle.model_name,
        year: motorcycle.year,
        odometer: motorcycle.odometer,
        upgrades: motorcycle.upgrades || [],
        price: motorcycle.price,
        status: motorcycle.status,
        userId: motorcycle.user_id,
        createdAt: motorcycle.created_at,
        updatedAt: motorcycle.updated_at,
      })) || [];

    return { data: formattedData, error: null };
  } catch (err) {
    console.error("Error fetching motorcycles:", err);
    return { data: [], error: "An error occurred while fetching motorcycles" };
  }
};
