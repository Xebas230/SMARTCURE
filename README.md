# 🏥 SMARTCURE: Inteligencia Predictiva y A/B Testing para SmartClub
### *Farmaenlace (Medicity · Farmacias Económicas · Wellderma · Mascota's · Ambiente) × BYD*
> **Hackathon Connect AI Build 2026**

---

## 🎯 1. Propuesta de Valor

**SMARTCURE** transforma el programa de fidelización **SmartClub** de Farmaenlace mediante un motor de IA predictiva alojado en **Amazon Bedrock** que aprovecha el *Golden Record* (historial transaccional transversal).

En lugar de enviar descuentos genéricos y masivos que destruyen el margen comercial, SmartCure:
1. **Sectoriza a los clientes por comportamiento de compra real** en 3 Buyer Personas.
2. **Genera campañas automatizadas con A/B Testing continuo**, midiendo apertura, conversión y margen neto incremental.
3. **Audita las compras reales y valida el pronóstico** entregando retroalimentación analítica directa para el **Gerente de Marketing**.
4. **Respeta la Regla de Oro:** Un límite estricto de **máximo 2 ofertas/notificaciones al mes por cliente** para garantizar relevancia absoluta y cero spam.
5. **Protege el margen comercial:** **0% de descuento en medicamentos habituales/crónicos** (cero canibalización), canalizando los beneficios hacia ventas cruzadas en marcas de alto margen (*Wellderma, Mascota's, Ambiente*).

---

## 💻 2. Requisitos y Ejecución en Local

### Requisitos previos
* **Node.js**: Versión 20 o superior (verificado en Node v20 - v25).
* **npm**: Versión 10 o superior.

### Paso a paso para arrancar el proyecto

1. **Clonar el repositorio o situarse en la carpeta raíz:**
   ```bash
   cd c:\SMARTCURE2\SMARTCURE
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno de AWS Bedrock (Opcional):**
   Copia el archivo `.env.example` a `.env.local` y agrega tus credenciales temporales del sandbox de AWS Workshop Studio:
   ```bash
   cp .env.example .env.local
   ```
   Contenido esperado en `.env.local`:
   ```env
   AWS_DEFAULT_REGION=us-east-1
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=tu-access-key
   AWS_SECRET_ACCESS_KEY=tu-secret-key
   AWS_SESSION_TOKEN=tu-session-token
   BEDROCK_MODEL_ID=us.anthropic.claude-sonnet-4-6
   ```
   > 🔒 **Seguridad:** `.env.local` está protegido en `.gitignore`. Si no configuras credenciales, el sistema cuenta con un motor de respaldo local que garantiza funcionamiento continuo y sin caídas.

4. **Iniciar en modo desarrollo:**
   ```bash
   npm run dev
   ```
   *(O si prefieres la versión optimizada de producción: `npm run build` y luego `npm start`).*

5. **Acceder a la aplicación:**
   Abre tu navegador en:
   👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🧭 3. Guía de Uso del Sistema (Paso a Paso)

El sistema está diseñado para que el jurado y la **Gerencia de Marketing** puedan evaluar todo el flujo sin necesidad de tipear cédulas manualmente.

### 📌 Módulo 1: Centro de Campañas & A/B Testing (`Pestaña 1`)
Es el panel estratégico para la toma de decisiones comerciales:

1. **📂 Subir Base de Datos (Golden Record):**
   * Haz clic en el botón superior **"Subir Base"**.
   * Puedes arrastrar un archivo `.csv` o `.json` propio, o hacer clic en **"Cargar con 1 Clic"** para precargar instantáneamente la base Golden Record de Farmaenlace (12 socios sintéticos y 184 transacciones representativas).
2. **🔍 Analizar & Sectorizar:**
   * Presiona el botón verde **"Analizar & Sectorizar"**.
   * El algoritmo agrupa automáticamente la base en los **3 Buyer Personas**:
     * 🩺 **A. El Paciente Crónico ("Lealtad Terapéutica"):** Compras obligatorias de tratamientos continuos. Política: *0% descuento en su medicina crónica · Venta cruzada en cuidado dérmico Wellderma*.
     * ⚡ **B. El Buscador de Bienestar ("Efecto Permacrisis"):** Profesionales con estrés que buscan suplementos, vitaminas y protectores solares. Política: *Kits de rendimiento combinado y cashback SmartClub*.
     * 🛒 **C. El Comprador Esporádico ("Reto de Retención"):** Compras aisladas de conveniencia (pañales, mascotas, ambientación). Política: *Redes de descubrimiento para reactivar el Golden Record*.
3. **⚡ Generar Campañas & A/B Testing con IA:**
   * Presiona **"Generar Campañas & A/B"**.
   * **Amazon Bedrock** redacta en tiempo real copys persuasivos bajo estrictas reglas de privacidad (español ecuatoriano, tono empático, sin mencionar fármacos/diagnósticos médicos y con la *próxima mejor acción* para el cajero).
   * El motor distribuye la muestra (50% Variante A vs 50% Variante B) y calcula: *Tasa de Apertura*, *Tasa de Conversión*, *Ticket Promedio* y *Margen Incremental*.
   * El sistema detecta y corona automáticamente a la **🏆 Variante Ganadora** con significancia estadística.
4. **Desplegar al 100% del Segmento:**
   * Al pulsar **"Desplegar Ganadora"**, el sistema programa la campaña aplicando la **Regla de Oro** de un impacto consumido (1/2 al mes), garantizando cero spam.

---

### 📌 Módulo 2: Retroalimentación para el Gerente de Marketing (`Pestaña 2`)
Diseñado específicamente para responder: **¿Funcionó la campaña? ¿Qué compró el cliente? ¿El pronóstico fue válido?**

1. **Cómo acceder:**
   * Haz clic en el botón azul superior **"📈 Probar Campaña & Feedback Gerencia"** o en la pestaña **"Retroalimentación Gerente de Marketing"**.
2. **Qué información proporciona:**
   * **🏆 Veredicto Ejecutivo & Score:** Calificación del desempeño de la campaña (ej. *94.5/100 · Altamente Exitosa*).
   * **🧠 Dictamen de IA (Amazon Bedrock):** Análisis comercial en tiempo real redactado por la IA evaluando el comportamiento del consumidor y la rentabilidad obtenida.
   * **📊 Matriz de Validación (Pronóstico vs Realidad):**
     * *Conversión:* Pronosticada `24.8%` vs Real `26.4%` (+1.6% superó el pronóstico).
     * *Ticket Promedio:* Pronosticado `$38.50` vs Real `$39.20`.
     * *Margen Neto:* Pronosticado `$14.20` vs Real `$15.30` por canje.
     * *Precisión Predictiva:* **93.5% de fidelidad matemática**.
   * **🧾 Auditoría de Compras Verificadas (¿Qué compró realmente cada cliente?):**
     * Muestra la tabla detallada de transacciones cerradas post-campaña.
     * **Comprobación de no-canibalización:** Se evidencia que clientes como *Carlos Paredes* pagaron su medicina crónica habitual (*Losartán / Metformina*) a precio regular completo, y agregaron a su canasta el beneficio cruzado de *Crema Wellderma* con margen del 45%.
   * **💰 Rendimiento Financiero:**
     * Muestra facturación total generada ($510), margen neto generado ($199) y **ROI superior al 2,000%** frente al costo de envío.
   * **📌 Recomendaciones Tácticas:** 3 directrices accionables para el próximo plan de marketing mensual.

---

### 📌 Módulo 3: Punto de Venta (POS) & WhatsApp Simulado (`Pestaña 3`)
Demuestra la experiencia omnicanal en tiempo real entre el cajero de la farmacia y el teléfono del socio SmartClub:

1. **Selector Rápido de Clientes:**
   * Selecciona cualquier cliente en el menú desplegable o usa los botones de acceso rápido (*María Zambrano, Carlos Paredes, Rosa Morales, Lucía Andrade, etc.*) **sin escribir ninguna cédula**.
2. **Pantalla del POS (Cajero):**
   * **Perfil del Hogar:** Análisis de canasta en vivo (*Hogar con bebé, Mascota, Cuidado personal*).
   * **Pulso del Mes:** Detección de presión financiera o *shock* de gasto (+40%), compras fuera de cobertura y *trade-down* a marcas económicas.
   * **Beneficios sugeridos:** Ofertas personalizadas y la línea de instrucción para la pantalla del cajero.
3. **Simulador de WhatsApp:**
   * Al hacer clic en **"Aplicar en caja y notificar al cliente"**, se dispara el mensaje de WhatsApp simulado al cliente.
   * El cliente responde interactivamente aceptando el beneficio y el POS confirma el cierre de la venta y la acumulación de cashback en SmartClub.

---

## 🛡️ 4. Privacidad, Cumplimiento y Reglas de Negocio

* **Cumplimiento LOPDP:** Datos **100% sintéticos** creados con propósitos de demostración. No se procesan datos reales de pacientes ni historias clínicas.
* **Política de Cero Mención Médica:** Los mensajes redactados por Bedrock tienen prohibido por *prompt-guard* mencionar enfermedades, diagnósticos o nombres de fármacos.
* **Protección de Margen:** Cero descuentos en medicamentos crónicos de alta rotación para evitar canibalizar los ingresos base de Farmaenlace.
* **Frecuencia Controlada:** Máximo 2 impactos promocionales al mes por socio SmartClub.

---

## 🏗️ 5. Stack Tecnológico

* **Frontend & Backend:** Next.js 16.4 (App Router) · React 19 · TypeScript 5.
* **Estilos:** Tailwind CSS 4 con arquitectura visual ejecutiva.
* **Inteligencia Artificial:** Amazon Bedrock Runtime SDK (`@aws-sdk/client-bedrock-runtime`).
* **Modelos LLM:** `us.anthropic.claude-sonnet-4-6` con control de temperatura (0.2), TTL en memoria y limitador de tasa de solicitudes (1 RPS).
* **Motor Analítico:** Segmentación determinista, simulación de A/B testing y validación de compras en punto de venta.

---

### 👥 Equipo SmartCure
Desarrollado para el **Hackathon Connect AI Build 2026** — Reto Farmaenlace × BYD.
*(Todos los derechos reservados por el equipo)*.
