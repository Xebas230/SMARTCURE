import { NextResponse } from "next/server";
import { evaluateCampaignFeedback } from "@/lib/feedback";
import type { PersonaId } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const { personaId, variantId } = (await req.json().catch(() => ({}))) as {
      personaId?: PersonaId;
      variantId?: "A" | "B";
    };

    const targetPersona: PersonaId = personaId ?? "cronico";
    const report = await evaluateCampaignFeedback(targetPersona, variantId);

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al generar la retroalimentación de marketing", details: String(error) },
      { status: 500 }
    );
  }
}
