import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// استقبل POST بدلاً من DELETE لتتوافق مع الكود في الواجهة
export async function POST(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
    }

    const { error } = await supabase.from("registrations").delete().eq("id", id);

    if (error) {
      console.error(error);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}
