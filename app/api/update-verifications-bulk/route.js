import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // لازم تستخدم مفتاح سيرفر عندك صلاحيات كتابة
);

export async function POST(request) {
  try {
    const { updates } = await request.json();

    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json(
        { success: false, message: "No updates provided" },
        { status: 400 }
      );
    }

    for (const update of updates) {
      const { id, is_verified, verified_by } = update;

      const { error } = await supabase
        .from("registrations") // تأكد من اسم الجدول
        .update({ is_verified, verified_by })
        .eq("id", id);

      if (error) {
        console.error(`Error updating id ${id}:`, error);
        return NextResponse.json(
          { success: false, message: `Failed to update id ${id}` },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
