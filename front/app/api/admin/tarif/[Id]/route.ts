import { verifyAdminToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  // ✅ Vérification admin
  const authHeader = req.headers.get("authorization");
  const user = verifyAdminToken(authHeader || '');
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized - Admin access required' },
      { status: 401 }
    );
  }

  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();
  const body = await req.json();
  
  const backendRes = await fetch(`${process.env.BACKEND_URL}/tarif/${id}`, {
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