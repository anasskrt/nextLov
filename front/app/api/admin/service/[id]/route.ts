import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  console.log('test')

  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();
  const authHeader = req.headers.get("authorization");

  if (!id) {
    return NextResponse.json({ error: "ID manquant dans l'URL" }, { status: 400 });
  }

  try {
    const backendRes = await fetch(`${process.env.BACKEND_URL}/service/${id}`, {
      method: "DELETE",
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error("Erreur DELETE /api/service", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();
  const body = await req.json();
  const authHeader = req.headers.get("authorization");
  const backendRes = await fetch(`${process.env.BACKEND_URL}/service/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(authHeader ? { Authorization: authHeader } : {}),
    },
    body: JSON.stringify(body),
  });
  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}