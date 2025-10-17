import { NextRequest, NextResponse } from "next/server";
import {
  supabaseServer,
  createSupabaseServerClient,
} from "../../../../lib/supabase/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid motorcycle ID" },
        { status: 400 }
      );
    }

    // Get motorcycle from Supabase with brand information
    const { data: motorcycle, error } = await supabaseServer
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
        )
      `
      )
      .eq("id", id)
      .eq("status", "available")
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Motorcycle not found" },
          { status: 404 }
        );
      }
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }

    // Format response to match frontend expectations
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

    const formattedMotorcycle = {
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

    return NextResponse.json(formattedMotorcycle, { status: 200 });
  } catch (error) {
    console.error("Error fetching motorcycle:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid motorcycle ID" },
        { status: 400 }
      );
    }

    // Get auth token from request headers
    const authToken = request.headers
      .get("authorization")
      ?.replace("Bearer ", "");

    // Create Supabase client with auth
    const supabase = createSupabaseServerClient(authToken);

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { brand, modelName, year, odometer, upgrades, price, status } = body;

    // Validate data if provided
    if (
      year &&
      (typeof year !== "number" ||
        year < 1900 ||
        year > new Date().getFullYear() + 1)
    ) {
      return NextResponse.json({ error: "Invalid year" }, { status: 400 });
    }

    if (odometer && (typeof odometer !== "number" || odometer < 0)) {
      return NextResponse.json(
        { error: "Invalid odometer reading" },
        { status: 400 }
      );
    }

    if (price && (typeof price !== "number" || price < 0)) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 });
    }

    // Build update object
    const updateData: {
      brand?: string;
      model_name?: string;
      year?: number;
      odometer?: number;
      upgrades?: string[];
      price?: number;
      status?: string;
    } = {};
    if (brand) updateData.brand = brand.trim();
    if (modelName) updateData.model_name = modelName.trim();
    if (year) updateData.year = year;
    if (odometer) updateData.odometer = odometer;
    if (upgrades) updateData.upgrades = Array.isArray(upgrades) ? upgrades : [];
    if (price) updateData.price = price;
    if (status) updateData.status = status;

    // Update motorcycle in database (only if user owns it)
    const { data: updatedMotorcycle, error } = await supabase
      .from("motorcycles")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", user.id) // Ensure user can only update their own motorcycles
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          {
            error:
              "Motorcycle not found or you don't have permission to update it",
          },
          { status: 404 }
        );
      }
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to update motorcycle" },
        { status: 500 }
      );
    }

    // Format response to match frontend expectations
    const formattedMotorcycle = {
      id: updatedMotorcycle.id,
      brand: updatedMotorcycle.brand,
      modelName: updatedMotorcycle.model_name,
      year: updatedMotorcycle.year,
      odometer: updatedMotorcycle.odometer,
      upgrades: updatedMotorcycle.upgrades || [],
      price: updatedMotorcycle.price,
      status: updatedMotorcycle.status,
      userId: updatedMotorcycle.user_id,
      createdAt: updatedMotorcycle.created_at,
      updatedAt: updatedMotorcycle.updated_at,
    };

    return NextResponse.json(
      {
        message: "Motorcycle updated successfully",
        motorcycle: formattedMotorcycle,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating motorcycle:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid motorcycle ID" },
        { status: 400 }
      );
    }

    // Get auth token from request headers
    const authToken = request.headers
      .get("authorization")
      ?.replace("Bearer ", "");

    // Create Supabase client with auth
    const supabase = createSupabaseServerClient(authToken);

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Delete motorcycle from database (only if user owns it)
    const { data: deletedMotorcycle, error } = await supabase
      .from("motorcycles")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id) // Ensure user can only delete their own motorcycles
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          {
            error:
              "Motorcycle not found or you don't have permission to delete it",
          },
          { status: 404 }
        );
      }
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to delete motorcycle" },
        { status: 500 }
      );
    }

    // Format response to match frontend expectations
    const formattedMotorcycle = {
      id: deletedMotorcycle.id,
      brand: deletedMotorcycle.brand,
      modelName: deletedMotorcycle.model_name,
      year: deletedMotorcycle.year,
      odometer: deletedMotorcycle.odometer,
      upgrades: deletedMotorcycle.upgrades || [],
      price: deletedMotorcycle.price,
      status: deletedMotorcycle.status,
      userId: deletedMotorcycle.user_id,
      createdAt: deletedMotorcycle.created_at,
      updatedAt: deletedMotorcycle.updated_at,
    };

    return NextResponse.json(
      {
        message: "Motorcycle deleted successfully",
        motorcycle: formattedMotorcycle,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting motorcycle:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
