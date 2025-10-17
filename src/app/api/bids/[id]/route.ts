import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const bidId = parseInt(params.id);

    if (isNaN(bidId)) {
      return NextResponse.json({ error: "Invalid bid ID" }, { status: 400 });
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
    const { status } = body;

    // Validate status
    if (!status || !["accepted", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be 'accepted' or 'rejected'" },
        { status: 400 }
      );
    }

    // First, get the bid and motorcycle details
    const { data: bid, error: bidError } = await supabase
      .from("bids")
      .select("id, motorcycle_id")
      .eq("id", bidId)
      .single();

    if (bidError || !bid) {
      return NextResponse.json({ error: "Bid not found" }, { status: 404 });
    }

    // Check if user owns the motorcycle
    const { data: motorcycle, error: motorcycleError } = await supabase
      .from("motorcycles")
      .select("user_id")
      .eq("id", bid.motorcycle_id)
      .single();

    if (motorcycleError || !motorcycle) {
      return NextResponse.json(
        { error: "Motorcycle not found" },
        { status: 404 }
      );
    }

    if (motorcycle.user_id !== user.id) {
      return NextResponse.json(
        { error: "You can only manage bids for your own motorcycles" },
        { status: 403 }
      );
    }

    // If accepting a bid, first reject all other bids for the same motorcycle
    if (status === "accepted") {
      // Reject all other pending bids for this motorcycle
      const { error: rejectOthersError } = await supabase
        .from("bids")
        .update({ status: "rejected" })
        .eq("motorcycle_id", bid.motorcycle_id)
        .eq("status", "pending")
        .neq("id", bidId);

      if (rejectOthersError) {
        console.error("Error rejecting other bids:", rejectOthersError);
        return NextResponse.json(
          { error: "Failed to process bid acceptance" },
          { status: 500 }
        );
      }
    }

    // Update the bid status
    const { data: updatedBid, error: updateError } = await supabase
      .from("bids")
      .update({ status })
      .eq("id", bidId)
      .select()
      .single();

    if (updateError) {
      console.error("Supabase error:", updateError);
      return NextResponse.json(
        { error: "Failed to update bid status" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: `Bid ${status} successfully`,
        bid: updatedBid,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating bid status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
