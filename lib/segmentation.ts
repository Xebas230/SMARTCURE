import { products, transactions, clients } from "@/lib/data";
import type {
  Client,
  Tx,
  BuyerPersona,
  SegmentedClient,
  ABCampaign,
  DatasetStats,
  PersonaId,
} from "@/lib/types";

export const PERSONA_DEFINITIONS: Record<
  PersonaId,
  {
    titulo: string;
    subtitulo: string;
    descripcion: string;
    icono: string;
    color: string;
    reglaMargen: string;
  }
> = {
  cronico: {
    titulo: "El Paciente Crónico",
    subtitulo: "Lealtad Terapéutica",
    descripcion:
      "Clientes de 40 a 65 años con tratamientos recurrentes obligatorios. Priorizan abastecimiento oportuno y certidumbre.",
    icono: "🩺",
    color: "emerald",
    reglaMargen:
      "0% descuento en medicina crónica (cero canibalización de margen). Ofertas exclusivas en venta cruzada (Wellderma y cuidado preventivo).",
  },
  bienestar: {
    titulo: "El Buscador de Bienestar",
    subtitulo: "Efecto Permacrisis",
    descripcion:
      "Profesionales de 25 a 45 años con alto estrés y ritmo exigente. Invierten en prevención, vitaminas, dermocosmética y rendimiento diario.",
    icono: "⚡",
    color: "amber",
    reglaMargen:
      "Impulso de ticket y frecuencia con kits de defensa inmune y cashback SmartClub en marcas del ecosistema Farmaenlace.",
  },
  esporadico: {
    titulo: "El Comprador Esporádico",
    subtitulo: "El Reto de Retención",
    descripcion:
      "Compradores de conveniencia geográfica (1 a 2 compras anuales). Compran urgencias OTC, pañales, mascotas o ambientación.",
    icono: "🛒",
    color: "sky",
    reglaMargen:
      "Redes de descubrimiento cruzadas (Mascota's y Ambiente) para enriquecer el Golden Record y convertir en socios recurrentes.",
  },
};

export function segmentClients(
  clientsList?: Client[],
  txsList?: Tx[]
): {
  personas: BuyerPersona[];
  clientesSegmentados: SegmentedClient[];
  stats: DatasetStats;
} {
  const allClients = clientsList ?? Object.values(clients);
  const allTxs = txsList ?? transactions;

  const txsByClient: Record<string, Tx[]> = {};
  for (const t of allTxs) {
    if (!txsByClient[t.cliente_id]) {
      txsByClient[t.cliente_id] = [];
    }
    txsByClient[t.cliente_id].push(t);
  }

  const clientesSegmentados: SegmentedClient[] = allClients.map((client) => {
    const userTxs = txsByClient[client.id] ?? [];
    const comprasTotal = userTxs.length;
    const gastoTotal = userTxs.reduce((sum, t) => sum + (t.monto ?? 0), 0);
    const ticketPromedio =
      comprasTotal > 0 ? Math.round((gastoTotal / comprasTotal) * 10) / 10 : 0;

    const fechas = userTxs.map((t) => t.fecha).sort();
    const ultimaCompra = fechas[fechas.length - 1] ?? "Sin registro";

    // Analizar SKUs comprados
    const skus = userTxs.map((t) => t.sku);
    const hasCronico = skus.some((sku) => {
      const p = products[sku];
      return p?.es_cronico || p?.categoria === "cronico";
    });

    const hasBienestar = skus.some((sku) => {
      const p = products[sku];
      return (
        p?.categoria === "vitaminas" ||
        p?.categoria === "skincare" ||
        sku.includes("VITAMINA") ||
        sku.includes("CREMA") ||
        sku.includes("SERUM")
      );
    });

    const marcasCounts: Record<string, number> = {};
    const categoriasCounts: Record<string, number> = {};
    for (const sku of skus) {
      const p = products[sku];
      if (p) {
        marcasCounts[p.marca] = (marcasCounts[p.marca] ?? 0) + 1;
        categoriasCounts[p.categoria] = (categoriasCounts[p.categoria] ?? 0) + 1;
      }
    }

    const marcasFrecuentes = Object.entries(marcasCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([m]) => m);

    const catTop = Object.entries(categoriasCounts).sort(
      (a, b) => b[1] - a[1]
    )[0];
    const afinidadCategoria = catTop ? catTop[0] : "general";

    // Clasificación determinista según Golden Record
    let personaId: PersonaId = "esporadico";
    if (hasCronico || client.rol_demo?.includes("cronico") || client.edad >= 50 && comprasTotal >= 3) {
      personaId = "cronico";
    } else if (
      hasBienestar ||
      client.rol_demo?.includes("skincare") ||
      client.rol_demo?.includes("shock") ||
      comprasTotal >= 5
    ) {
      personaId = "bienestar";
    } else {
      personaId = "esporadico";
    }

    // Frecuencia mensual estimada
    const mesesUnicos = new Set(userTxs.map((t) => t.fecha.slice(0, 7))).size;
    const frecuenciaMensual =
      mesesUnicos > 0 ? Math.round((comprasTotal / mesesUnicos) * 10) / 10 : 0.5;

    return {
      ...client,
      personaId,
      personaTitulo: PERSONA_DEFINITIONS[personaId].titulo,
      comprasTotal,
      gastoTotal: Math.round(gastoTotal * 10) / 10,
      ticketPromedio,
      ultimaCompra,
      afinidadCategoria,
      marcasFrecuentes,
      tieneCronico: hasCronico,
      frecuenciaMensual,
    };
  });

  // Agrupar métricas por Persona
  const personas: BuyerPersona[] = (["cronico", "bienestar", "esporadico"] as PersonaId[]).map(
    (pid) => {
      const def = PERSONA_DEFINITIONS[pid];
      const clientesDelGrupo = clientesSegmentados.filter(
        (c) => c.personaId === pid
      );
      const totalClientes = clientesDelGrupo.length;
      const gastoAcum = clientesDelGrupo.reduce((acc, c) => acc + c.gastoTotal, 0);
      const ticketPromedio =
        totalClientes > 0
          ? Math.round((gastoAcum / totalClientes) * 10) / 10
          : 0;

      const freqProm =
        totalClientes > 0
          ? Math.round(
              (clientesDelGrupo.reduce(
                (acc, c) => acc + c.frecuenciaMensual,
                0
              ) /
                totalClientes) *
                10
            ) / 10
          : 1;

      // Marcas top del grupo
      const marcasMap: Record<string, number> = {};
      for (const c of clientesDelGrupo) {
        for (const m of c.marcasFrecuentes) {
          marcasMap[m] = (marcasMap[m] ?? 0) + 1;
        }
      }
      const marcasAfinidad = Object.entries(marcasMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([m]) => m);

      return {
        id: pid,
        titulo: def.titulo,
        subtitulo: def.subtitulo,
        descripcion: def.descripcion,
        icono: def.icono,
        color: def.color,
        reglaMargen: def.reglaMargen,
        totalClientes,
        ticketPromedio,
        frecuenciaPromedioMes: freqProm,
        marcasAfinidad: marcasAfinidad.length ? marcasAfinidad : ["Medicity", "Económicas"],
      };
    }
  );

  // Estadísticas globales del dataset
  const totalClientes = clientesSegmentados.length;
  const totalTransacciones = allTxs.length;
  const sociosSmartclub = clientesSegmentados.filter((c) => c.smartclub).length;
  const sociosSmartclubPct =
    totalClientes > 0
      ? Math.round((sociosSmartclub / totalClientes) * 100)
      : 0;
  const gastoTotal = Math.round(
    clientesSegmentados.reduce((acc, c) => acc + c.gastoTotal, 0)
  );
  const ltvPromedio =
    totalClientes > 0 ? Math.round(gastoTotal / totalClientes) : 0;

  const marcasPresentes = Array.from(
    new Set(Object.values(products).map((p) => p.marca))
  );

  const stats: DatasetStats = {
    totalClientes,
    totalTransacciones,
    sociosSmartclub,
    sociosSmartclubPct,
    ltvPromedio,
    gastoTotal,
    marcasPresentes,
  };

  return { personas, clientesSegmentados, stats };
}

export function getDefaultCampaigns(): Record<PersonaId, ABCampaign> {
  return {
    cronico: {
      id: "CAMP-CRONICO-01",
      personaId: "cronico",
      nombreCampana: "Abastecimiento & Bienestar Dermatológico Protegido",
      impactosMesPorCliente: 1,
      desplegada: false,
      ganador: "A",
      razonGanador:
        "La Variante A logró +42% mayor tasa de canje cruzado en Wellderma protegiendo el 100% del margen en medicamentos crónicos.",
      upliftConversionPct: 42.5,
      varianteA: {
        id: "A",
        nombre: "Venta Cruzada en Dermocosmética Wellderma",
        enfoque: "Beneficio cruzado de alivio dérmico sin tocar medicamento",
        beneficio: "15% off en cuidado dérmico Wellderma + recordatorio de retiro",
        copyWhatsapp:
          "Hola estimado socio. Tu tratamiento esencial tiene retiro asegurado en Medicity. Como beneficio exclusivo SmartClub, dispones de 15% en hidratación especializada Wellderma este mes.",
        copyCajero:
          "Próxima acción: Recordar disponibilidad de tratamiento habitual y ofrecer 15% en Wellderma. CERO descuento en medicamentos crónicos.",
        tasaApertura: 78.4,
        tasaConversion: 24.8,
        ticketEstimado: 38.5,
        margenIncremental: 14.2,
        muestraPct: 50,
        fuenteCopy: "REAL",
      },
      varianteB: {
        id: "B",
        nombre: "Cashback Doble SmartClub en Salud General",
        enfoque: "Acumulación de saldo SmartClub en punto de venta",
        beneficio: "Cashback extra 5% en compras complementarias",
        copyWhatsapp:
          "Hola. Por tu constancia en SmartClub, este mes acumulas 5% de saldo extra en tus compras de farmacia y aliados para tu tranquilidad familiar.",
        copyCajero:
          "Próxima acción: Informar saldo SmartClub acumulado para usar en la próxima compra.",
        tasaApertura: 71.0,
        tasaConversion: 17.4,
        ticketEstimado: 29.0,
        margenIncremental: 8.5,
        muestraPct: 50,
        fuenteCopy: "REAL",
      },
    },
    bienestar: {
      id: "CAMP-BIENESTAR-01",
      personaId: "bienestar",
      nombreCampana: "Kit de Rendimiento & Prevención Activa",
      impactosMesPorCliente: 1,
      desplegada: false,
      ganador: "B",
      razonGanador:
        "La Variante B (Arma tu Kit Defensas) generó un ticket promedio 31% más alto y superó la conversión frente al cashback plano.",
      upliftConversionPct: 34.8,
      varianteA: {
        id: "A",
        nombre: "Cashback Agresivo en Wellderma & Cuidado",
        enfoque: "Incentivo financiero directo para compras de cuidado",
        beneficio: "10% de cashback en protectores solares y vitaminas",
        copyWhatsapp:
          "Hola. Apoya tu ritmo con energía. Tienes 10% de saldo SmartClub activo en vitaminas y protección solar en Wellderma y Medicity.",
        copyCajero:
          "Próxima acción: Sugerir canjear saldo SmartClub en suplementos y protector solar.",
        tasaApertura: 81.2,
        tasaConversion: 19.5,
        ticketEstimado: 32.4,
        margenIncremental: 9.8,
        muestraPct: 50,
        fuenteCopy: "REAL",
      },
      varianteB: {
        id: "B",
        nombre: "Arma tu Kit de Rendimiento (Vitaminas + Cuidado)",
        enfoque: "Solución integral de prevención ante jornadas demandantes",
        beneficio: "20% en el segundo producto de bienestar + muestra Wellderma",
        copyWhatsapp:
          "Hola. Diseñamos un beneficio especial para tu bienestar diario: al armar tu combinación de vitaminas y cuidado personal, recibes beneficio directo en caja.",
        copyCajero:
          "Próxima acción: Ofrecer kit combinado de Vitamina C/Complejo B con protector solar Wellderma.",
        tasaApertura: 86.5,
        tasaConversion: 26.3,
        ticketEstimado: 42.6,
        margenIncremental: 16.7,
        muestraPct: 50,
        fuenteCopy: "REAL",
      },
    },
    esporadico: {
      id: "CAMP-ESPORADICO-01",
      personaId: "esporadico",
      nombreCampana: "Red de Descubrimiento & Retención SmartClub",
      impactosMesPorCliente: 1,
      desplegada: false,
      ganador: "A",
      razonGanador:
        "La Variante A (Mascota's 2x1) quintuplicó la activación frente a conveniencia de hogar, identificando afinidad de alto LTV.",
      upliftConversionPct: 51.2,
      varianteA: {
        id: "A",
        nombre: "Descubrimiento Mascota's (Nutrición y Cuidados)",
        enfoque: "Activación emocional de alta recurrencia en alimento animal",
        beneficio: "2x1 en alimento seleccionado y snack en Mascota's",
        copyWhatsapp:
          "Hola. En tu próxima visita a nuestro local, aprovecha beneficio especial en alimento para tu mascota. Queremos acompañarte en cada momento de tu hogar.",
        copyCajero:
          "Próxima acción: Preguntar si tiene mascota y entregar cupón de bienvenida Mascota's.",
        tasaApertura: 64.0,
        tasaConversion: 21.7,
        ticketEstimado: 26.5,
        margenIncremental: 11.0,
        muestraPct: 50,
        fuenteCopy: "REAL",
      },
      varianteB: {
        id: "B",
        nombre: "Cupón de Hogar y Aromatización Ambiente",
        enfoque: "Descubrimiento de espacios y estilo en Ambiente",
        beneficio: "Cupón 15% en velas aromáticas y menaje de Ambiente",
        copyWhatsapp:
          "Hola. Te invitamos a descubrir los detalles para tu hogar en Ambiente con un cupón exclusivo por tu compra reciente en farmacia.",
        copyCajero:
          "Próxima acción: Entregar volante con cupón de 15% para compras en tiendas Ambiente.",
        tasaApertura: 58.2,
        tasaConversion: 14.3,
        ticketEstimado: 21.0,
        margenIncremental: 6.2,
        muestraPct: 50,
        fuenteCopy: "REAL",
      },
    },
  };
}
