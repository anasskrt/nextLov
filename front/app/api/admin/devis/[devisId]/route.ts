import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { devisId: string } }) {
  const authHeader = req.headers.get("authorization");
  const { devisId } = params;
  const backendRes = await fetch(`${process.env.BACKEND_URL}/vol/${devisId}`, {
    headers: authHeader ? { Authorization: authHeader } : undefined,
  });
  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}

export async function POST(req: NextRequest, context: { params: { devisId: string } }) {

  const { params } = context;
  const devisId = params?.devisId;


  const authHeader = req.headers.get("authorization");
  const body = await req.json();
  const backendRes = await fetch(`${process.env.BACKEND_URL}/vol/${devisId}`, {
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
