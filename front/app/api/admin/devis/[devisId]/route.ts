import { NextRequest, NextResponse } from "next/server";
// @ts-expect-error: context must remain untyped for Next.js compatibility
export async function GET(req: NextRequest, context) {
  const devisId = context?.params?.devisId;

  const authHeader = req.headers.get("authorization");

  const backendRes = await fetch(`${process.env.BACKEND_URL}/vol/${devisId}`, {
    headers: authHeader ? { Authorization: authHeader } : undefined,
  });

  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}
// @ts-expect-error: context must remain untyped for Next.js compatibility
export async function POST(req: NextRequest, context) {
  const devisId = context?.params?.devisId;

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
