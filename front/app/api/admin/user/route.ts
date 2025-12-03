import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  
  // ✅ Vérifier que l'utilisateur est admin
  const user = verifyAdminToken(authHeader || '');
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized - Admin access required' },
      { status: 403 }
    );
  }
  
  // ✅ Utilisateur vérifié, continuer la requête
  const backendRes = await fetch(`${process.env.BACKEND_URL}/user`, {
    headers: authHeader ? { Authorization: authHeader } : undefined,
  });
  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}
