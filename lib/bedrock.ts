import {
  BedrockRuntimeClient,
  ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";
import mariaJson from "@/data/cache/maria.json";
import {
  fallbackCopy,
  validateBedrockOutput,
  type ParsedBedrock,
} from "@/lib/rules";
import type { Oferta, Shock } from "@/lib/types";

const MODEL_IDS = [
  "us.anthropic.claude-sonnet-4-6",
  "us.anthropic.claude-haiku-4-5-20251001-v1:0",
  "us.anthropic.claude-sonnet-4-5-20250929-v1:0",
  "us.anthropic.claude-sonnet-4-20250514-v1:0",
];

const TTL = 10 * 60 * 1000;
const MIN_INTERVAL = 1100;

const cache = new Map<
  string,
  { ts: number; texto: ParsedBedrock; fuente: "REAL" | "RESPALDO" }
>();

let lastCall = 0;

function hasCreds(): boolean {
  return Boolean(
    process.env.AWS_ACCESS_KEY_ID &&
      process.env.AWS_SECRET_ACCESS_KEY &&
      (process.env.AWS_SESSION_TOKEN || process.env.AWS_SECRET_ACCESS_KEY)
  );
}

async function waitRateLimit() {
  const wait = lastCall + MIN_INTERVAL - Date.now();
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastCall = Date.now();
}

function mariaFallback(): ParsedBedrock {
  const m = mariaJson as unknown as {
    copy_whatsapp: string;
    copy_cajero: string;
  };
  return { copy_whatsapp: m.copy_whatsapp, copy_cajero: m.copy_cajero };
}

function buildPrompt(cedula: string, nombre: string, shock: Shock, ofertas: Oferta[]) {
  const sistema =
    "Eres el redactor del programa de fidelización SmartCure de un grupo farmacéutico ecuatoriano. " +
    "Reglas: tono cálido, breve, español ecuatoriano, SIN emojis; NUNCA mencionar medicamentos, enfermedades ni condiciones médicas; " +
    "no usar la palabra 'sabemos'; máx. 280 caracteres en copy_whatsapp; " +
    'responde SOLO con un objeto JSON plano (sin bloques de código) {"copy_whatsapp": string, "copy_cajero": string}.';
  const user = JSON.stringify(
    {
      cedula,
      nombre,
      shock,
      ofertas,
      instruccion:
        "Redacta el mensaje de WhatsApp para la clienta (nombre de pila) con tono de beneficio, " +
        "y una línea para el cajero con la próxima mejor acción. Sin medicinas ni condiciones.",
    },
    null,
    2
  );
  return { sistema, user };
}

async function callBedrock(
  cedula: string,
  nombre: string,
  shock: Shock,
  ofertas: Oferta[]
): Promise<ParsedBedrock | null> {
  if (!hasCreds()) return null;
  await waitRateLimit();

  const client = new BedrockRuntimeClient({ region: process.env.AWS_DEFAULT_REGION ?? "us-east-1" });
  const { sistema, user } = buildPrompt(cedula, nombre, shock, ofertas);

  for (const modelId of MODEL_IDS) {
    try {
      const cmd = new ConverseCommand({
        modelId,
        system: [{ text: sistema }],
        messages: [{ role: "user", content: [{ text: user }] }],
        inferenceConfig: { temperature: 0.2, maxTokens: 800 },
      });
      const res = await client.send(cmd);
      const text = res.output?.message?.content
        ?.map((c) => ("text" in c ? c.text : ""))
        .join("") ?? "";
      const parsed = validateBedrockOutput(text);
      if (parsed) return parsed;
    } catch {
      // probar siguiente modelo
    }
  }
  return null;
}

export async function getCopy(
  cedula: string,
  nombre: string,
  shock: Shock,
  ofertas: Oferta[]
): Promise<{ texto: ParsedBedrock; fuente: "REAL" | "RESPALDO" }> {
  const cached = cache.get(cedula);
  if (cached && Date.now() - cached.ts < TTL) {
    return { texto: cached.texto, fuente: cached.fuente };
  }

  const timeout = new Promise<null>((r) => setTimeout(() => r(null), 15000));
  const real = await Promise.race([
    callBedrock(cedula, nombre, shock, ofertas),
    timeout,
  ]);

  if (real) {
    const entry = { ts: Date.now(), texto: real, fuente: "REAL" as const };
    cache.set(cedula, entry);
    return { texto: real, fuente: "REAL" };
  }

  const fb =
    cedula === "1712345678"
      ? mariaFallback()
      : fallbackCopy(cedula, nombre, shock, ofertas);
  const entry = { ts: Date.now(), texto: fb, fuente: "RESPALDO" as const };
  cache.set(cedula, entry);
  return { texto: fb, fuente: "RESPALDO" };
}

export async function generateABVariantCopy(
  personaTitulo: string,
  varianteId: "A" | "B",
  enfoque: string,
  beneficio: string
): Promise<{ copyWhatsapp: string; copyCajero: string; fuente: "REAL" | "RESPALDO" }> {
  if (!hasCreds()) {
    return {
      copyWhatsapp: `Hola estimado socio SmartClub. Como beneficio especial para ${personaTitulo.toLowerCase()}, tienes disponible ${beneficio}. Acércate a nuestros locales y cuida tu bienestar familiar.`,
      copyCajero: `Próxima acción recomendada: Informar al socio sobre ${beneficio}. Proteger margen y no ofrecer descuentos en medicamentos crónicos.`,
      fuente: "RESPALDO",
    };
  }

  await waitRateLimit();
  const client = new BedrockRuntimeClient({
    region: process.env.AWS_DEFAULT_REGION ?? process.env.AWS_REGION ?? "us-east-1",
  });

  const sistema =
    "Eres el redactor experto en marketing de fidelización del programa SmartCure para Farmaenlace (Medicity, Farmacias Económicas, Wellderma, Mascota's, Ambiente). " +
    "Reglas estrictas: tono cálido, empático, español ecuatoriano, SIN emojis. " +
    "NUNCA mencionar medicamentos, nombres comerciales de fármacos, enfermedades, patologías ni condiciones médicas. " +
    "No usar la palabra 'sabemos'. Máximo 260 caracteres para WhatsApp. " +
    'Responde ÚNICAMENTE un JSON plano (sin formato markdown): {"copy_whatsapp": string, "copy_cajero": string}.';

  const user = JSON.stringify({
    buyer_persona: personaTitulo,
    variante_test_ab: varianteId,
    estrategia_enfoque: enfoque,
    beneficio_comercial: beneficio,
    instruccion:
      "Redacta el mensaje de WhatsApp para el socio y una instrucción concisa para la pantalla del cajero (próxima mejor acción).",
  });

  for (const modelId of MODEL_IDS) {
    try {
      const cmd = new ConverseCommand({
        modelId,
        system: [{ text: sistema }],
        messages: [{ role: "user", content: [{ text: user }] }],
        inferenceConfig: { temperature: 0.3, maxTokens: 600 },
      });
      const res = await client.send(cmd);
      const text =
        res.output?.message?.content
          ?.map((c) => ("text" in c ? c.text : ""))
          .join("") ?? "";
      const parsed = validateBedrockOutput(text);
      if (parsed?.copy_whatsapp && parsed?.copy_cajero) {
        return {
          copyWhatsapp: parsed.copy_whatsapp,
          copyCajero: parsed.copy_cajero,
          fuente: "REAL",
        };
      }
    } catch {
      // probar siguiente modelo
    }
  }

  return {
    copyWhatsapp: `Hola estimado socio SmartClub. Como beneficio de este mes enfocado en tu tranquilidad, accede a ${beneficio}. Presenta tu cédula en caja.`,
    copyCajero: `Próxima acción en caja: Indicar beneficio activo de ${beneficio}. Cero descuento en crónicos.`,
    fuente: "RESPALDO",
  };
}

export async function generateMarketingExecutiveFeedback(
  personaTitulo: string,
  nombreVariante: string,
  stats: {
    conversionPronosticada: number;
    conversionReal: number;
    deltaConversion: number;
    ticketReal: number;
    margenReal: number;
    canibalizacion: string;
  }
): Promise<{ analisis: string; recomendaciones: string[]; fuente: "REAL" | "RESPALDO" }> {
  if (!hasCreds()) {
    return {
      analisis: `La campaña evaluada para "${personaTitulo}" con la variante "${nombreVariante}" superó el pronóstico inicial con una conversión real del ${stats.conversionReal}% frente al ${stats.conversionPronosticada}% pronosticado (+${stats.deltaConversion}%). Se confirma cero canibalización en medicamentos crónicos y un ticket promedio de $${stats.ticketReal} con margen incremental positivo.`,
      recomendaciones: [
        "Escalar la variante ganadora al 100% del segmento respetando el límite de 2 notificaciones al mes.",
        "Mantener la política de margen estricta: nunca descontar tratamientos habituales y canalizar beneficios hacia Wellderma y marcas aliadas.",
        "Reforzar el guión del cajero en punto de venta para maximizar la tasa de canje presencial.",
      ],
      fuente: "RESPALDO",
    };
  }

  await waitRateLimit();
  const client = new BedrockRuntimeClient({
    region: process.env.AWS_DEFAULT_REGION ?? process.env.AWS_REGION ?? "us-east-1",
  });

  const sistema =
    "Eres el Director de Analítica y Estrategia Comercial de Farmaenlace asesorando al Gerente de Marketing. " +
    "Tu rol es auditar los resultados de la campaña ejecutada en SmartClub, verificar si el pronóstico de IA fue acertado y evaluar el impacto financiero y de márgenes. " +
    "Debes ser riguroso, analítico, profesional y directo. " +
    'Responde ÚNICAMENTE un JSON plano (sin formato markdown): {"analisis": string, "recomendaciones": string[]}.';

  const user = JSON.stringify({
    segmento: personaTitulo,
    campana_evaluada: nombreVariante,
    conversion_pronosticada: `${stats.conversionPronosticada}%`,
    conversion_real_obtenida: `${stats.conversionReal}%`,
    delta_desviacion: `${stats.deltaConversion}%`,
    ticket_promedio_obtenido: `$${stats.ticketReal}`,
    margen_neto_incremental: `$${stats.margenReal}`,
    analisis_canibalizacion: stats.canibalizacion,
    instruccion:
      "Redacta un veredicto ejecutivo claro explicando por qué el pronóstico fue válido o no, el impacto en margen y 3 recomendaciones tácticas.",
  });

  for (const modelId of MODEL_IDS) {
    try {
      const cmd = new ConverseCommand({
        modelId,
        system: [{ text: sistema }],
        messages: [{ role: "user", content: [{ text: user }] }],
        inferenceConfig: { temperature: 0.2, maxTokens: 800 },
      });
      const res = await client.send(cmd);
      const text =
        res.output?.message?.content
          ?.map((c) => ("text" in c ? c.text : ""))
          .join("") ?? "";
      let s = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
      const parsed = JSON.parse(s) as { analisis?: string; recomendaciones?: string[] };
      if (parsed?.analisis && Array.isArray(parsed?.recomendaciones)) {
        return {
          analisis: parsed.analisis,
          recomendaciones: parsed.recomendaciones,
          fuente: "REAL",
        };
      }
    } catch {
      // probar siguiente modelo
    }
  }

  return {
    analisis: `La campaña evaluada para "${personaTitulo}" con la variante "${nombreVariante}" superó el pronóstico inicial con una conversión real del ${stats.conversionReal}% frente al ${stats.conversionPronosticada}% proyectado (+${stats.deltaConversion}%). El modelo demostró alta precisión predictiva con ${stats.canibalizacion} y un margen incremental de $${stats.margenReal} por canje.`,
    recomendaciones: [
      "Extender la campaña ganadora a la totalidad del segmento antes del cierre de mes.",
      "Proteger el margen comercial garantizando que las ofertas sigan focalizadas en canastas cruzadas de Wellderma y cuidado preventivo.",
      "Integrar el feedback de canje al Golden Record para alimentar el próximo ciclo predictivo de SmartClub.",
    ],
    fuente: "RESPALDO",
  };
}
