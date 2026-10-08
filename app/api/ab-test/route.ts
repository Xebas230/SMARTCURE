import { NextResponse } from "next/server";
import { getDefaultCampaigns, PERSONA_DEFINITIONS } from "@/lib/segmentation";
import { generateABVariantCopy } from "@/lib/bedrock";
import type { PersonaId } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const { personaId } = (await req.json().catch(() => ({}))) as {
      personaId?: PersonaId;
    };

    const campaigns = getDefaultCampaigns();

    if (personaId && campaigns[personaId]) {
      const camp = campaigns[personaId];
      const def = PERSONA_DEFINITIONS[personaId];

      // Generar copy variante A
      const resA = await generateABVariantCopy(
        def.titulo,
        "A",
        camp.varianteA.enfoque,
        camp.varianteA.beneficio
      );
      camp.varianteA.copyWhatsapp = resA.copyWhatsapp;
      camp.varianteA.copyCajero = resA.copyCajero;
      camp.varianteA.fuenteCopy = resA.fuente;

      // Generar copy variante B
      const resB = await generateABVariantCopy(
        def.titulo,
        "B",
        camp.varianteB.enfoque,
        camp.varianteB.beneficio
      );
      camp.varianteB.copyWhatsapp = resB.copyWhatsapp;
      camp.varianteB.copyCajero = resB.copyCajero;
      camp.varianteB.fuenteCopy = resB.fuente;

      return NextResponse.json({
        success: true,
        campaign: camp,
        campaigns,
      });
    }

    // Si no se especifica personaId, generar para el primer segmento o retornar todos
    return NextResponse.json({
      success: true,
      campaigns,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Error al generar A/B testing con Bedrock", details: String(err) },
      { status: 500 }
    );
  }
}
