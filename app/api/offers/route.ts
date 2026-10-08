import { NextResponse } from "next/server";
import { findClientByCedula } from "@/lib/data";
import { inferFamily } from "@/lib/basket";
import { detectShock } from "@/lib/shock";
import { PROTEGIDOS_MSG, selectOffersByRules } from "@/lib/rules";
import { getCopy } from "@/lib/bedrock";

export async function POST(req: Request) {
  const { cedula } = await req.json();
  const client = findClientByCedula(String(cedula ?? ""));
  if (!client) {
    return NextResponse.json({ error: "cliente_no_encontrado" }, { status: 404 });
  }

  const familia = inferFamily(client.id);
  const shock = detectShock(client.id);
  const ofertas = selectOffersByRules(shock);
  const { texto, fuente } = await getCopy(client.cedula, client.nombre, shock, ofertas);

  return NextResponse.json({
    cedula: client.cedula,
    nombre: client.nombre,
    smartclub: client.smartclub,
    cashback: client.cashback,
    familia,
    shock,
    ofertas,
    protegidos: PROTEGIDOS_MSG,
    copy_whatsapp: texto.copy_whatsapp,
    copy_cajero: texto.copy_cajero,
    fuente,
  });
}
