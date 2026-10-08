import { NextResponse } from "next/server";
import { PERSONA_DEFINITIONS } from "@/lib/segmentation";
import type { PersonaId } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const { campaignId, personaId, variantId, totalClientes } =
      (await req.json().catch(() => ({}))) as {
        campaignId: string;
        personaId: PersonaId;
        variantId: "A" | "B";
        totalClientes?: number;
      };

    const def = PERSONA_DEFINITIONS[personaId] ?? {
      titulo: "Segmento SmartClub",
      reglaMargen: "Margen protegido",
    };

    const clientesAlcanzados = totalClientes ?? 25;
    // Regla de oro: Máximo 2 notificaciones al mes por cliente
    const impactosConsumidosEsteMes = 1;
    const impactosDisponiblesRestantes = 1;

    return NextResponse.json({
      success: true,
      desplegada: true,
      campaignId,
      personaId,
      variantId,
      segmentoTitulo: def.titulo,
      clientesAlcanzados,
      canalesActivados: [
        "WhatsApp Business API (Simulado)",
        "Pantalla POS Farmaenlace / Cajero (Simulado)",
        "SmartClub App Notificaciones Push (Simulado)",
      ],
      reglaOro: {
        maxImpactosMes: 2,
        impactosUsados: impactosConsumidosEsteMes,
        impactosRestantes: impactosDisponiblesRestantes,
        spamScore: "0% (Bajo límite estricto de saturación)",
      },
      politicaMargen: def.reglaMargen,
      mensaje: `Campaña ${campaignId} desplegada con éxito al 100% del segmento "${def.titulo}".`,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Error al desplegar la campaña", details: String(err) },
      { status: 500 }
    );
  }
}
