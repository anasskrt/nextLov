import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const rawBody = await req.text(); // important : ne pas parser automatiquement
  const sig = req.headers.get("stripe-signature");
  
  try {
    const backendRes = await fetch(`${process.env.BACKEND_URL}/webhooks/stripe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // ou "application/json+stripe-signature" si tu préfères
        "stripe-signature": sig || "",
      },
      body: rawBody,
    });

    const responseBody = await backendRes.json();
    return NextResponse.json(responseBody, { status: backendRes.status });

  } catch (error) {
    console.error("Erreur de proxy webhook Stripe → backend :", error);
    return NextResponse.json({ error: "Erreur webhook" }, { status: 500 });
  }
}
