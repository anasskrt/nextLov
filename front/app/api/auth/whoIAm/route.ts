import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const backendRes = await fetch(`${process.env.BACKEND_URL}/auth/whoIAm`, {
    credentials: 'include',
    headers: authHeader ? { Authorization: authHeader } : undefined,
  });
  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}
