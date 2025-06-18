import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const backendUrl = process.env.BACKEND_URL as string; // Bonne pratique : typage explicite

  const backendRes = await fetch(`${backendUrl}/auth/inscription`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  // Optionnel : gestion d'une réponse non JSON
  let data;
  try {
    data = await backendRes.json();
  } catch {
    data = { message: "Erreur serveur backend" };
  }

  return NextResponse.json(data, { status: backendRes.status });
}
