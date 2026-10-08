import { promos } from "@/lib/data";
import type { Oferta, Shock } from "@/lib/types";

export const PALABRAS_PROHIBIDAS = [
  "losartan",
  "metformina",
  "levotiroxina",
  "paracetamol",
  "ibuprofeno",
  "antigripal",
  "insulina",
  "amoxicilina",
  "medicamento",
  "medicina",
  "enfermedad",
  "enfermo",
  "diabetes",
  "presión",
];

export const PROTEGIDOS_MSG =
  "Medicamentos crónicos: precio y disponibilidad garantizados.";

const RAZONES: Record<string, string> = {
  "P-011":
    "Su gasto en alimento del hogar subió este mes; el 2x1 protege el siguiente ciclo.",
  "P-012":
    "Optó por una alternativa más económica en cuidado personal; le devolvemos su rutina preferida.",
  "P-013":
    "Su cobertura no alcanzó este mes; un cupón en el hogar sin presionar el bolsillo.",
  "P-015":
    "Refuerzo por ser socia SmartClub; canjeable en aliados del ecosistema, incluido BYD.",
};

function promoToOferta(id: string): Oferta {
  const p = promos[id];
  return {
    id,
    marca: p.marca,
    categoria: p.categoria,
    tipo: p.tipo,
    valor: p.valor,
    razon: RAZONES[id] ?? "Beneficio personalizado para su momento actual.",
    cronico: false,
  };
}

export function selectOffersByRules(shock: Shock): Oferta[] {
  if (!shock.activo) return [];

  const ofertas: Oferta[] = [];

  const tieneMascota = shock.contribuyentes.some((c) => c.categoria === "mascota");
  if (tieneMascota) ofertas.push(promoToOferta("P-011"));

  if (shock.trade_down) ofertas.push(promoToOferta("P-012"));

  if (shock.gap_cobertura) ofertas.push(promoToOferta("P-013"));

  if (!shock.trade_down && !shock.gap_cobertura) {
    ofertas.push(promoToOferta("P-013"));
  }

  ofertas.push(promoToOferta("P-015"));

  return ofertas.slice(0, 4);
}

export interface ParsedBedrock {
  copy_whatsapp?: string;
  copy_cajero?: string;
}

function limpiar(s: string): string {
  return s
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}\u{2300}-\u{23FF}\u{1F900}-\u{1F9FF}]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function validateBedrockOutput(raw: string): ParsedBedrock | null {
  try {
    let s = raw.trim();
    s = s.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
    const json = JSON.parse(s) as ParsedBedrock;
    const wa = limpiar((json.copy_whatsapp ?? "").toString());
    const caj = limpiar((json.copy_cajero ?? "").toString());
    if (!wa || !caj) return null;
    const lower = `${wa} ${caj}`.toLowerCase();
    for (const w of PALABRAS_PROHIBIDAS) {
      if (lower.includes(w)) return null;
    }
    return { copy_whatsapp: wa, copy_cajero: caj };
  } catch {
    return null;
  }
}

export function fallbackCopy(
  cedula: string,
  nombre: string,
  shock: Shock,
  ofertas: Oferta[]
): ParsedBedrock {
  const lista = ofertas
    .filter((o) => o.id !== "P-015")
    .map((o) =>
      o.tipo === "2x1"
        ? `2x1 en ${o.marca}`
        : o.tipo === "cupon"
        ? `cupón en ${o.marca}`
        : `15% en ${o.marca}`
    )
    .join(", ");
  const pct = Math.round(shock.delta_pct);
  return {
    copy_whatsapp: `Hola ${nombre.split(" ")[0]}. Este mes tu gasto en esenciales subió ${pct}% sobre tu promedio. Activamos tu beneficio exclusivo del mes: ${lista} y cashback extra. Lo que siempre compras para tu familia no cambia. — SmartCure`,
    copy_cajero: `Beneficio activo: ${lista} · cashback +5%. Regla: NO ofrecer descuento en medicamentos crónicos.`,
  };
}
