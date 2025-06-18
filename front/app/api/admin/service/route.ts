import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const backendRes = await fetch(`${process.env.BACKEND_URL}/service`);
  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}

export async function GET_USERS() {
  const backendRes = await fetch(`${process.env.BACKEND_URL}/user`);
  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}

export async function PATCH(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();
  const body = await req.json();
  const backendRes = await fetch(`${process.env.BACKEND_URL}/service/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const backendRes = await fetch(`${process.env.BACKEND_URL}/service`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}
