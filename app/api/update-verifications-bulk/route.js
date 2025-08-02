import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const { id, is_verified, verified_by } = await request.json();

    const { error } = await supabase
      .from("registrations")
      .update({ is_verified, verified_by })
      .eq("id", id);

    if (error) {
      console.error("Update error:", error);
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
