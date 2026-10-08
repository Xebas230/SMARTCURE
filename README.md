# SmartCure

Prototipo del hackathon Connect AI Build para Farmaenlace × BYD. SmartCure cruza historial de compras, membresía SmartClub y cobertura del seguro para sugerir beneficios personalizados en el momento oportuno.

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
