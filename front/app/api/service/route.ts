import { NextResponse } from "next/server";

export async function GET() {
  const backendRes = await fetch(`${process.env.BACKEND_URL}/service`);
  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}
