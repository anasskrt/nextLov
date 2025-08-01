import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const backendRes = await fetch(`${process.env.BACKEND_URL}/service`);
  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const authHeader = req.headers.get("authorization");
  const backendRes = await fetch(`${process.env.BACKEND_URL}/service`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(authHeader ? { Authorization: authHeader } : {}),
    },
    body: JSON.stringify(body),
  });
  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}
