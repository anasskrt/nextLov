import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/booking/abandonments
 * Enregistre un abandon de réservation (accessible publiquement)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch(
      `${process.env.BACKEND_URL}/booking/abandonments`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
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
    console.error("Erreur lors de l'enregistrement de l'abandon:", error);
    return NextResponse.json(
      { error: "Erreur serveur interne" },
      { status: 500 }
    );
  }
}
