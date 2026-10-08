# CLAUDE CODE — Contexto completo de SMARTCURE

> **Lee esto antes de cambiar código.** Este archivo reúne la idea, el contexto del reto, decisiones del equipo, estado real del MVP y restricciones. Está preparado para ayudar a programar durante el hackathon, no para reemplazar las reglas del evento.
>
> **Confidencialidad:** solo se incluyen resúmenes y datos sintéticos. No copies aquí ni en servicios externos documentos no públicos del patrocinador, claves AWS, tokens o datos reales. Confirma con la organización qué materiales se pueden procesar con asistentes externos. Las credenciales del sandbox viven únicamente en `.env.local` (ignorado por Git).

---

## 1. Rol esperado de Claude Code

Actúa como **ingeniero full-stack senior** que ayuda a un equipo de tres personas a terminar y estabilizar una demo funcional. El tiempo de construcción es muy limitado.

Prioridades, en este orden:
1. Mantener la demo ejecutable en la laptop local.
2. No romper lo que ya funciona ni rehacer la arquitectura sin necesidad.
3. Cambios pequeños, verificables y rápidos; probar cada cambio.
4. Ser preciso al describir integraciones: distinguir REAL, SIMULADO y ROADMAP.
5. No añadir funciones fuera del alcance sin autorización explícita del equipo.

No afirmes que hay una integración real con SAP, PromoGO, Vendix, aseguradoras, SmartClub o WhatsApp: en este prototipo esas conexiones están simuladas. Bedrock sí se probó con el sandbox y generó una respuesta real.

---

## 2. Evento y límites

- Hackathon **Connect AI Build / Connect atVentures 2026**, retos patrocinados por Farmaenlace y BYD.
- Equipos de 1–3 personas; prototipo/demo + pitch de **3 minutos**.
- Entrega final: **15:45**, después se congela el producto. El jurado evalúa demos en mesa y selecciona finalistas para el escenario.
- Rúbrica: propuesta de valor 30 · técnica/ejecución 25 · novedad 20 · viabilidad 15 · claridad/demo 10.
- Se premia ejecución funcional sobre cantidad de código. Hay que declarar herramientas de IA y distinguir claramente qué funciona y qué está simulado.
- Reglas del evento más recientes: **el proyecto sigue siendo del equipo**; el organizador/patrocinador puede mostrarlo para difusión; existe derecho de primera conversación si les interesa un piloto, no apropiación automática. Hay un borrador anterior con lenguaje distinto sobre PI: manda el documento que el equipo haya firmado; confirmar cualquier discrepancia con la organización.
- Los modelos de Bedrock del sandbox tienen límite de **1 solicitud por segundo**. Se usa `us-east-1`.
- En AWS están prohibidos los datos reales personales, financieros, de salud y otras categorías sensibles. **Todos los datos de este MVP son sintéticos.** No crear recursos públicos ni infraestructura innecesaria.
- No incluir en el repositorio el código de acceso a Workshop Studio, credenciales temporales, claves o tokens.

---

## 3. Contexto de Farmaenlace relevante para el producto

### Retos oficiales
1. Fidelización transversal.
2. Servicio al cliente o postventa.
3. Mejora operativa en cualquier vertical del grupo.

Se puede resolver uno, dos o tres. El enfoque recomendado del equipo es **fidelización transversal como núcleo**, con servicio postventa y eficiencia de primera línea como efectos del mismo motor; no presentar tres productos separados.

### Datos relevantes presentados en el evento
- El deck oficial indica 1,422 puntos de venta, 7.3M de clientes atendidos y 5,365 colaboradores en 2025. Si otra fuente del evento difiere, usar el deck oficial y no improvisar cifras.
- SmartClub integra seis marcas: Medicity, Farmacias Económicas, Wellderma, Ambiente, Mascotas y BYD. El deck muestra 75,377 socios y hasta 5% de cashback; la cuota anual de $20 y la meta de 100,000 socios vienen de la transcripción del kickoff, no del deck: presentarlas como datos del kickoff/hipótesis.
- Compra única: Wellderma 80.05%, Ambiente 78.87%, Mascotas 68.08%, Medicity 50.38%, Económicas 38.77%.
- La venta online del grupo ronda el 2%. La primera línea recibe demasiada información promocional y necesita recomendaciones simples.
- Farmaenlace tiene PromoGO, su motor propio de reglas promocionales. **SmartCure no lo reemplaza:** agrega una capa que decide a quién y cuándo recomendar la promoción; PromoGO puede seguir ejecutando las reglas comerciales.
- El propio deck advierte que descuentos frecuentes generan dependencia de ofertas, y que disponibilidad de medicamentos puede importar más que el precio. Por eso el motor no debe descontar medicamentos crónicos ni buscar elevar el ticket del consumidor.

### Información operativa aportada por una persona de Farmaenlace
- Farmaenlace tiene convenios B2B con aseguradoras y flujo de autorización/cobertura en punto de venta. En la facturación puede tener datos de la persona, aseguradora y cobertura aplicable al vademecum.
- **No asumir acceso al árbol de póliza, dependientes, diagnósticos ni a toda la póliza.** La idea utiliza únicamente campos de cobertura/facturación autorizados que Farmaenlace ya tenga acceso a procesar.
- SmartClub y convenios con seguros todavía no forman una experiencia integrada para el socio; el equipo propone conectar esas capacidades mediante el “mix”.
- SmartClub también tiene aliados. Según lo comentado, Farmaenlace puede no recibir toda la información de canjes hechos directamente con algunos aliados; esto es una oportunidad secundaria, no el núcleo del MVP.
- Política comunicada por el equipo: **no aumentar el ticket del consumidor final**. En pitch y producto hablar de retención, recompra, protección del bolsillo, cobertura y eficiencia; no de empujar gasto.
- Económicas compite principalmente por precio y volumen; Medicity atiende otro segmento. Las ofertas deben adaptarse a la marca y al margen.
- Las actualizaciones comerciales se gestionan centralmente/post-farmacia. SmartCure se plantea como capa de recomendación; no debe bloquear ni modificar facturación, autorización o trazabilidad regulatoria.

---

## 4. Solución acordada: SMARTCURE

### Propuesta de valor
SMARTCURE transforma SmartClub, de un programa principalmente reactivo de cashback, en un **ecosistema de beneficios personalizados**. Cruza el Golden Record autorizado (historial transversal de compras), la membresía SmartClub y la cobertura disponible de los convenios de seguros para recomendar una oferta relevante en el momento apropiado y mejorar recurrencia/LTV.

Frase corta para la presentación:

> **“El beneficio correcto para el socio SmartClub, cuando su bolsillo o su cobertura lo necesita, sin malacostumbrarlo a descuentos.”**

### Qué significa “Golden Record” aquí
Una ficha unificada que aprovecha datos existentes y autorizados: identificador del socio, compras por fecha/categoría/marca, pertenencia a SmartClub, respuesta/canje de campañas y campos de cobertura del seguro que el flujo de facturación permita usar.

**No construir captura de consumidor final anónimo.** Farmaenlace ya tiene una estrategia para ello y el equipo decidió no resolver ese problema. No proponer un flujo que pida nuevos datos al cliente anónimo ni afirmar que SmartCure captura su identidad.

### Dos modos de activación (sin modo anónimo)
**Modo A — Necesidad/comportamiento:** para un socio identificado, comparar gasto reciente con su patrón histórico, detectar cambio relevante (p. ej. shock de gasto o trade-down a una alternativa económica) y proponer un beneficio limitado.

**Modo C — Gap de cobertura (diferenciador B2B2C):** usando información de cobertura disponible en facturación/autorización —no una póliza completa— identificar productos o copagos que no quedan cubiertos según el mock autorizado y proponer un beneficio SmartClub complementario.

El “mix” es **SmartClub × comportamiento de compra × cobertura del seguro**. Es una propuesta para integrar capacidades existentes; no asegurar que Farmaenlace ya tenga implementado el cruce.

### PromoGO, Bedrock y Jev
- **PromoGO:** motor de promociones de Farmaenlace. SmartCure lo complementaría con selección/segmentación/contexto; no lo reemplaza. La integración con PromoGO no está construida en el prototipo.
- **Reglas deterministas del MVP:** calculan el shock, escogen beneficios permitidos y aplican límites. Son la fuente de verdad y el fallback.
- **Amazon Bedrock:** integración real verificada en este entorno. Su función actual es redactar el copy de WhatsApp/cajero desde el contexto ya calculado; no afirmar que predice por sí solo la necesidad ni que sustituye Golden Record.
- **Jev / TypeSafe System One:** un coach lo mencionó. Es un modelo de decisiones estructuradas (choice/score/noul), no un generador de texto. No hay credenciales/API de Jev confirmadas ni integración en el repo. Tratarlo como opción futura; no afirmar que corre en la demo.

### Reglas comerciales y de privacidad
- No crear ofertas de descuento para productos marcados `es_cronico`.
- Limitar la frecuencia: la propuesta SmartCure plantea **máximo dos notificaciones/ofertas mensuales por socio**. El código actual debe revisarse para que no contradiga este límite (ver sección 9).
- No diseñar para incrementar el gasto/ticket del consumidor final; enfatizar recompra, utilidad del beneficio, retención y margen sostenible.
- Solo usar perfiles/campos de consumo y cobertura con autorización/opt-in aplicable. No mostrar condiciones médicas, diagnósticos, nombres de medicamentos ni señales sensibles en el POS o WhatsApp.
- No usar ejemplos que infieran embarazo, peso, diabetes u otras condiciones a partir de compras. Son inferencias sensibles y no necesarias para demostrar el producto.
- Respetar cobertura, disponibilidad, inventario, margen mínimo y autorización de la aseguradora antes de recomendar algo en una versión productiva.

---

## 5. Segmento y perfiles para campañas

### Público objetivo general
Socios SmartClub o clientes elegibles para SmartClub, aproximadamente 35–50 años, con personas a cargo y/o seguro médico, que facturan y cuidan su presupuesto. El producto debe adaptarse por marca y comportamiento; no tratar a todos como un segmento único.

### Perfiles propuestos (segmentación de campaña, no diagnósticos)
1. **Comprador de productos recurrentes:** priorizar disponibilidad, recordatorio útil y continuidad; no descontar el crónico.
2. **Buscador de bienestar/cuidado personal:** campañas de prevención y cuidado usando categorías neutrales.
3. **Comprador esporádico:** descubrimiento de marcas/categorías relacionadas con compras previas, con límite de frecuencia.

Estos son segmentos de marketing propuestos. No presentarlos como modelos entrenados o segmentos ya existentes en producción.

---

## 6. A/B testing, predicción y LTV: visión de producto vs MVP

La visión SMARTCURE incluye workflows que aprenden de campañas: probar variantes por segmento, medir apertura/canje/recompra, mantener lo que funciona y probar otra opción cuando no funciona. También medir LTV/retención mediante tiempo entre compras.

**En el MVP actual esto NO está implementado como un sistema A/B automático.** En la demo solo hay reglas, oferta/canje simulado y métricas ilustrativas. Presentar A/B testing y LTV como **roadmap/fase posterior** o hipótesis de piloto, no como funcionalidad real del código.

Para el piloto se propone: 8 semanas, una marca y una ciudad, grupo de control, medir recompra a 60 días, frecuencia/interpurchase interval y margen incremental neto. No atribuir metas completas de socios o ingresos a SmartCure; usar escenarios de sensibilidad y etiquetarlos como supuestos.

La propuesta de vender inventario promocional hipersegmentado a laboratorios es una **hipótesis futura**, no una fuente de ingresos confirmada ni una función del MVP.

---

## 7. Demo actual — María (datos ficticios)

La demo usa `C-003`, María Zambrano, como socia SmartClub identificada. Todo su historial, nombre, identificador, compras y seguro son sintéticos; no corresponden a clientes reales.

- Baseline sintético: **$150/mes**.
- Octubre sintético: **$210 (+40%)**, desglosado en dos categorías contribuyentes: esenciales +$35 y mascota +$25.
- Señales del mock: cambio de marca premium a alternativa económica en cuidado personal; dos productos marcados fuera de cobertura; mantenimiento BYD $89 como señal externa **que no cuenta en el baseline de Farmaenlace**.
- Ofertas simuladas: 2x1 Mascotas, descuento Wellderma, cupón Ambiente y cashback SmartClub. La propuesta comercial final debe respetar el límite de ofertas acordado.
- El POS muestra solo chips neutrales de bajo riesgo. “Hogar con persona mayor” y las claves de evidencia quedan ocultas al cajero.
- El nombre/copy de WhatsApp es sintético y se muestra como simulación; no hay envío por WhatsApp real.

**Cuidado de consistencia actual:** el dataset hace que María tenga exactamente $150 en cada mes base y $210 en el mes actual. La UI calcula la variación desde el mock, no debe hardcodearla.

---

## 8. Rúbrica, pitch y claims permitidos

### Rúbrica
- Propuesta de valor/impacto 30; calidad técnica/ejecución 25; novedad 20; viabilidad 15; claridad/demo 10.
- Pitch de 3 minutos; jurado primero ve demo de mesa.
- Debe declararse qué es REAL y qué es SIMULADO. Se valora ejecución, no complejidad.

### Posicionamiento recomendado
Un reto principal: **fidelización transversal**. Efectos derivados: servicio postventa proactivo y mejor información accionable en primera línea. No decir que se resolvieron los tres con módulos completos.

### Claims honestos
- “SmartCure complementa PromoGO” (no lo reemplaza).
- “La data de aseguradora/cobertura disponible en facturación puede habilitar el mix” (no “tenemos acceso a pólizas completas”).
- “Bedrock redacta el mensaje”; el motor determinista calcula/ancla las reglas.
- “El piloto medirá si mejora recompra, tiempo entre compras y margen”; no afirmar uplift todavía.
- “El seguro, WhatsApp, SAP/Vendix, SmartClub/PromoGO y canje en aliados están simulados en el prototipo”, salvo llamadas efectivamente conectadas en la demo.
- No afirmar “aumentamos el ticket”; la política comunicada es no inflarlo.

### Q&A central
**¿Cómo entra el seguro?** Los convenios y la facturación ya contienen persona, aseguradora y cobertura del vademécum. El producto propone conectar esos campos autorizados a SmartClub para detectar brechas; el mock simula ese cruce. No usa árboles familiares ni diagnósticos.

**¿Qué es real?** Motor de canasta/shock/reglas sobre datos sintéticos y llamada Bedrock para copy si el badge dice REAL. Conexiones de negocio externas y envíos son simulados.

**¿Dónde está el A/B y LTV?** Son parte del roadmap/piloto. El MVP demuestra el flujo de recomendación/canje; la medición de resultados requiere campaña real, consentimiento y grupo de control.

---

## 9. Estado REAL del repositorio (no confundir con la visión)

### Stack y ejecución
- Next.js 16.4, React 19, TypeScript, Tailwind CSS 4, Amazon Bedrock Runtime SDK.
- Carpeta: `smartcure/`; branch `main`; remoto GitHub: `Xebas230/SMARTCURE`.
- Arranque local: `npm run build` (en esta máquina usa `next build --webpack`) y `npm start`; URL `http://localhost:3000`.
- En Windows se tuvo que añadir `@tailwindcss/postcss`, `postcss.config.mjs`, `@source "./"` y dependencias opcionales Win32 para que se generaran las clases CSS. Si ves HTML sin estilos, comprobar build y hacer Ctrl+Shift+R.
- Nunca leer, imprimir, copiar ni committear `.env.local`. Solo usar `.env.example` como plantilla.

### Archivos principales
```
app/page.tsx                  # split-view POS + WhatsApp simulado; analiza a María al abrir
app/api/analyze/route.ts      # cliente → perfil de canasta + shock
app/api/offers/route.ts       # reglas → Bedrock copy → respuesta
app/api/redeem/route.ts       # canje simulado
lib/basket.ts                 # perfiles inferidos desde SKUs
lib/shock.ts                  # baseline mayo-septiembre vs octubre; gap/flags mock
lib/rules.ts                  # selección de promos y validación post-IA
lib/bedrock.ts                # inference profiles, límite 1 RPS, TTL memoria, respaldo
data/*.json                   # datos sintéticos de cinco clientes
data/cache/maria.json         # texto de respaldo declarado; no es fuente principal
```

### Integración Bedrock comprobada
- La sandbox está en `us-east-1` y los modelos disponibles requieren **inference profile IDs**.
- Modelo que sí respondió en este entorno: **`us.anthropic.claude-sonnet-4-6`** (no usar el bare model ID antiguo).
- Bedrock generó copy REAL en esta sesión. La salida de Claude llegó envuelta en ```json; `validateBedrockOutput` la limpia y valida.
- Credenciales son temporales, locales en `.env.local`; nunca van en GitHub. Si expiran, solicitar nuevas mediante Workshop Studio.

### Verificaciones hechas
- `npm run build -- --webpack`: build exitoso.
- Homepage: HTTP 200; CSS incluye utility classes (`grid-cols-5`, `bg-white`, `rounded-2xl`).
- Smoke tests previos: María shock +40%, Bedrock REAL, 4 tarjetas de promo/cashback; tres controles sin ofertas; Espinoza shock +52.7%; redeem devuelve `venta_cerrada`; cédula desconocida devuelve 404.

---

## 10. Discrepancias/decisiones que Claude Code debe revisar con el equipo antes de cambiar

1. **Máximo dos ofertas al mes:** la propuesta SMARTCURE dice máximo 2 ofertas/notificaciones por socio; el código actual de María devuelve tres promos comerciales + cashback. Alinear antes de la demo. Recomendación: máximo **dos promociones** + cashback, sin contar cashback como promo.
2. **Gap de cobertura:** es completamente sintético (`fuera_catalogo_seguro` en dos SKUs). No afirmar autorización ni conexión real del seguro.
3. **A/B testing, aprendizaje continuo, LTV, Jev/System One y laboratorios:** roadmap, no código actual. Jev fue recomendado por un coach, pero no hay API key confirmada ni integración.
4. **Modo B consumidor final anónimo:** EXCLUIDO por decisión del equipo. Farmaenlace ya tiene estrategia para capturar esos datos; no implementar captura de identidad anónima ni pitch de “flywheel de identidad”.
5. **Datos sensibles:** no mostrar el perfil `hogar_con_persona_mayor` ni evidencia de SKUs al cajero; en pantalla solo bebé, mascota y cuidado personal. WhatsApp no menciona medicinas/condiciones.
6. **Ticket:** no presentar crecimiento de ticket como objetivo; la política comunicada es no inflar el ticket final. Enfatizar frecuencia/recompra, protección, membresías, cobertura y margen.
7. **IP/confidencialidad:** las reglas Connect AI Build dicen que el proyecto queda con el equipo, pero existe un borrador anterior de acuerdo con lenguaje distinto. El documento firmado en el evento prevalece. No cargar documentos no públicos del patrocinador en herramientas externas sin autorización.

---

## 11. Instrucciones de cambios para Claude Code

Antes de cualquier modificación:
1. Leer este archivo y revisar el estado Git.
2. Preguntar antes de ampliar alcance o cambiar claims comerciales.
3. No exponer credenciales ni leer `.env.local`.
4. Para cambios de producto, preservar el flujo actual y ejecutar `npm run build`.
5. Si cambia número de ofertas, actualizar de forma coordinada: `lib/rules.ts`, copy/mock, UI, pitch y Q&A.
6. Mantener la distinción REAL/SIMULADO en la interfaz y las presentaciones.

**Prioridad durante el hackathon:** demo local estable > Bedrock elegante > roadmap adicional. No construir Jev, A/B automatizado ni una integración real de aseguradoras dentro de la ventana corta salvo que el equipo y el coach lo pidan explícitamente.
