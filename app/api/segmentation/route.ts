import { NextResponse } from "next/server";
import { segmentClients, getDefaultCampaigns } from "@/lib/segmentation";
import type { Client, Tx } from "@/lib/types";

export async function GET() {
  const result = segmentClients();
  const campaigns = getDefaultCampaigns();
  return NextResponse.json({
    ...result,
    campaigns,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const customClients = body.clients as Client[] | undefined;
    const customTxs = body.txs as Tx[] | undefined;

    const result = segmentClients(customClients, customTxs);
    const campaigns = getDefaultCampaigns();

    return NextResponse.json({
      ...result,
      campaigns,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al procesar la segmentación", details: String(error) },
      { status: 500 }
    );
  }
}
