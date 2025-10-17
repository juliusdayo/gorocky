import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "../../../lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get("active");

    let query = supabaseServer.from("brands").select("*");

    // Filter by active status if specified
    if (active === "true") {
      query = query.eq("is_active", true);
    }

    const { data: brands, error } = await query.order("name");

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch brands" },
        { status: 500 }
      );
    }

    return NextResponse.json(brands, { status: 200 });
  } catch (error) {
    console.error("Error fetching brands:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      logo_url,
      country_of_origin,
      founded_year,
      website_url,
      description,
    } = body;

    // Validate required fields
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Brand name is required" },
        { status: 400 }
      );
    }

    // Validate founded_year if provided
    if (
      founded_year &&
      (typeof founded_year !== "number" ||
        founded_year < 1800 ||
        founded_year > 2030)
    ) {
      return NextResponse.json(
        { error: "Invalid founded year" },
        { status: 400 }
      );
    }

    const brandData = {
      name: name.trim(),
      logo_url: logo_url?.trim() || null,
      country_of_origin: country_of_origin?.trim() || null,
      founded_year: founded_year || null,
      website_url: website_url?.trim() || null,
      description: description?.trim() || null,
      is_active: true,
    };

    const { data: newBrand, error } = await supabaseServer
      .from("brands")
      .insert(brandData)
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Brand name already exists" },
          { status: 409 }
        );
      }
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to create brand" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Brand created successfully",
        brand: newBrand,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating brand:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
