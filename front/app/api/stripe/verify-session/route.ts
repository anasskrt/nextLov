import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const backendRes = await fetch(`${process.env.BACKEND_URL}/stripe/verify-session?${req.url.split('?')[1] || ''}`);
  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}
