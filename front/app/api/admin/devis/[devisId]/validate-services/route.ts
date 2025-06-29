import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, context: { params: { devisId: string } }) {
  const { devisId } = context.params;
  const authHeader = req.headers.get("authorization");

  const backendRes = await fetch(`${process.env.BACKEND_URL}/admin/devis/${devisId}/validate-services`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(authHeader ? { Authorization: authHeader } : {}),
    }
  });

  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}
