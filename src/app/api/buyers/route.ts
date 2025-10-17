import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "../../../lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      contactEmail,
      contactPhone,
      address,
      city,
      state,
      zipCode,
      verified = false,
    } = body;

    // Basic validation
    if (!firstName?.trim() || !lastName?.trim() || !contactEmail?.trim()) {
      return NextResponse.json(
        { error: "First name, last name, and email are required" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Create Supabase server client
    const supabase = supabaseServer;

    // Check if email already exists
    const { data: existingBuyer } = await supabase
      .from("buyers")
      .select("id")
      .eq("contact_email", contactEmail.trim())
      .single();

    if (existingBuyer) {
      return NextResponse.json(
        { error: "A buyer with this email already exists" },
        { status: 400 }
      );
    }

    // Build insert object
    const insertData = {
      user_id: null, // Admin-created buyers don't have user accounts initially
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      contact_email: contactEmail.trim(),
      contact_phone: contactPhone?.trim() || null,
      address: address?.trim() || null,
      city: city?.trim() || null,
      state: state?.trim() || null,
      zip_code: zipCode?.trim() || null,
      verified: Boolean(verified),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Insert buyer into database
    const { data: newBuyer, error } = await supabase
      .from("buyers")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to create buyer" },
        { status: 500 }
      );
    }

    // Format response to match frontend expectations
    const formattedBuyer = {
      id: newBuyer.id,
      userId: newBuyer.user_id || "",
      firstName: newBuyer.first_name,
      lastName: newBuyer.last_name,
      contactPhone: newBuyer.contact_phone || "",
      contactEmail: newBuyer.contact_email,
      address: newBuyer.address || "",
      city: newBuyer.city || "",
      state: newBuyer.state || "",
      zipCode: newBuyer.zip_code || "",
      verified: newBuyer.verified,
      createdAt: newBuyer.created_at,
      updatedAt: newBuyer.updated_at,
    };

    return NextResponse.json(formattedBuyer, { status: 201 });
  } catch (error) {
    console.error("Error creating buyer:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
