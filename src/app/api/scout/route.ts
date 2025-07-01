import { NextRequest, NextResponse } from "next/server";
import { freelancers } from "../../freelancers/data";

type Freelancer = {
  name: string;
  role: string;
  desc: string;
  projects: number;
  stars: number;
  perfection: number;
};

function tokenize(text: string) {
  return text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
}

function matchFreelancers(prompt: string): Pick<Freelancer, "name" | "role" | "stars" | "perfection">[] {
  if (!prompt) {
  
    return (freelancers as Freelancer[])
      .slice()
      .sort((a, b) => b.stars - a.stars || b.perfection - a.perfection)
      .slice(0, 3)
      .map(({ name, role, stars, perfection }) => ({ name, role, stars, perfection }));
  }
  const promptTokens = tokenize(prompt);
  
  const scored = (freelancers as Freelancer[]).map(f => {
    let score = 0;
    const roleTokens = tokenize(f.role);
    const descTokens = tokenize(f.desc);
    for (const pToken of promptTokens) {
    
      if (roleTokens.some(rt => rt.includes(pToken))) score += 3;
      
      if (descTokens.some(dt => dt.includes(pToken))) score += 1;
    }
    return { ...f, score };
  });
 
  const filtered = scored.filter(f => f.score > 0);
  const toSort = filtered.length > 0 ? filtered : scored;
 
  return toSort
    .slice()
    .sort((a, b) => b.score - a.score || b.stars - a.stars || b.perfection - a.perfection)
    .slice(0, 3)
    .map(({ name, role, stars, perfection }) => ({ name, role, stars, perfection }));
}

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
  } catch (err) {
    return NextResponse.json({ agentMessage: "Sorry, I couldn't process your request right now. Please try again later." }, { status: 200 });
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ agentMessage: "Hi! I'm Scout, your AI assistant. Ask me to find the best freelancers for your needs!" });
} 