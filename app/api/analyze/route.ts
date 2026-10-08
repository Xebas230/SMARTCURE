import { NextResponse } from "next/server";
import { findClientByCedula } from "@/lib/data";
import { inferFamily } from "@/lib/basket";
import { detectShock } from "@/lib/shock";

export async function POST(req: Request) {
  const { cedula } = await req.json();
  const client = findClientByCedula(String(cedula ?? ""));
  if (!client) {
    return NextResponse.json({ error: "cliente_no_encontrado" }, { status: 404 });
  }
  const familia = inferFamily(client.id);
  const shock = detectShock(client.id);
  return NextResponse.json({
    cliente: { nombre: client.nombre, cedula: client.cedula, smartclub: client.smartclub, cashback: client.cashback },
    familia,
    shock,
    real: { analisis: true, datos: "sintéticos" },
  });
}
