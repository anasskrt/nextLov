import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth";

export async function PUT(req: NextRequest) {
  // ✅ Vérification admin (double protection avec middleware)
  const authHeader = req.headers.get("authorization");
  const user = verifyAdminToken(authHeader || '');
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized - Admin access required' },
      { status: 403 }
    );
  }

  const body = await req.json();

  // Récupération de l'ID depuis l'URL
  const urlParts = req.nextUrl.pathname.split("/");
  const id = urlParts[urlParts.length - 1];

  const backendRes = await fetch(`${process.env.BACKEND_URL}/transport/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(authHeader ? { Authorization: authHeader } : {}),
    },
    body: JSON.stringify(body),
  });

  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}
