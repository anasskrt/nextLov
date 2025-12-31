import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

/**
 * GET /api/admin/booking-abandonments
 * Récupère la liste des abandons de réservation
 */
export async function GET(req: NextRequest) {
  try {
    // Vérification admin
    const authHeader = req.headers.get("authorization");
    const user = verifyAdminToken(authHeader || "");

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const search = searchParams.get("search") || "";

    // Appel au backend
    const params = new URLSearchParams({
      page,
      limit,
      search,
    });

    const response = await fetch(
      `${BACKEND_URL}/booking/abandonments?${params.toString()}`,
      {
        headers: authHeader ? { Authorization: authHeader } : {},
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
    
    // Le backend retourne un tableau, on le transforme pour le frontend
    const abandonments = Array.isArray(data) ? data.map((item: any) => {
      // Parser selectedServices si c'est une string JSON
      let selectedServices = item.selectedServices;
      if (typeof selectedServices === 'string') {
        try {
          selectedServices = JSON.parse(selectedServices);
        } catch {
          selectedServices = [];
        }
      }
      
      return {
        ...item,
        selectedServices: Array.isArray(selectedServices) ? selectedServices : [],
      };
    }) : [];
    
    return NextResponse.json({
      abandonments,
      total: abandonments.length,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des abandons:", error);
    return NextResponse.json(
      { error: "Erreur serveur interne" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/booking-abandonments/:id
 * Supprime un abandon de réservation (après relance)
 */
export async function DELETE(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const user = verifyAdminToken(authHeader || "");

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID manquant" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${BACKEND_URL}/booking/abandonments/${id}`,
      {
        method: "DELETE",
        headers: authHeader ? { Authorization: authHeader } : {},
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
    console.error("Erreur lors de la suppression de l'abandon:", error);
    return NextResponse.json(
      { error: "Erreur serveur interne" },
      { status: 500 }
    );
  }
}
