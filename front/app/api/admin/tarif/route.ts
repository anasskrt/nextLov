import { verifyAdminToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // ✅ Vérification admin
  const authHeader = req.headers.get("authorization");
  console.log("Auth Header:", authHeader);
  const user = verifyAdminToken(authHeader || '');
  console.log("Verified User:", user);
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized - Admin access required' },
      { status: 401 }
    );
  }

  const body = await req.json();
  
  const backendRes = await fetch(`${process.env.BACKEND_URL}/tarif/create`, {
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
