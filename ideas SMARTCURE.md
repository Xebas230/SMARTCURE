# SMARTCURE: Inteligencia Predictiva y A/B Testing para SmartClub

## 1. Propuesta de Valor
**SMARTCURE** transforma el programa de fidelización SmartClub mediante un motor de IA predictiva que exprime el *Golden Record* (historial unificado) de los clientes de Farmaenlace. En lugar de enviar promociones masivas, el sistema segmenta a los usuarios por comportamiento, genera campañas automatizadas con A/B Testing continuo y entrega un máximo de **2 ofertas hiperpersonalizadas al mes**. El resultado: máxima conversión, cero canibalización de márgenes y un aumento directo en el Life Time Value (LTV) del cliente.

---

## 2. ¿Qué problema resolvemos?
1. **Saturación y "Ceguera" Promocional:** Los clientes están bombardeados de descuentos genéricos. Si todo está en oferta siempre, la rentabilidad cae y el cliente se acostumbra a comprar solo con rebajas (dependencia de ofertas).
2. **Desaprovechamiento del Big Data (Golden Record):** Farmaenlace tiene 10 años de historia transaccional unificada, pero es difícil convertir esa avalancha de datos en "conocimiento ágil y accionable" en la primera línea de venta.
3. **Campañas sin aprendizaje dinámico:** Actualmente no hay un sistema automatizado que pruebe qué mensaje, producto o descuento funciona mejor para cada micro-segmento de forma continua.

---

## 3. La Solución (Cómo funciona SMARTCURE)
El sistema opera como una capa de inteligencia (alojada en AWS Bedrock) que se conecta al repositorio de datos de Farmaenlace y a su motor PromoGO[cite: 31]. Funciona en 3 pasos:

1. **Segmentación Inteligente (Golden Record):** La IA agrupa a los clientes basándose en su historial transversal (frecuencia, categorías, marcas). 
2. **Motor de A/B Testing Automatizado:** El área comercial o la IA proponen, por ejemplo, 5 campañas diferentes. El modelo las distribuye en pequeñas muestras dentro de cada segmento para medir la tracción (apertura, conversión, ticket). 
3. **Distribución de Precisión (Regla de las 2 Notificaciones):** Una vez que el A/B Testing define la campaña ganadora para un segmento, el sistema la dispara al resto del grupo. **Regla de oro:** El sistema tiene un límite estricto de máximo 2 notificaciones/ofertas al mes por usuario para garantizar la relevancia y evitar el spam.

---

## 4. Buyer Personas (Segmentos Clave)

Para alimentar el A/B Testing, hemos identificado 3 perfiles principales según su comportamiento de compra:

### A. El Paciente Crónico ("Lealtad Terapéutica")
* **Perfil:** Comprador de 40-60 años, adquiere medicación recurrente (ej. losartán, insulina o medicamentos para la diabetes).
* **Comportamiento:** Su compra no es opcional, es obligatoria. Prioriza disponibilidad y precio.
* **Campaña Ideal (A/B Testing):** No se le ofrecen descuentos en su medicina de siempre (eso reduciría el margen innecesariamente). *SMARTCURE* le envía campañas cruzadas: "Por tu compra de insulina, tienes 15% off en dermocosmética especializada en Wellderma" o recordatorios de abastecimiento antes de que se le acabe.

### B. El Buscador de Bienestar (Efecto "Permacrisis")
* **Perfil:** Profesional o programador de 25-40 años, vive con estrés y poco tiempo. 
* **Comportamiento:** Compra vitaminas (ej. Vitamina C, Complejo B), cafeína, energizantes o protectores solares. Busca prevenir enfermarse para no perder días de trabajo debido a la crisis económica[cite: 8, 23].
* **Campaña Ideal (A/B Testing):** Mensajes enfocados en "rendimiento" y "prevención". *SMARTCURE* prueba si este grupo responde mejor a un *cashback* extra en SmartClub o a promociones de "Arma tu kit de defensas" (ej. vitaminas + analgésicos).

### C. El Comprador Esporádico (El Reto de Retención)
* **Perfil:** Cliente que ha comprado 1 o 2 veces en el año[cite: 26]. No tiene un patrón de salud definido.
* **Comportamiento:** Compra por conveniencia geográfica (urgencias, pañales, artículos de limpieza o alimento para mascotas).
* **Campaña Ideal (A/B Testing):** El sistema lanza "redes" de descubrimiento. Prueba enviarle una campaña de *Mascota's* y otra de *Ambiente*. Si el usuario reacciona a la de mascotas, la IA actualiza su *Golden Record* y el próximo mes sus 2 notificaciones serán altamente perfiladas hacia el cuidado animal.

---

## 5. ¿Por qué es rentable? (El valor para Farmaenlace)

SMARTCURE ataca directamente la última línea del estado de resultados (utilidad neta) por las siguientes razones:

1. **Evita la Canibalización de Márgenes:** Darle una promoción 3x2 a un paciente crónico que igual iba a comprar su medicina es botar plata a la basura. Al usar A/B testing y segmentación, la IA reserva los descuentos agresivos *solo* para los productos y clientes que necesitan un empujón para convertir.
2. **Eficiencia en la Inversión Promocional:** Al limitar a 2 impactos mensuales por cliente, nos aseguramos de que el mensaje sea tan certero que el Retorno de Inversión (ROI) de la campaña se maximice. Cuesta menos enviar mensajes, y los que se envían, convierten más.
3. **Rentabiliza el "Long Tail" (Compras Únicas):** Al transformar a los compradores esporádicos (que representan hasta el 80% en marcas nuevas como Wellderma[cite: 26, 59]) en clientes recurrentes multimarca, se disminuye el Costo de Adquisición de Clientes (CAC) y sube el ticket promedio (que en clientes SmartClub ya demuestra ser hasta el doble que un cliente normal).
4. **Monetización Inteligente:** La infraestructura de A/B Testing permite a Farmaenlace "vender" espacios hipersegmentados a laboratorios. Un laboratorio lanza un nuevo suplemento y Farmaenlace puede cobrar por correr un A/B test específico al segmento "Buscador de Bienestar".