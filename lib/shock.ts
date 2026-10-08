import { products, txsOfClient } from "@/lib/data";
import type { Contributor, Shock, Tx } from "@/lib/types";

const BASELINE_MONTHS = ["2026-05", "2026-06", "2026-07", "2026-08", "2026-09"];
const CURRENT_MONTH = "2026-10";
const UMBRAL_SHOCK = 25;

const GRUPOS: Record<string, string[]> = {
  esenciales: ["salud_otc", "vitaminas", "adulto_mayor", "cronico"],
  mascota: ["alimento_mascota", "cuidado_mascota", "servicio_mascota"],
};

export function detectShock(clientId: string): Shock {
  const txs = txsOfClient(clientId);
  const internas = txs.filter((t) => !t.fuente_externa);

  const totalPorMes: Record<string, number> = {};
  const grupoPorMes: Record<string, Record<string, number>> = {
    esenciales: {},
    mascota: {},
  };

  for (const t of internas) {
    const mes = t.fecha.slice(0, 7);
    totalPorMes[mes] = (totalPorMes[mes] ?? 0) + t.monto;
    const prod = products[t.sku];
    if (!prod) continue;
    for (const [grupo, cats] of Object.entries(GRUPOS)) {
      if (cats.includes(prod.categoria)) {
        grupoPorMes[grupo][mes] = (grupoPorMes[grupo][mes] ?? 0) + t.monto;
      }
    }
  }

  const baseline =
    BASELINE_MONTHS.reduce((acc, m) => acc + (totalPorMes[m] ?? 0), 0) /
    BASELINE_MONTHS.length;
  const mesActual = totalPorMes[CURRENT_MONTH] ?? 0;
  const deltaPct =
    baseline > 0 ? Math.round(((mesActual - baseline) / baseline) * 1000) / 10 : 0;

  const contribuyentes: Contributor[] = [];
  const labels: Record<string, string> = {
    esenciales: "esenciales",
    mascota: "mascota",
  };
  for (const grupo of Object.keys(GRUPOS)) {
    const usual =
      BASELINE_MONTHS.reduce(
        (acc, m) => acc + (grupoPorMes[grupo][m] ?? 0),
        0
      ) / BASELINE_MONTHS.length;
    const actual = grupoPorMes[grupo][CURRENT_MONTH] ?? 0;
    const delta = Math.round(actual - usual);
    if (delta >= 10) {
      contribuyentes.push({
        categoria: grupo,
        label_ui: labels[grupo],
        usual: Math.round(usual),
        actual: Math.round(actual),
        delta,
      });
    }
  }
  contribuyentes.sort((a, b) => b.delta - a.delta);

  const txsBaseline = internas.filter((t) =>
    BASELINE_MONTHS.includes(t.fecha.slice(0, 7))
  );
  const txsActual = internas.filter((t) => t.fecha.startsWith(CURRENT_MONTH));

  const tradeDown =
    txsBaseline.some((t) => t.sku === "CREMA-HIDRATANTE") &&
    txsActual.some((t) => t.sku === "HIDRATANTE-GENERICA");

  const noCubiertos = txsActual.filter(
    (t) => products[t.sku]?.fuera_catalogo_seguro
  );
  const gap =
    noCubiertos.length > 0
      ? {
          count: noCubiertos.length,
          monto: Math.round(noCubiertos.reduce((a, t) => a + t.monto, 0)),
        }
      : null;

  const byd = txs.find((t) => t.fuente_externa);
  const gastoExterno = byd
    ? { monto: byd.monto, detalle: "Mantenimiento preventivo BYD Yuan Pro" }
    : null;

  return {
    activo: deltaPct >= UMBRAL_SHOCK,
    baseline: Math.round(baseline),
    mes_actual: mesActual,
    delta_pct: deltaPct,
    contribuyentes,
    trade_down: tradeDown,
    gap_cobertura: gap,
    gasto_externo_byd: gastoExterno,
  };
}
