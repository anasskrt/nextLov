import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const backendUrl = process.env.BACKEND_URL as string;

  let backendRes;
  let data;

  try {
    backendRes = await fetch(`${backendUrl}/auth/inscription`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    try {
      data = await backendRes.json();
    } catch {
      data = { message: "Erreur serveur backend (JSON)" };
    }

    return NextResponse.json(data, { status: backendRes.status });
  } catch (error: any) {
    // Log l'erreur côté serveur pour la voir dans les logs Render
    console.error("Erreur fetch backend :", error);
    return NextResponse.json(
      { message: "Erreur proxy API Next.js : " + error.message },
      { status: 502 }
    );
  }
}
