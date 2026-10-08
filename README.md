# SMARTCURE

SMARTCURE es una **herramienta de apoyo para el gerente de Marketing de Farmaenlace**. Usa un Golden Record —un perfil unificado del comportamiento de compra— para segmentar socios, proponer campañas personalizadas, comparar variantes A/B y revisar resultados estimados.

La solución está diseñada para integrarse con **SmartClub, SAP S/4HANA y PromoGO**. SmartCure aporta la capa de segmentación y recomendación; **complementa PromoGO, no lo reemplaza**: PromoGO seguiría ejecutando las reglas promocionales y SmartCure recomendaría qué campaña mostrar, a qué segmento y con qué enfoque.

## Qué demuestra el prototipo

- Segmentación del Golden Record sintético en tres perfiles: paciente crónico, buscador de bienestar y comprador esporádico.
- Generación de variantes A/B de mensajes con Amazon Bedrock cuando está disponible.
- Límite de diseño de **hasta 2 ofertas/notificaciones por socio al mes** para controlar saturación promocional.
- Vista de resultados de campaña, canjes simulados y retroalimentación para el gerente de Marketing.
- Vista POS/servicio que ilustra cómo una recomendación puede llegar a la primera línea.
- Protección de margen: las campañas no descuentan medicamentos crónicos; priorizan beneficios cruzados y categorías elegibles.

## Ejecutar localmente

Requiere Node.js 20 o superior.

```bash
npm ci
```

Para habilitar Amazon Bedrock, copia `.env.example` a `.env.local` y coloca allí credenciales temporales válidas del sandbox AWS Workshop Studio. **Nunca subas `.env.local` a GitHub ni compartas sus credenciales.** Sin credenciales, SMARTCURE utiliza respuestas de respaldo etiquetadas.

```bash
npm run build
npm start
```

Abre [http://localhost:3000](http://localhost:3000). Para desarrollo usa `npm run dev`.

## Integraciones: objetivo y alcance del demo

**Integración objetivo:** Golden Record/SAP S/4HANA + SmartClub + PromoGO. La cobertura del seguro puede incorporarse mediante los datos autorizados disponibles en facturación y convenios; no se asume acceso a pólizas completas ni a diagnósticos.

**En este prototipo:** las fuentes de Farmaenlace y las conexiones a SAP S/4HANA, SmartClub, PromoGO, aseguradoras, POS/Vendix y canales de mensajería se representan con datos y respuestas simuladas. Bedrock sí se invoca realmente cuando hay credenciales y un modelo habilitado. La evaluación de resultados usa compras sintéticas; no constituye un resultado real de campaña ni una conclusión estadística.

## Reglas de privacidad y negocio

- Todos los perfiles, clientes, compras y coberturas del demo son **sintéticos**.
- No se recopilan datos de consumidores anónimos ni se intenta reemplazar la estrategia existente de Farmaenlace para identificarlos.
- No mostrar diagnósticos ni nombres de medicamentos en comunicaciones personalizadas.
- Personalización solo para socios con consentimiento; máximo 2 ofertas/notificaciones mensuales como regla propuesta.
- No diseñar la solución para inflar el ticket del consumidor; el foco es recurrencia, valor para el socio, cobertura y margen sostenible.
- Los datos/condiciones del mock no deben presentarse como políticas reales de aseguradoras.

## Seguridad

- `.env.local` está excluido por `.gitignore`; el repositorio solo incluye `.env.example` con marcadores de posición.
- Las credenciales de AWS Workshop Studio son temporales y deben mantenerse locales.
- Bedrock se limita a una solicitud por segundo; el servidor local conserva resultados en memoria durante un período corto.
- No se requieren buckets S3 públicos, EC2 públicos ni bases RDS públicas para el demo.

## Stack

Next.js · React · TypeScript · Tailwind CSS · AWS Bedrock (sandbox) · datos sintéticos JSON
