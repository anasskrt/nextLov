import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth";

// @ts-expect-error: context must remain untyped for Next.js compatibility
export async function POST(req: NextRequest, context) {
  // ✅ Vérification admin (double protection avec middleware)
  const authHeader = req.headers.get("authorization");
  const user = verifyAdminToken(authHeader || '');
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized - Admin access required' },
      { status: 403 }
    );
  }

  const devisId = context?.params?.devisId;

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
