import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const { updates } = await request.json();

    if (!updates || !Array.isArray(updates)) {
      return NextResponse.json({ success: false, error: "Invalid updates data" }, { status: 400 });
    }

    for (const update of updates) {
      const { id, is_verified, verified_by } = update;

      const { error } = await supabase
        .from("registrations")
        .update({ is_verified, verified_by })
        .eq("id", id);

      if (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}
