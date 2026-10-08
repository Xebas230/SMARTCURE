import { txsOfClient } from "@/lib/data";
import type { FamilyTag, Tx } from "@/lib/types";

export function inferFamily(clientId: string): FamilyTag[] {
  const txs = txsOfClient(clientId);
  const has = (...skus: string[]) =>
    txs.some((t) => skus.includes(t.sku));

  const tags: FamilyTag[] = [];

  if (has("PAÑALES-M", "FORMULA-800", "MULTIVITAMINICO-INF")) {
    tags.push({
      tag: "hogar_con_bebe",
      confianza: 0.97,
      evidencia: ["PAÑALES-M", "FORMULA-800"],
      visible_en_pos: true,
    });
  }
  if (has("DOG-CHOW-8KG", "CAT-CHOW-4KG")) {
    tags.push({
      tag: "hogar_con_mascota",
      confianza: 0.99,
      evidencia: ["DOG-CHOW-8KG", "CAT-CHOW-4KG"],
      visible_en_pos: true,
    });
  }
  if (has("LOSARTAN-50", "METFORMINA-850", "PAÑALES-ADULTO-M")) {
    tags.push({
      tag: "hogar_con_persona_mayor",
      confianza: 0.95,
      evidencia: ["LOSARTAN-50", "PAÑALES-ADULTO-M"],
      visible_en_pos: false,
    });
  }
  if (has("CREMA-HIDRATANTE", "PROTECTOR-FPS50", "LIMPIADOR-FACIAL", "SERUM-VITC")) {
    tags.push({
      tag: "rutina_cuidado_personal",
      confianza: 0.9,
      evidencia: ["CREMA-HIDRATANTE", "PROTECTOR-FPS50"],
      visible_en_pos: true,
    });
  }
  return tags;
}
