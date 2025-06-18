import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const backendUrl = process.env.BACKEND_URL as string;

  let backendRes;
  let data;

  console.log("Proxy API: tente de joindre", `${backendUrl}/auth/inscription`);

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
  } catch (error: unknown) {
        console.error("Erreur fetch backend :", error);
        let message = "Erreur proxy API Next.js";

        if (error instanceof Error) {
            message += " : " + error.message;
        }

        return NextResponse.json(
            { message },
            { status: 502 }
        );
    }
}
