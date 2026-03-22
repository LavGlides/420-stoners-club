import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("banner_settings")
      .select("*")
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "not found"
      throw error;
    }

    // Return defaults if no settings exist
    const settings = data || {
      heading: "Elevated. Always.",
      subtitle:
        "Premium streetwear for the culture. Limited runs, no restocks.",
      image_url: "/hero.jpg",
      enabled: true,
    };

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching banner settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch banner settings" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const { data, error } = await supabase
      .from("banner_settings")
      .upsert({
        id: 1, // Single row
        heading: body.heading,
        subtitle: body.subtitle,
        image_url: body.image_url,
        enabled: body.enabled ?? true,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating banner settings:", error);
    return NextResponse.json(
      { error: "Failed to update banner settings" },
      { status: 500 },
    );
  }
}
