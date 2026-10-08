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
