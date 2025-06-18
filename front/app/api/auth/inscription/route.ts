import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const backendUrl = process.env.BACKEND_URL as string;
  console.log("Proxy API: tente de joindre", `${backendUrl}/auth/inscription`);

  try {
    const backendRes = await fetch(`${backendUrl}/auth/inscription`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    let data;
    try {
      data = await backendRes.json();
    } catch {
      data = { message: "Erreur serveur backend (JSON)" };
    }

    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error("Proxy API: fetch failed", error);
    return NextResponse.json({ message: "Proxy API: fetch failed" }, { status: 502 });
  }
}
