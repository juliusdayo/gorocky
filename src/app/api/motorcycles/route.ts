import { NextRequest, NextResponse } from "next/server";
import {
  supabaseServer,
  createSupabaseServerClient,
} from "../../../lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    // Get query parameters for filtering/pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const brand = searchParams.get("brand");
    const minYear = searchParams.get("minYear");
    const maxYear = searchParams.get("maxYear");
    const maxPrice = searchParams.get("maxPrice");
    const minPrice = searchParams.get("minPrice");

    // Start building the Supabase query
    let query = supabaseServer
      .from("motorcycles")
      .select("*", { count: "exact" })
      .eq("status", "available") // Only show available motorcycles
      .order("created_at", { ascending: false });

    // Apply filters
    if (brand) {
      query = query.ilike("brand", `%${brand}%`);
    }

    if (minYear) {
      query = query.gte("year", parseInt(minYear));
    }

    if (maxYear) {
      query = query.lte("year", parseInt(maxYear));
    }

    if (minPrice) {
      query = query.gte("price", parseFloat(minPrice));
    }

    if (maxPrice) {
      query = query.lte("price", parseFloat(maxPrice));
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    query = query.range(startIndex, startIndex + limit - 1);

    // Execute query
    const { data: motorcycles, error, count } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch motorcycles" },
        { status: 500 }
      );
    }

    // Prepare response with snake_case to camelCase conversion
    const formattedMotorcycles =
      motorcycles?.map((motorcycle) => ({
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

    const response = {
      motorcycles: formattedMotorcycles,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        hasNext: startIndex + limit < (count || 0),
        hasPrev: page > 1,
      },
      filters: {
        brand,
        minYear,
        maxYear,
        minPrice,
        maxPrice,
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching motorcycles:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

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

    // Validate required fields
    const { brand, modelName, year, odometer, upgrades = [], price } = body;

    if (!brand || !modelName || !year || !odometer || !price) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: brand, modelName, year, odometer, price",
        },
        { status: 400 }
      );
    }

    // Validate data types
    if (
      typeof year !== "number" ||
      typeof odometer !== "number" ||
      typeof price !== "number"
    ) {
      return NextResponse.json(
        { error: "Year, odometer, and price must be numbers" },
        { status: 400 }
      );
    }

    if (year < 1900 || year > new Date().getFullYear() + 1) {
      return NextResponse.json({ error: "Invalid year" }, { status: 400 });
    }

    if (odometer < 0) {
      return NextResponse.json(
        { error: "Odometer cannot be negative" },
        { status: 400 }
      );
    }

    if (price < 0) {
      return NextResponse.json(
        { error: "Price cannot be negative" },
        { status: 400 }
      );
    }

    // Create new motorcycle in database
    const { data: newMotorcycle, error } = await supabase
      .from("motorcycles")
      .insert([
        {
          brand: brand.trim(),
          model_name: modelName.trim(),
          year,
          odometer,
          upgrades: Array.isArray(upgrades) ? upgrades : [],
          price,
          status: "available",
          user_id: user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to create motorcycle listing" },
        { status: 500 }
      );
    }

    // Format response to match frontend expectations
    const formattedMotorcycle = {
      id: newMotorcycle.id,
      brand: newMotorcycle.brand,
      modelName: newMotorcycle.model_name,
      year: newMotorcycle.year,
      odometer: newMotorcycle.odometer,
      upgrades: newMotorcycle.upgrades || [],
      price: newMotorcycle.price,
      status: newMotorcycle.status,
      userId: newMotorcycle.user_id,
      createdAt: newMotorcycle.created_at,
      updatedAt: newMotorcycle.updated_at,
    };

    return NextResponse.json(
      {
        message: "Motorcycle created successfully",
        motorcycle: formattedMotorcycle,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating motorcycle:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
