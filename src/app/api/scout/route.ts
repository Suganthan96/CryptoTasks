import { NextRequest, NextResponse } from "next/server";
import { freelancers } from "../../freelancers/data";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
   
    const res = await fetch("http://localhost:8000/scout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, freelancers }),
    });
    if (!res.ok) throw new Error("Agentic server error");
    const data = await res.json();
    return NextResponse.json({ agentMessage: data.agentMessage });
  } catch {
    return NextResponse.json({ agentMessage: "Sorry, I couldn't process your request right now. Please try again later." }, { status: 200 });
  }
}

export async function GET() {
  return NextResponse.json({ agentMessage: "Hi! I'm Scout, your AI assistant. Ask me to find the best freelancers for your needs!" });
} 