import { createClient } from "@/lib/supabase/client";
import { Motorcycle } from "../types";

export const fetchMotorcycles = async (): Promise<{
  data: Motorcycle[];
  error: string | null;
}> => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("motorcycles").select(`
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
        )
      `);

    if (error) {
      console.error("Error fetching motorcycles:", error);
      return { data: [], error: "Failed to fetch motorcycles" };
    }

    // Convert snake_case to camelCase to match the interface
    const formattedData: Motorcycle[] =
      data?.map((motorcycle) => {
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

        return {
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
        };
      }) || [];

    return { data: formattedData, error: null };
  } catch (err) {
    console.error("Error fetching motorcycles:", err);
    return { data: [], error: "An error occurred while fetching motorcycles" };
  }
};
