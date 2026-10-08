import { NextResponse } from "next/server";
import { findClientByCedula, promos } from "@/lib/data";

export async function POST(req: Request) {
  const { cedula, oferta_id } = await req.json();
  const client = findClientByCedula(String(cedula ?? ""));
  if (!client) {
    return NextResponse.json({ error: "cliente_no_encontrado" }, { status: 404 });
  }
  const promo = promos[String(oferta_id ?? "")];
  const marca = promo?.marca ?? "SmartClub";
  return NextResponse.json({
    cedula: client.cedula,
    marca,
    monto: 25,
    cashback_sumado: 1.25,
    estado: "venta_cerrada",
  });
}
