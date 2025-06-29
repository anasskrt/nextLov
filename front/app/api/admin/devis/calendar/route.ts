import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();
  const body = await req.json();
  const authHeader = req.headers.get("authorization");
    console.log(authHeader)
  const backendRes = await fetch(`${process.env.BACKEND_URL}/devis/${id}/status`, {
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