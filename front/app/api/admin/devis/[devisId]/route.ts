import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ devisId: string }> }
) {
  // ✅ Vérification admin (double protection avec middleware)
  const authHeader = req.headers.get("authorization");
  const user = verifyAdminToken(authHeader || '');
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized - Admin access required' },
      { status: 403 }
    );
  }

  const { devisId } = await params;

  const backendRes = await fetch(`${process.env.BACKEND_URL}/devis/${devisId}`, {
    headers: authHeader ? { Authorization: authHeader } : undefined,
  });

  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ devisId: string }> }
) {
  // ✅ Vérification admin (double protection avec middleware)
  const authHeader = req.headers.get("authorization");
  const user = verifyAdminToken(authHeader || '');
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized - Admin access required' },
      { status: 403 }
    );
  }

  const { devisId } = await params;
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ devisId: string }> }
) {
  // ✅ Vérification admin (double protection avec middleware)
  const authHeader = req.headers.get("authorization");
  const user = verifyAdminToken(authHeader || '');
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized - Admin access required' },
      { status: 403 }
    );
  }

  const { devisId } = await params;
  const body = await req.json();

  // Appel au backend pour mettre à jour le statut du devis
  const backendRes = await fetch(`${process.env.BACKEND_URL}/devis/${devisId}/status`, {
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
