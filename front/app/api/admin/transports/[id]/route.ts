import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const authHeader = req.headers.get("authorization");

  // Récupération de l'ID depuis l'URL
  const urlParts = req.nextUrl.pathname.split("/");
  const id = urlParts[urlParts.length - 1];

  const backendRes = await fetch(`${process.env.BACKEND_URL}/transport/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(authHeader ? { Authorization: authHeader } : {}),
    },
    body: JSON.stringify(body),
  });

  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}
