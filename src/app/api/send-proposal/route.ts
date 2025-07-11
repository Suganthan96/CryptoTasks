import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { from, to, text } = await req.json();
    if (!from || !to || !text) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }
    // Load Supabase URL and anon key from environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Supabase credentials not set." }, { status: 500 });
    }
    const res = await fetch(`${supabaseUrl}/rest/v1/messages`, {
      method: "POST",
      headers: {
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation"
      },
      body: JSON.stringify({ from, to, text })
    });
    if (!res.ok) {
      const error = await res.text();
      return NextResponse.json({ error }, { status: 500 });
    }
    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
} 