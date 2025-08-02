import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // لازم تكون service_role مش anon key
);

export async function POST(req) {
  try {
    const { id, verified_by, is_verified } = await req.json();

    const { error } = await supabase
      .from("registrations")
      .update({
        verified_by: verified_by,
        is_verified: is_verified,
      })
      .eq("id", id);

    if (error) {
      console.error(error);
      return NextResponse.json({ success: false, error: error.message });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Server Error" });
  }
}
