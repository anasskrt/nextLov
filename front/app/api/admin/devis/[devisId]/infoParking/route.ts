import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

/**
 * POST /api/admin/devis/:devisId/infoParking
 * Enregistre les informations de parking pour un devis
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ devisId: string }> }
) {
  try {
    const { devisId } = await params;
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { error: "Non autorisé - Token manquant" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { infoParking } = body;

    if (typeof infoParking !== "string") {
      return NextResponse.json(
        { error: "Le champ infoParking est requis" },
        { status: 400 }
      );
    }

    // Appel au backend pour enregistrer les infos parking
    const response = await fetch(
      `${BACKEND_URL}/devis/${devisId}/infoParking`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ infoParking }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || "Erreur backend" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erreur lors de l'enregistrement des infos parking:", error);
    return NextResponse.json(
      { error: "Erreur serveur interne" },
      { status: 500 }
    );
  }
}
