import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      full_name,
      email,
      phone,
      institution,
      ieee_number,
      membership_status,
      ticket_type,
      track,
      dietary,
      hear_about,
      bank_name,
      account_name,
      payment_proof,
    } = body;

    const { error } = await supabase.from("registrations").insert([
      {
        full_name,
        email,
        phone,
        institution,
        ieee_number,
        membership_status,
        ticket_type,
        track,
        dietary,
        hear_about,
        bank_name,
        account_name,
        payment_proof,
      },
    ]);

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
