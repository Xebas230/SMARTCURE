"use client";

import { useEffect, useState } from "react";

interface AnalyzeResp {
  cliente?: { nombre: string; cedula: string; smartclub: boolean; cashback: number };
  familia?: { tag: string; confianza: number; visible_en_pos: boolean }[];
  shock?: {
    activo: boolean;
    baseline: number;
    mes_actual: number;
    delta_pct: number;
    contribuyentes: { label_ui: string; usual: number; actual: number; delta: number }[];
    trade_down: boolean;
    gap_cobertura: { count: number; monto: number } | null;
    gasto_externo_byd: { monto: number; detalle: string } | null;
  };
}

interface OffersResp extends AnalyzeResp {
  ofertas?: { id: string; marca: string; tipo: string; valor: number; razon: string }[];
  protegidos?: string;
  copy_whatsapp?: string;
  copy_cajero?: string;
  fuente?: "REAL" | "RESPALDO";
}

const LABELS: Record<string, string> = {
  hogar_con_bebe: "Hogar con bebé",
  hogar_con_mascota: "Hogar con mascota",
  hogar_con_persona_mayor: "Hogar con persona mayor",
  rutina_cuidado_personal: "Rutina de cuidado personal",
};

function Badge({ children, tone }: { children: React.ReactNode; tone: "real" | "sim" | "warn" | "ok" }) {
  const styles: Record<string, string> = {
    real: "bg-emerald-100 text-emerald-800 border-emerald-300",
    sim: "bg-amber-100 text-amber-800 border-amber-300",
    warn: "bg-rose-100 text-rose-800 border-rose-300",
    ok: "bg-sky-100 text-sky-800 border-sky-300",
  };
  return (
    <span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${styles[tone]}`}>
      {children}
    </span>
  );
}

export default function Home() {
  const [cedula, setCedula] = useState("1712345678");
  const [loading, setLoading] = useState(false);
  const [analyze, setAnalyze] = useState<AnalyzeResp | null>(null);
  const [offers, setOffers] = useState<OffersResp | null>(null);
  const [chat, setChat] = useState<{ who: "sys" | "cli"; text: string }[]>([]);
  const [echo, setEcho] = useState<string | null>(null);
  const [aplicando, setAplicando] = useState(false);

  async function run(ced: string) {
    setLoading(true);
    setOffers(null);
    setChat([]);
    setEcho(null);
    try {
      const a = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cedula: ced }),
      }).then((r) => r.json());
      setAnalyze(a);
      const o = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cedula: ced }),
      }).then((r) => r.json());
      setOffers(o);
    } catch {
      setAnalyze(null);
      setOffers(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Demo lista al abrir: análisis + ofertas de María (también calienta el caché de Bedrock, TTL 10 min)
    run("1712345678");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function aplicar() {
    if (!offers?.ofertas || aplicando) return;
    setAplicando(true);
    const wa = offers.copy_whatsapp ?? "Tu beneficio del mes está activo.";
    setChat([{ who: "sys", text: wa }]);
    setTimeout(() => {
      setChat((c) => [...c, { who: "cli", text: "Sí, canjeo el 2x1 de Mascota's" }]);
    }, 1500);
    setTimeout(async () => {
      try {
        const r = await fetch("/api/redeem", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cedula, oferta_id: offers.ofertas?.[0]?.id }),
        }).then((x) => x.json());
        setEcho(`Venta cerrada en ${r.marca} · cashback +$${r.cashback_sumado}`);
        setAplicando(false);
      } catch {
        setAplicando(false);
      }
    }, 2600);
  }

  const s = analyze?.shock;
  const chips = (analyze?.familia ?? []).filter((f) => f.visible_en_pos);

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-lg font-black text-white">S</div>
          <div>
            <h1 className="text-lg font-bold leading-none">SmartCure</h1>
            <p className="text-xs text-slate-500">Beneficio correcto · momento de necesidad</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone="warn">DEMO — datos sintéticos</Badge>
          <Badge tone="sim">SIMULADO: SAP · Vendix · WhatsApp · aseguradora</Badge>
        </div>
      </header>

      <main className="grid flex-1 grid-cols-5 gap-4 overflow-hidden p-4">
        {/* ===== POS ===== */}
        <section className="col-span-3 flex flex-col gap-3 overflow-y-auto rounded-2xl bg-white p-4 shadow">
          <div className="flex items-end gap-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Cédula del cliente</label>
              <input
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                className="mt-1 w-56 rounded-lg border border-slate-300 px-3 py-2 text-lg font-semibold outline-none focus:border-emerald-500"
              />
            </div>
            <button
              onClick={() => run(cedula)}
              disabled={loading}
              className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? "Analizando…" : "Analizar"}
            </button>
            <div className="ml-auto flex gap-1 text-[11px]">
              {[
                ["María (demo)", "1712345678"],
                ["Control", "1701001001"],
                ["Prueba en vivo", "1705005005"],
              ].map(([label, c]) => (
                <button
                  key={c}
                  onClick={() => {
                    setCedula(c);
                    run(c);
                  }}
                  className="rounded-full border border-slate-300 px-2 py-1 font-medium text-slate-600 hover:bg-slate-50"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {analyze?.cliente && (
            <p className="text-sm text-slate-600">
              <span className="font-bold">{analyze.cliente.nombre}</span> · {analyze.cliente.cedula} ·{" "}
              {analyze.cliente.smartclub ? "socia SmartClub ✓" : "no es socio"} · cashback ${analyze.cliente.cashback}
            </p>
          )}

          {/* Perfil */}
          <div className="pop rounded-xl border border-slate-200 p-3">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-bold">Perfil del hogar</h2>
              <Badge tone="real">REAL — análisis de canasta en vivo</Badge>
            </div>
            {chips.length === 0 ? (
              <p className="text-sm text-slate-400">Ingresa una cédula y presiona Analizar.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {chips.map((f) => (
                  <span key={f.tag} className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800">
                    {LABELS[f.tag] ?? f.tag} · {Math.round(f.confianza * 100)}%
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Pulso */}
          <div className={`pop rounded-xl border p-3 ${s?.activo ? "border-amber-300 bg-amber-50" : "border-slate-200"}`}>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-bold">Pulso del mes</h2>
              <Badge tone="real">REAL — detector de shock en vivo</Badge>
            </div>
            {!s ? (
              <p className="text-sm text-slate-400">—</p>
            ) : s.activo ? (
              <div className="space-y-2 text-sm">
                <p className="text-lg font-black text-amber-700">
                  Shock: ${s.baseline} → ${s.mes_actual} (+{s.delta_pct}%)
                </p>
                <div className="flex flex-wrap gap-2">
                  {s.contribuyentes.map((c) => (
                    <span key={c.label_ui} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-amber-800 shadow-sm">
                      {c.label_ui} +${c.delta}
                    </span>
                  ))}
                </div>
                <div className="space-y-1 text-xs text-slate-600">
                  {s.trade_down && <p>· Cambió una marca premium por una alternativa más económica (señal de presión)</p>}
                  {s.gap_cobertura && (
                    <p>· {s.gap_cobertura.count} productos sin cobertura de su seguro este mes (${s.gap_cobertura.monto})</p>
                  )}
                  {s.gasto_externo_byd && (
                    <p>· {s.gasto_externo_byd.detalle}: ${s.gasto_externo_byd.monto} (señal externa SmartClub-BYD)</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm font-semibold text-emerald-700">
                Sin shock este mes: no se generan beneficios.
              </p>
            )}
          </div>

          {/* Beneficios */}
          <div className="pop rounded-xl border border-slate-200 p-3">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-bold">Beneficios de alivio</h2>
              {offers?.fuente === "REAL" ? (
                <Badge tone="real">REAL — Bedrock (generada en esta sesión)</Badge>
              ) : offers?.fuente === "RESPALDO" ? (
                <Badge tone="sim">RESPALDO — texto pre-generado (declarado)</Badge>
              ) : null}
            </div>
            {offers?.ofertas && offers.ofertas.length > 0 ? (
              <div className="space-y-2">
                {offers.ofertas.map((o) => (
                  <div key={o.id} className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 p-2.5">
                    <div className="min-w-28 shrink-0">
                      <p className="text-sm font-black text-emerald-700">
                        {o.tipo === "2x1" ? "2x1" : o.tipo === "cupon" ? "Cupón" : "15%"}
                      </p>
                      <p className="text-xs font-semibold text-slate-500">{o.marca}</p>
                    </div>
                    <p className="text-sm text-slate-600">{o.razon}</p>
                  </div>
                ))}
                <p className="text-xs font-bold text-emerald-700">+ Cashback extra 5% SmartClub</p>
                <p className="text-xs text-slate-500">Protegido: {offers.protegidos}</p>
                {offers.copy_cajero && (
                  <p className="rounded-lg bg-slate-900 p-2.5 text-xs font-medium text-white">
                    Pantalla del cajero: {offers.copy_cajero}
                  </p>
                )}
                <button
                  onClick={aplicar}
                  disabled={aplicando || !s?.activo}
                  className="w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-40"
                >
                  Aplicar en caja y notificar
                </button>
                {echo && <p className="pop text-sm font-bold text-emerald-700">✓ {echo}</p>}
              </div>
            ) : (
              <p className="text-sm text-slate-400">Sin beneficios para este cliente.</p>
            )}
          </div>

          {/* KPIs */}
          {offers?.ofertas && offers.ofertas.length > 0 && (
            <div className="flex flex-wrap gap-2 text-[11px] font-semibold">
              <span className="rounded-full bg-slate-800 px-3 py-1 text-white">Ofertas en 3 marcas desde una compra</span>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-white">Recompra habilitada</span>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-white">Margen protegido · 0% en crónicos</span>
            </div>
          )}
        </section>

        {/* ===== WhatsApp ===== */}
        <section className="col-span-2 flex flex-col overflow-hidden rounded-2xl bg-[#efeae2] shadow">
          <div className="flex items-center gap-3 bg-[#075e54] px-4 py-3 text-white">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 font-bold">
              {analyze?.cliente?.nombre?.[0] ?? "M"}
            </div>
            <div>
              <p className="text-sm font-bold leading-none">{analyze?.cliente?.nombre ?? "María Zambrano"}</p>
              <p className="text-[11px] opacity-80">en línea</p>
            </div>
            <span className="ml-auto">
              <Badge tone="sim">SIMULADO — WhatsApp</Badge>
            </span>
          </div>
          <div className="chat-area flex-1 space-y-3 overflow-y-auto p-4">
            {chat.length === 0 ? (
              <div className="rounded-lg bg-white/80 p-3 text-center text-xs text-slate-400 shadow-sm">
                El mensaje de beneficio aparecerá aquí al aplicar en caja.
              </div>
            ) : (
              chat.map((m, i) => (
                <div key={i} className={`pop flex ${m.who === "cli" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] px-3 py-2 text-sm shadow-sm ${
                      m.who === "cli" ? "wa-bubble-out" : "wa-bubble-in"
                    }`}
                  >
                    {m.text}
                    <span className="ml-2 text-[10px] text-slate-400">{m.who === "cli" ? "10:24 ✓✓" : "10:24"}</span>
                  </div>
                </div>
              ))
            )}
            {echo && chat.length > 0 && (
              <p className="pop text-center text-[11px] font-bold text-emerald-700">✓ {echo}</p>
            )}
          </div>
          <div className="flex items-center gap-2 bg-[#f0f0f0] px-3 py-2 text-xs text-slate-400">
            Escribe un mensaje…
            <span className="ml-auto rounded-full bg-[#25d366] px-3 py-1 font-bold text-white">Enviar</span>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white px-5 py-2 text-center text-[11px] text-slate-500">
        Datos 100% sintéticos · Bedrock ≤1 req/seg · Cumple LOPDP (opt-in) · Copia sin medicinas · Capa post-venta (no toca facturación)
      </footer>
    </div>
  );
}
