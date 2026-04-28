# Documentación General del Proyecto
## Proyecto Turquesa Negro
### Nombre interno

**Versión:** 1.1  
**Estado:** Definición de producto y preparación de MVP funcional

## 1. Resumen ejecutivo

Turquesa Negro es una plataforma B2B internacional orientada a la generación de leads, la calificación comercial y la creación de oportunidades de comex. El proyecto conecta productores e inversores con servicios, convenios y estructuras que facilitan operaciones de exportación y alianzas comerciales.

El inicio operativo está enfocado en Chile y Argentina, pero la visión es global.

## 2. Objetivo principal

- Generar la mayor cantidad posible de leads.
- Convertir leads en clientes reales.
- Calificar productores e inversores con precisión.
- Centralizar conversaciones y automatizaciones.
- Construir una base sólida para expansión internacional.

## 3. Segmentos objetivo

### Productores

- Agro
- Ganadería
- Minería
- Metalurgia
- Tecnología
- Industria manufacturera
- Servicios exportables
- Otros rubros productivos con capacidad comercial internacional

### Inversores

- Capital privado
- Inversión productiva
- Inversión en comercio exterior
- Inversión en cadenas de valor
- Fondos, family offices y socios estratégicos
- Inversores locales e internacionales

## 4. Propuesta de valor

- Acceso a convenios internacionales de comex.
- Acompañamiento para estructurar exportaciones y operaciones comerciales.
- Conexión entre productores, inversores y oportunidades reales.
- Calificación de leads para priorizar contactos con potencial.
- Imagen corporativa premium, seria y confiable.

## 5. Alcance del MVP

El MVP debe ser funcional, profesional y comercialmente útil. La prioridad es que salga al mejor nivel real posible, sin agregar complejidad innecesaria.

### Incluye

- Landing page principal.
- Formulario multi-step de calificación.
- Mapa interactivo funcional.
- Sección de autoridad o confianza.
- Lead magnet o CTA fuerte.
- Thank you page.
- Footer legal.
- Integración con Chatwoot.
- Automatizaciones con n8n.
- Envío de emails.
- Base lista para SEO y analítica.

### No incluye en esta primera versión

- VSL o video principal.
- Backend pesado.
- Panel administrativo complejo.
- Animaciones excesivas.
- Automatizaciones multicanal si no son necesarias al inicio.

## 6. Arquitectura técnica recomendada

- Frontend: Next.js.
- Lenguaje: TypeScript.
- Estilos: Tailwind CSS.
- Animaciones: Framer Motion, con uso moderado y elegante.
- Formularios: React Hook Form + Zod.
- Mapa: React Simple Maps para el MVP; evaluar MapLibre o Mapbox solo si el nivel cartográfico lo exige.
- UI accesible: Radix UI para popovers, dialogs y componentes interactivos.
- Automatización: n8n.
- Inbox y relación comercial: Chatwoot.
- Email transaccional: recomendado Resend o proveedor equivalente.
- Hosting: Vercel.
- Persistencia de datos: recomendable añadir una base ligera si se necesita trazabilidad sólida de leads.

## 7. Identidad visual

La marca debe sentirse:

- Corporativa.
- Premium.
- Seria.
- Internacional.
- Confiable.
- Tecnológica, pero sin verse fría.

### Paleta sugerida

- Fondo principal: #0B0F19
- Acento primario: #00E5FF
- Acento secundario: #D4AF37
- Texto principal: #F3F4F6
- Texto secundario: #9CA3AF

### Tipografía

- Titulares: Montserrat o Satoshi.
- Cuerpo: Inter.

### Estilo visual

- Fondo oscuro.
- Tarjetas limpias con glassmorphism sutil.
- Bordes suaves.
- Contraste alto.
- Espaciado generoso.
- Microinteracciones discretas y elegantes.

## 8. Estructura de la landing

1. Hero principal sin video.
2. Barra de confianza con logos.
3. Sección de valor.
4. Mapa interactivo.
5. Lead magnet o bloque de conversión.
6. Formulario multi-step.
7. Cierre con CTA.
8. Footer legal.

### Hero

- Mensaje claro y directo.
- CTA principal visible.
- CTA secundario opcional.
- Sin VSL.
- Visual premium estático o ilustración abstracta.

### Barra de confianza

- Logos en escala de grises.
- Animación sutil o carrusel ligero.
- Imágenes optimizadas en SVG o WebP.

### Sección de valor

- Grid de tarjetas.
- Beneficios concretos.
- Lenguaje comercial claro.
- Sin texto de relleno.

### Mapa interactivo

- Chile y Argentina como foco inicial.
- Marcadores en regiones relevantes.
- Tooltips o popovers accesibles.
- Comportamiento táctil en móvil.

### Lead magnet

- Puede ser una guía, diagnóstico, auditoría o invitación a evaluación.
- Debe funcionar como empuje de conversión.
- Ideal con un CTA fuerte y medible.

### Formulario

- Debe calificar sin fricción excesiva.
- Debe separar productor e inversor.
- Debe evitar spam.

## 9. Lógica del formulario

### Paso 1

Elegir tipo de usuario:

- Productor
- Inversor

### Paso 2

Campos dinámicos según el perfil.

#### Productor

- Rubro.
- Subrubro.
- País.
- Ciudad.
- Exporta actualmente.
- Cantidad de producción.
- Capacidad mensual o anual.
- Certificaciones.
- Mercados de interés.
- Principal obstáculo.

#### Inversor

- Área de interés.
- Rango de inversión.
- País de interés.
- Horizonte de inversión.
- Tipo de participación.
- Experiencia previa.
- Nivel de riesgo.
- Objetivo esperado.

### Paso 3

Datos personales y de empresa:

- Nombre.
- Apellido.
- Empresa.
- Email.
- Teléfono.
- País.
- Cargo.
- Mensaje opcional.
- Consentimiento.

### Seguridad y calidad

- Validación en tiempo real con Zod.
- Honeypot anti bots.
- Validación en servidor.
- Control de envíos duplicados.
- Tracking de fuente y UTM si está disponible.

## 10. Flujo de datos

1. El usuario completa el formulario.
2. El frontend valida la información.
3. Se envía un payload seguro al backend de Next.js.
4. Next.js reenvía el lead a n8n.
5. n8n clasifica el lead por tipo.
6. Se crea o actualiza el contacto en Chatwoot.
7. Se envía un email automático.
8. Se registra la conversión.
9. El usuario aterriza en la thank you page.

### Rutas de automatización

#### Productor

- Crear contacto.
- Etiquetar como productor.
- Enviar email de confirmación.
- Notificar al equipo comercial.

#### Inversor

- Crear contacto.
- Etiquetar como inversor.
- Enviar email de seguimiento.
- Notificar al equipo de ventas o dirección.

## 11. Mapa interactivo

El mapa debe ser realmente funcional, no decorativo.

### Requisitos

- Renderizar zonas o puntos relevantes.
- Mostrar Santa Fe, Mendoza y otras ubicaciones clave.
- Tooltips con información contextual.
- Funcionamiento correcto en escritorio y móvil.
- Carga eficiente y diferida.

### Datos

- Definir una fuente GeoJSON confiable.
- Mantener una estructura fácil de ampliar.
- Dejar listo para sumar más países después.

## 12. SEO y rendimiento

- SSR o SSG según la sección.
- Precarga de fuentes.
- Imágenes optimizadas.
- Dimensiones fijas para evitar CLS.
- Metadata completa.
- Open Graph y Twitter cards.
- URLs limpias.
- Buen rendimiento móvil.
- Accesibilidad base.

## 13. Analítica y medición

Aún no hay acceso a GTM o Meta Pixel, por lo tanto el MVP debe quedar preparado para integrarlos después.

### Eventos deseados

- Visita al hero.
- Click en CTA principal.
- Interacción con el mapa.
- Scroll hasta lead magnet.
- Inicio de formulario.
- Paso completado.
- Envío final.
- Visita a la thank you page.

### KPI principales

- Tasa de conversión.
- Tasa de completado del formulario.
- Cantidad de leads calificados.
- Tiempo de respuesta.
- Conversión por segmento.
- Interacción con el mapa.

## 14. Legal y cumplimiento

Se necesitan textos y decisiones legales antes de publicar con una operación internacional seria.

### Piezas mínimas

- Política de privacidad.
- Términos y condiciones.
- Política de cookies.
- Consentimiento de tratamiento de datos.

### Preguntas que conviene hacer

- ¿Cuál es la razón social que aparecerá en los documentos?
- ¿En qué país se alojará la información de leads?
- ¿Qué proveedor procesa los datos?
- ¿Hay transferencia internacional de datos?
- ¿Cuánto tiempo se conservan los leads?
- ¿Se enviarán emails comerciales?
- ¿Se usarán WhatsApp, Slack u otros canales?
- ¿Hay restricciones por edad o jurisdicción?
- ¿Qué disclaimers legales necesita el servicio de comex?
- ¿Qué aclaraciones sobre inversión deben incluirse?

## 15. Decisiones abiertas

- Nombre comercial final.
- Proveedor de email definitivo.
- Si se usará base de datos propia o solo automatizaciones.
- Fuente exacta de datos del mapa.
- Texto final del hero y los CTAs.
- Textos legales.
- Prioridad de países después de Chile y Argentina.
- Si se suma Calendly u otra agenda en la thank you page.

## 16. Roadmap de implementación

### Fase 1: definición

- Cerrar propuesta de valor.
- Definir copy.
- Definir campos del formulario.
- Cerrar branding.

### Fase 2: diseño

- Sistema visual.
- Wireframe.
- Jerarquía de secciones.
- Versión responsive.

### Fase 3: desarrollo base

- Crear proyecto Next.js.
- Configurar Tailwind CSS.
- Construir layout.
- Crear componentes principales.

### Fase 4: conversión

- Formulario multi-step.
- Validación.
- n8n.
- Chatwoot.
- Email.
- Thank you page.

### Fase 5: mapa y refinamiento

- Integrar el mapa.
- Agregar popovers.
- Optimizar móvil.
- Mejorar microinteracciones.

### Fase 6: QA y lanzamiento

- Pruebas funcionales.
- Revisión legal.
- Revisión responsive.
- Revisión de performance.
- Despliegue en Vercel.

## 17. Criterios de éxito del MVP

- El sitio se ve premium y corporativo.
- El formulario funciona sin fricción.
- Los leads llegan correctamente a la operación.
- El mapa es usable en móvil y escritorio.
- El sitio carga rápido.
- Los datos se pueden rastrear.
- La landing convierte sin depender de video.

## 18. Próximo paso recomendado

Convertir este documento en un backlog técnico y comercial, con tareas ordenadas por prioridad para la construcción del MVP.