import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabase/server";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid buyer ID" }, { status: 400 });
    }

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
      verified,
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

    // Build update object
    const updateData = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      contact_email: contactEmail.trim(),
      contact_phone: contactPhone?.trim() || null,
      address: address?.trim() || null,
      city: city?.trim() || null,
      state: state?.trim() || null,
      zip_code: zipCode?.trim() || null,
      verified: Boolean(verified),
      updated_at: new Date().toISOString(),
    };
    // Update buyer in database
    const { data: updatedBuyer, error } = await supabase
      .from("buyers")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Buyer not found" }, { status: 404 });
      }
      return NextResponse.json(
        { error: "Failed to update buyer" },
        { status: 500 }
      );
    }

    // Format response to match frontend expectations
    const formattedBuyer = {
      id: updatedBuyer.id,
      userId: updatedBuyer.user_id || "",
      firstName: updatedBuyer.first_name,
      lastName: updatedBuyer.last_name,
      contactPhone: updatedBuyer.contact_phone || "",
      contactEmail: updatedBuyer.contact_email,
      address: updatedBuyer.address || "",
      city: updatedBuyer.city || "",
      state: updatedBuyer.state || "",
      zipCode: updatedBuyer.zip_code || "",
      verified: updatedBuyer.verified,
      createdAt: updatedBuyer.created_at,
      updatedAt: updatedBuyer.updated_at,
    };

    return NextResponse.json(formattedBuyer, { status: 200 });
  } catch (error) {
    console.error("Error updating buyer:", error);
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
      return NextResponse.json({ error: "Invalid buyer ID" }, { status: 400 });
    }

    // Create Supabase server client
    const supabase = supabaseServer;

    // Delete buyer from database
    const { data: deletedBuyer, error } = await supabase
      .from("buyers")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Buyer not found" }, { status: 404 });
      }
      return NextResponse.json(
        { error: "Failed to delete buyer" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Buyer deleted successfully", buyer: deletedBuyer },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting buyer:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
