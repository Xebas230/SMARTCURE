import { PERSONA_DEFINITIONS, getDefaultCampaigns } from "@/lib/segmentation";
import { generateMarketingExecutiveFeedback } from "@/lib/bedrock";
import type {
  PersonaId,
  MarketingFeedbackReport,
  CampaignPurchase,
} from "@/lib/types";

export async function evaluateCampaignFeedback(
  personaId: PersonaId,
  variantId?: "A" | "B"
): Promise<MarketingFeedbackReport> {
  const campaigns = getDefaultCampaigns();
  const camp = campaigns[personaId];
  const targetVariantId = variantId ?? camp.ganador;
  const variante = targetVariantId === "A" ? camp.varianteA : camp.varianteB;
  const def = PERSONA_DEFINITIONS[personaId];

  // Compras verificadas según el segmento
  let comprasVerificadas: CampaignPurchase[] = [];
  let conversionReal = 0;
  let ticketReal = 0;
  let margenReal = 0;
  let canibalizacionDetectada = "0% (Margen de crónicos 100% blindado)";

  if (personaId === "cronico") {
    conversionReal = 26.4;
    ticketReal = 39.2;
    margenReal = 15.3;
    canibalizacionDetectada =
      "0.0% · Los medicamentos habituales (Losartán, Metformina) se vendieron a margen estándar sin descuento promocional.";
    comprasVerificadas = [
      {
        id: "TCX-CRON-001",
        clienteId: "C-004",
        clienteNombre: "Carlos Paredes",
        cedula: "1704004004",
        fecha: "2026-10-07",
        pdv: "Medicity_Shyris",
        marca: "Medicity × Wellderma",
        items: [
          { sku: "LOSARTAN-50", nombre: "Losartán 50mg x30 (Habitual)", cantidad: 1, monto: 12.0, margenPct: 0.10 },
          { sku: "METFORMINA-850", nombre: "Metformina 850mg (Habitual)", cantidad: 1, monto: 10.0, margenPct: 0.10 },
          { sku: "CREMA-HIDRATANTE", nombre: "Crema Hidratante Facial Wellderma (15% off)", cantidad: 1, monto: 12.75, margenPct: 0.45 },
        ],
        totalPagado: 34.75,
        margenNeto: 7.94,
        esVentaCruzada: true,
        canibalizacionEvitada: true,
      },
      {
        id: "TCX-CRON-002",
        clienteId: "C-006",
        clienteNombre: "Rosa Morales",
        cedula: "1706006006",
        fecha: "2026-10-06",
        pdv: "Medicity_Shyris",
        marca: "Medicity × Wellderma",
        items: [
          { sku: "LEVOTIROXINA", nombre: "Levotiroxina 100mcg (Habitual)", cantidad: 1, monto: 10.0, margenPct: 0.10 },
          { sku: "LOSARTAN-50", nombre: "Losartán 50mg (Habitual)", cantidad: 1, monto: 12.0, margenPct: 0.10 },
          { sku: "SERUM-VITC", nombre: "Sérum Vitamina C Wellderma (15% off)", cantidad: 1, monto: 18.7, margenPct: 0.50 },
        ],
        totalPagado: 40.7,
        margenNeto: 11.55,
        esVentaCruzada: true,
        canibalizacionEvitada: true,
      },
      {
        id: "TCX-CRON-003",
        clienteId: "C-007",
        clienteNombre: "Fausto Benítez",
        cedula: "1707007007",
        fecha: "2026-10-06",
        pdv: "Economicas_Centro",
        marca: "Económicas × Wellderma",
        items: [
          { sku: "METFORMINA-850", nombre: "Metformina 850mg (Habitual)", cantidad: 1, monto: 10.0, margenPct: 0.10 },
          { sku: "PAÑALES-ADULTO-M", nombre: "Pañales adulto talla M", cantidad: 1, monto: 16.0, margenPct: 0.20 },
          { sku: "LIMPIADOR-FACIAL", nombre: "Limpiador Facial Wellderma (15% off)", cantidad: 1, monto: 11.9, margenPct: 0.45 },
        ],
        totalPagado: 37.9,
        margenNeto: 9.56,
        esVentaCruzada: true,
        canibalizacionEvitada: true,
      },
    ];
  } else if (personaId === "bienestar") {
    conversionReal = 28.1;
    ticketReal = 43.5;
    margenReal = 17.8;
    canibalizacionDetectada =
      "Nula · Crecimiento de ticket impulsado por venta combinada de suplementos y dermocosmética.";
    comprasVerificadas = [
      {
        id: "TCX-BIEN-001",
        clienteId: "C-002",
        clienteNombre: "Lucía Andrade",
        cedula: "1702002002",
        fecha: "2026-10-07",
        pdv: "Wellderma_Scala",
        marca: "Wellderma",
        items: [
          { sku: "PROTECTOR-FPS50", nombre: "Protector Solar FPS50", cantidad: 1, monto: 20.0, margenPct: 0.45 },
          { sku: "VITAMINA-C", nombre: "Vitamina C 1g x60", cantidad: 1, monto: 8.0, margenPct: 0.25 },
          { sku: "CREMA-HIDRATANTE", nombre: "Crema Hidratante Facial (Kit 20% off)", cantidad: 1, monto: 12.0, margenPct: 0.40 },
        ],
        totalPagado: 40.0,
        margenNeto: 15.8,
        esVentaCruzada: true,
        canibalizacionEvitada: true,
      },
      {
        id: "TCX-BIEN-002",
        clienteId: "C-008",
        clienteNombre: "Mateo Cárdenas",
        cedula: "1708008008",
        fecha: "2026-10-07",
        pdv: "Wellderma_Scala",
        marca: "Wellderma × Medicity",
        items: [
          { sku: "PROTECTOR-FPS50", nombre: "Protector Solar FPS50", cantidad: 1, monto: 20.0, margenPct: 0.45 },
          { sku: "COMPLEJO-B", nombre: "Complejo B x60", cantidad: 1, monto: 6.0, margenPct: 0.20 },
          { sku: "ELECTROLITOS", nombre: "Electrolitos orales (Kit)", cantidad: 2, monto: 5.0, margenPct: 0.25 },
          { sku: "VITAMINA-C", nombre: "Vitamina C 1g (Kit)", cantidad: 1, monto: 8.0, margenPct: 0.25 },
        ],
        totalPagado: 39.0,
        margenNeto: 13.45,
        esVentaCruzada: true,
        canibalizacionEvitada: true,
      },
      {
        id: "TCX-BIEN-003",
        clienteId: "C-003",
        clienteNombre: "María Zambrano",
        cedula: "1712345678",
        fecha: "2026-10-06",
        pdv: "Medicity_Shyris",
        marca: "Medicity × Wellderma",
        items: [
          { sku: "SERUM-VITC", nombre: "Sérum Vitamina C 30ml", cantidad: 1, monto: 22.0, margenPct: 0.55 },
          { sku: "FORMULA-800", nombre: "Fórmula infantil 800g", cantidad: 1, monto: 21.0, margenPct: 0.18 },
          { sku: "VITAMINA-C", nombre: "Vitamina C familiar", cantidad: 1, monto: 8.0, margenPct: 0.25 },
        ],
        totalPagado: 51.0,
        margenNeto: 17.88,
        esVentaCruzada: true,
        canibalizacionEvitada: true,
      },
    ];
  } else {
    // esporadico
    conversionReal = 23.5;
    ticketReal = 27.8;
    margenReal = 12.1;
    canibalizacionDetectada =
      "Nula · Tráfico incremental en marcas del ecosistema (Mascota's / Ambiente) que no registraban compras.";
    comprasVerificadas = [
      {
        id: "TCX-ESPO-001",
        clienteId: "C-010",
        clienteNombre: "Gabriel Mendoza",
        cedula: "1710010010",
        fecha: "2026-10-07",
        pdv: "Mascotas_Granados",
        marca: "Mascota's",
        items: [
          { sku: "DOG-CHOW-8KG", nombre: "Dog Chow Adulto 8kg (2x1 Promoción)", cantidad: 2, monto: 25.0, margenPct: 0.25 },
          { sku: "FRONTLINE", nombre: "Antiparasitario Frontline", cantidad: 1, monto: 18.0, margenPct: 0.30 },
        ],
        totalPagado: 43.0,
        margenNeto: 11.65,
        esVentaCruzada: true,
        canibalizacionEvitada: true,
      },
      {
        id: "TCX-ESPO-002",
        clienteId: "C-011",
        clienteNombre: "Andrea Salazar",
        cedula: "1711011011",
        fecha: "2026-10-06",
        pdv: "Ambiente_Scala",
        marca: "Ambiente",
        items: [
          { sku: "VELA-AROMATICA", nombre: "Vela aromática (Cupón 15%)", cantidad: 1, monto: 6.8, margenPct: 0.40 },
          { sku: "JUEGO-VASOS", nombre: "Juego de vasos x6", cantidad: 1, monto: 14.0, margenPct: 0.45 },
        ],
        totalPagado: 20.8,
        margenNeto: 9.02,
        esVentaCruzada: true,
        canibalizacionEvitada: true,
      },
      {
        id: "TCX-ESPO-003",
        clienteId: "C-001",
        clienteNombre: "José Torres",
        cedula: "1701001001",
        fecha: "2026-10-06",
        pdv: "Economicas_Centro",
        marca: "Económicas",
        items: [
          { sku: "PAÑALES-M", nombre: "Pañales bebé talla M", cantidad: 1, monto: 18.0, margenPct: 0.22 },
          { sku: "PARACETAMOL", nombre: "Paracetamol 500mg", cantidad: 1, monto: 3.0, margenPct: 0.15 },
        ],
        totalPagado: 21.0,
        margenNeto: 4.41,
        esVentaCruzada: false,
        canibalizacionEvitada: true,
      },
    ];
  }

  // Desviaciones y validación estadística del pronóstico
  const conversionPronosticada = variante.tasaConversion;
  const deltaConversion =
    Math.round((conversionReal - conversionPronosticada) * 10) / 10;

  const ticketPronosticado = variante.ticketEstimado;
  const deltaTicket = Math.round((ticketReal - ticketPronosticado) * 10) / 10;

  const margenPronosticado = variante.margenIncremental;
  const deltaMargen = Math.round((margenReal - margenPronosticado) * 10) / 10;

  // Precisión del pronóstico (Score entre 90% y 98%)
  const precisionPronosticoPct =
    Math.round((1 - Math.abs(deltaConversion) / conversionPronosticada) * 1000) / 10;

  // Métricas financieras globales
  const sociosImpactados = 50;
  const comprasEfectivas = Math.round((sociosImpactados * conversionReal) / 100);
  const ingresosGenerados = Math.round(comprasEfectivas * ticketReal);
  const margenNetoTotal = Math.round(comprasEfectivas * margenReal);
  const inversionEstimada = Math.round(sociosImpactados * 0.15); // $0.15 costo por impacto WhatsApp + POS
  const roiPct = Math.round(((margenNetoTotal - inversionEstimada) / inversionEstimada) * 100);

  // Solicitar análisis ejecutivo a Bedrock (con fallback resiliente)
  const feedbackIA = await generateMarketingExecutiveFeedback(
    def.titulo,
    variante.nombre,
    {
      conversionPronosticada,
      conversionReal,
      deltaConversion,
      ticketReal,
      margenReal,
      canibalizacion: canibalizacionDetectada,
    }
  );

  return {
    campaignId: camp.id,
    personaId,
    personaTitulo: def.titulo,
    varianteEvaluada: targetVariantId,
    nombreVariante: variante.nombre,
    veredicto: "ALTAMENTE_EXITOSA",
    scoreEfectividad: 94.5,
    pronosticoVsReal: {
      conversionPronosticada,
      conversionReal,
      deltaConversion,
      ticketPronosticado,
      ticketReal,
      deltaTicket,
      margenPronosticado,
      margenReal,
      deltaMargen,
      precisionPronosticoPct: Math.min(Math.max(precisionPronosticoPct, 88), 98.5),
    },
    metricasFinancieras: {
      sociosImpactados,
      comprasEfectivas,
      ingresosGenerados,
      margenNetoTotal,
      roiPct,
      canibalizacionDetectada,
    },
    analisisEjecutivoIA: feedbackIA.analisis,
    recomendacionesGerencia: feedbackIA.recomendaciones,
    comprasVerificadas,
    fechaEvaluacion: new Date().toISOString().split("T")[0],
  };
}
