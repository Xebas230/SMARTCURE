# SmartCure

Prototipo del hackathon Connect AI Build para Farmaenlace × BYD. SmartCure cruza historial de compras, membresía SmartClub y cobertura del seguro para sugerir beneficios personalizados en el momento oportuno.

# INSTRUCCIONES DE USO

El sistema está diseñado para que el **jurado** y la **Gerencia de Marketing** puedan evaluar todo el flujo sin necesidad de tipear cédulas manualmente.

## Módulo 1: Centro de Campañas & A/B Testing (`Pestaña 1`)

Es el panel estratégico para la toma de decisiones comerciales.

### 1. 📂 Subir Base de Datos (Golden Record)

> **Nota:** Ya existe una base de datos cargada en el MVP.

Si deseas, puedes subir una base de datos propia o hacer clic en **"Cargar con 1 Clic"** para precargar instantáneamente la base **Golden Record de Farmaenlace**, que contiene:

- **12 socios sintéticos**
- **184 transacciones representativas**

### 2. 🔍 Analizar & Sectorizar

1. Presiona el botón verde **"Analizar & Sectorizar"**.
2. El algoritmo agrupa automáticamente la base en los **3 Buyer Personas**:

#### 🩺 A. El Paciente Crónico — *"Lealtad Terapéutica"*

Compras obligatorias de tratamientos continuos.

**Política:**

> *0% descuento en su medicina crónica · Venta cruzada en cuidado dérmico Wellderma.*

#### ⚡ B. El Buscador de Bienestar — *"Efecto Permacrisis"*

Profesionales con estrés que buscan suplementos, vitaminas y protectores solares.

**Política:**

> *Kits de rendimiento combinado y cashback SmartClub.*

#### 🛒 C. El Comprador Esporádico — *"Reto de Retención"*

Compras aisladas de conveniencia, como pañales, productos para mascotas y ambientación.

**Política:**

> *Redes de descubrimiento para reactivar el Golden Record.*

### 3. ⚡ Generar Campañas & A/B Testing con IA

1. Presiona **"Generar Campañas & A/B"**.
2. **Amazon Bedrock** redacta en tiempo real copys persuasivos bajo estrictas reglas de privacidad:
   - Español ecuatoriano.
   - Tono empático.
   - Sin mencionar fármacos ni diagnósticos médicos.
   - Incluye la **próxima mejor acción** para el cajero.
3. El motor distribuye la muestra en:
   - **50% → Variante A**
   - **50% → Variante B**
4. El sistema calcula automáticamente:
   - **Tasa de Apertura**
   - **Tasa de Conversión**
   - **Ticket Promedio**
   - **Margen Incremental**
5. El sistema detecta y corona automáticamente a la **🏆 Variante Ganadora** con significancia estadística.

### 4. 🚀 Desplegar al 100% del Segmento

Al pulsar **"Desplegar Ganadora"**, el sistema programa la campaña aplicando la **Regla de Oro**:

> **1 impacto consumido por socio cada 2 meses.**

Esto garantiza una estrategia de comunicación controlada y evita el **spam**.

## Ejecutar localmente

Requiere Node.js 20 o superior.

```bash
npm install
```

Para habilitar Amazon Bedrock, copia `.env.example` a `.env.local` y coloca allí las credenciales temporales del sandbox AWS Workshop Studio. **Nunca subas `.env.local` a GitHub.** Sin credenciales, el prototipo usa su respuesta de respaldo declarada.

```bash
npm run build
npm start
```

Abre [http://localhost:3000](http://localhost:3000). Para desarrollo usa `npm run dev`.

## Demo

- Vista dividida: POS del cajero y WhatsApp simulado.
- Modo A: compara el gasto mensual con el promedio histórico.
- Modo C: detecta una brecha de cobertura simulada.
- Datos de clientes y transacciones **100% sintéticos**.
- El motor de reglas decide ofertas; Bedrock genera el texto cuando está disponible. Si Bedrock no responde, se usa el respaldo etiquetado.

## Qué funciona y qué está simulado

**Real en el prototipo:** análisis de canasta, cálculo del cambio de gasto, selección de ofertas con reglas, validación de privacidad de la respuesta y llamada a Bedrock cuando las credenciales están habilitadas.

**Simulado:** SAP/Vendix, conexión con aseguradoras, WhatsApp, SmartClub y el canje comercial. No se conecta a datos reales ni procesa información real de clientes.

## Seguridad

- No se incluyen credenciales ni datos reales en el repositorio.
- `.env.local` está excluido por `.gitignore`.
- Las credenciales de AWS Workshop Studio son temporales y deben mantenerse locales.
- Bedrock se limita a una solicitud por segundo; el servidor local conserva resultados en memoria por un período corto.

## Stack

Next.js · React · TypeScript · Tailwind CSS · Amazon Bedrock (opcional, sandbox del evento)
