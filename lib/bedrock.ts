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
