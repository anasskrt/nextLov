import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const backendRes = await fetch(`${process.env.BACKEND_URL}/stripe/verify-session?${req.url.split('?')[1] || ''}`, {
    headers: authHeader ? { Authorization: authHeader } : undefined,
  });
  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}
