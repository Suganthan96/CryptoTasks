import { NextRequest, NextResponse } from "next/server";
import { freelancers } from "../../freelancers/page";

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
    // No prompt, return top 3 by rating
    return (freelancers as Freelancer[])
      .slice()
      .sort((a, b) => b.stars - a.stars || b.perfection - a.perfection)
      .slice(0, 3)
      .map(({ name, role, stars, perfection }) => ({ name, role, stars, perfection }));
  }
  const promptTokens = tokenize(prompt);
  // Score freelancers by token match in role or desc (partial and full word)
  const scored = (freelancers as Freelancer[]).map(f => {
    let score = 0;
    const roleTokens = tokenize(f.role);
    const descTokens = tokenize(f.desc);
    for (const pToken of promptTokens) {
      // Partial and full word match in role
      if (roleTokens.some(rt => rt.includes(pToken))) score += 3;
      // Partial and full word match in desc
      if (descTokens.some(dt => dt.includes(pToken))) score += 1;
    }
    return { ...f, score };
  });
  // Filter those with score > 0, or fallback to all
  const filtered = scored.filter(f => f.score > 0);
  const toSort = filtered.length > 0 ? filtered : scored;
  // Sort by score, then stars, then perfection
  return toSort
    .slice()
    .sort((a, b) => b.score - a.score || b.stars - a.stars || b.perfection - a.perfection)
    .slice(0, 3)
    .map(({ name, role, stars, perfection }) => ({ name, role, stars, perfection }));
}

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const topFreelancers = matchFreelancers(prompt);
    return NextResponse.json({ topFreelancers });
  } catch (err) {
    // fallback: top 3 by rating
    const topFreelancers = (freelancers as Freelancer[])
      .slice()
      .sort((a, b) => b.stars - a.stars || b.perfection - a.perfection)
      .slice(0, 3)
      .map(({ name, role, stars, perfection }) => ({ name, role, stars, perfection }));
    return NextResponse.json({ topFreelancers, error: (err as Error).message }, { status: 200 });
  }
}

export async function GET(req: NextRequest) {
  // For backward compatibility, just return top 3 by rating
  const topFreelancers = (freelancers as Freelancer[])
    .slice()
    .sort((a, b) => b.stars - a.stars || b.perfection - a.perfection)
    .slice(0, 3)
    .map(({ name, role, stars, perfection }) => ({ name, role, stars, perfection }));
  return NextResponse.json({ topFreelancers });
} 