export interface Client {
  id: string;
  nombre: string;
  cedula: string;
  edad: number;
  marca_base: string;
  smartclub: boolean;
  opt_in_personalizacion: boolean;
  cashback: number;
  rol_demo: string;
}

export interface Product {
  sku: string;
  nombre: string;
  marca: string;
  categoria: string;
  margen: number;
  es_cronico: boolean;
  fuera_catalogo_seguro?: boolean;
  fuente_externa?: string;
}

export interface Tx {
  id: string;
  cliente_id: string;
  fecha: string;
  sku: string;
  cantidad: number;
  monto: number;
  canal: string;
  pdv: string;
  fuente_externa?: boolean;
}

export interface Promo {
  id: string;
  marca: string;
  categoria: string;
  tipo: string;
  valor: number;
  stock: number;
  margen_min: number | null;
  vigencia: string;
}

export interface FamilyTag {
  tag: string;
  confianza: number;
  evidencia: string[];
  visible_en_pos: boolean;
}

export interface Contributor {
  categoria: string;
  label_ui: string;
  usual: number;
  actual: number;
  delta: number;
}

export interface Shock {
  activo: boolean;
  baseline: number;
  mes_actual: number;
  delta_pct: number;
  contribuyentes: Contributor[];
  trade_down: boolean;
  gap_cobertura: { count: number; monto: number } | null;
  gasto_externo_byd: { monto: number; detalle: string } | null;
}

export interface Oferta {
  id: string;
  marca: string;
  categoria: string;
  tipo: string;
  valor: number;
  razon: string;
  cronico: boolean;
}

export interface OfferResult {
  cedula: string;
  nombre: string;
  smartclub: boolean;
  cashback: number;
  familia: FamilyTag[];
  shock: Shock;
  ofertas: Oferta[];
  protegidos: string;
  copy_whatsapp: string;
  copy_cajero: string;
  fuente: "REAL" | "RESPALDO";
}

export type PersonaId = "cronico" | "bienestar" | "esporadico";

export interface ABVariant {
  id: "A" | "B";
  nombre: string;
  enfoque: string;
  beneficio: string;
  copyWhatsapp: string;
  copyCajero: string;
  tasaApertura: number;
  tasaConversion: number;
  ticketEstimado: number;
  margenIncremental: number;
  muestraPct: number;
  fuenteCopy: "REAL" | "RESPALDO";
}

export interface ABCampaign {
  id: string;
  personaId: PersonaId;
  nombreCampana: string;
  varianteA: ABVariant;
  varianteB: ABVariant;
  ganador: "A" | "B";
  razonGanador: string;
  upliftConversionPct: number;
  desplegada: boolean;
  impactosMesPorCliente: number; // Regla de oro: Máx 2 al mes
}

export interface BuyerPersona {
  id: PersonaId;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  icono: string;
  color: string;
  reglaMargen: string;
  totalClientes: number;
  ticketPromedio: number;
  frecuenciaPromedioMes: number;
  marcasAfinidad: string[];
  campanaAB?: ABCampaign;
}

export interface SegmentedClient extends Client {
  personaId: PersonaId;
  personaTitulo: string;
  comprasTotal: number;
  gastoTotal: number;
  ticketPromedio: number;
  ultimaCompra: string;
  afinidadCategoria: string;
  marcasFrecuentes: string[];
  tieneCronico: boolean;
  frecuenciaMensual: number;
}

export interface DatasetStats {
  totalClientes: number;
  totalTransacciones: number;
  sociosSmartclub: number;
  sociosSmartclubPct: number;
  ltvPromedio: number;
  gastoTotal: number;
  marcasPresentes: string[];
}

export interface CampaignPurchaseItem {
  sku: string;
  nombre: string;
  cantidad: number;
  monto: number;
  margenPct: number;
}

export interface CampaignPurchase {
  id: string;
  clienteId: string;
  clienteNombre: string;
  cedula: string;
  fecha: string;
  pdv: string;
  marca: string;
  items: CampaignPurchaseItem[];
  totalPagado: number;
  margenNeto: number;
  esVentaCruzada: boolean;
  canibalizacionEvitada: boolean;
}

export interface MarketingFeedbackReport {
  campaignId: string;
  personaId: PersonaId;
  personaTitulo: string;
  varianteEvaluada: "A" | "B";
  nombreVariante: string;
  veredicto: "ALTAMENTE_EXITOSA" | "EXITOSA" | "MODERADA" | "AJUSTAR";
  scoreEfectividad: number; // 0 a 100
  pronosticoVsReal: {
    conversionPronosticada: number;
    conversionReal: number;
    deltaConversion: number;
    ticketPronosticado: number;
    ticketReal: number;
    deltaTicket: number;
    margenPronosticado: number;
    margenReal: number;
    deltaMargen: number;
    precisionPronosticoPct: number;
  };
  metricasFinancieras: {
    sociosImpactados: number;
    comprasEfectivas: number;
    ingresosGenerados: number;
    margenNetoTotal: number;
    roiPct: number;
    canibalizacionDetectada: string;
  };
  analisisEjecutivoIA: string;
  recomendacionesGerencia: string[];
  comprasVerificadas: CampaignPurchase[];
  fechaEvaluacion: string;
}
