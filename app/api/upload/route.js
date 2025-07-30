import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const fileName = `${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("uploads")
    .upload(fileName, file, { cacheControl: "3600", upsert: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(fileName);

  return NextResponse.json({ url: urlData.publicUrl });
}
