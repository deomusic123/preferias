# Roadmap

## Historial de ejecucion

### 2026-04-28 - Integracion Mailjet en API de leads

#### Objetivo
Implementar envio de correos transaccionales sin n8n para leads Productor/Inversor, con notificacion interna y confirmacion al lead.

#### Gates
- Gate 1: API valida y sanitiza payload antes de enviar correos.
- Gate 2: Notificacion interna se envia a casilla comercial con ficha completa del lead.
- Gate 3: Confirmacion al lead se personaliza por tipo de usuario.
- Gate 4: Configuracion de entorno y guia operativa documentadas.
- Gate 5: Build y lint exitosos para deploy.

#### Evidencia
- API extendida: `frontend/src/app/api/lead/route.ts`
- Cliente Mailjet: `frontend/src/lib/mail/mailjet.ts`
- Plantillas de correo: `frontend/src/lib/mail/leadEmails.ts`
- Variables de entorno: `frontend/.env.example`
- Guia operativa: `frontend/docs/mailjet-setup.md`
- Build OK: `npm run build`
- Lint OK con warning preexistente: `npm run lint`

### 2026-04-28 - Diagnostico entregabilidad Mailjet + Event API

#### Objetivo
Diagnosticar por que los correos no llegaban a inbox aunque la API devolvia exito, reforzar seguridad de entorno y habilitar trazabilidad de eventos de entrega.

#### Gates
- Gate 1: Verificar respuesta de la API de produccion `/api/lead`.
- Gate 2: Verificar aceptacion de envio en Mailjet API y estado del mensaje.
- Gate 3: Reforzar variables de entorno y eliminar secretos expuestos en archivo de ejemplo.
- Gate 4: Agregar endpoint de Event API para monitoreo de `delivered/bounce/blocked`.
- Gate 5: Actualizar guia operativa con recomendaciones de dominio remitente y Reply-To.

#### Evidencia
- Endpoint de eventos: `frontend/src/app/api/mailjet/events/route.ts`
- Soporte Reply-To: `frontend/src/lib/mail/mailjet.ts`
- Entorno saneado: `frontend/.env.example`
- Guia actualizada: `frontend/docs/mailjet-setup.md`

### 2026-04-28 - Rediseno premium del mail interno de ventas

#### Objetivo
Elevar la calidad visual y operativa del correo interno de leads para el equipo comercial, con branding CEAP, estructura por secciones y acciones rapidas.

#### Gates
- Gate 1: Redisenar template interno con estilo corporativo profesional.
- Gate 2: Mejorar legibilidad separando datos generales, detalle de perfil y trazabilidad tecnica.
- Gate 3: Agregar acciones rapidas para responder o llamar al lead desde el correo.
- Gate 4: Mantener compatibilidad con clientes de correo (HTML table-based + version texto).
- Gate 5: Validar build/lint y publicar en main.

#### Evidencia
- Template interno actualizado: `frontend/src/lib/mail/leadEmails.ts`
- Build OK: `npm run build`
- Lint OK con warning preexistente: `npm run lint`

### 2026-05-13 - Sprint SEO tecnico + contenido (Camara Argentina)

#### Objetivo
Fortalecer SEO tecnico y on-page para posicionamiento de CEAP en busquedas relacionadas con Camara Argentina y Camara de Empresarios.

#### Gates
- Gate 1: Metadata global y de home optimizada con enfoque de keyword principal.
- Gate 2: Robots y sitemap implementados para indexacion controlada.
- Gate 3: Datos estructurados (Organization, WebSite, FAQPage) en home.
- Gate 4: Contenido semantico reforzado (H1/H2/copy/FAQ) orientado a intencion de busqueda.
- Gate 5: Consistencia de marca SEO en paginas secundarias y validacion tecnica.

#### Evidencia
- Metadata global: `frontend/src/app/layout.tsx`
- Metadata home + JSON-LD: `frontend/src/app/page.tsx`
- Robots: `frontend/src/app/robots.ts`
- Sitemap: `frontend/src/app/sitemap.ts`
- FAQ SEO: `frontend/src/components/sections/SeoFaqSection.tsx`
- Hero y valor optimizados: `frontend/src/components/sections/HeroSection.tsx`, `frontend/src/components/sections/ValueSection.tsx`
- Consistencia de marca secundaria: `frontend/src/app/gracias/page.tsx`, `frontend/src/app/legal/privacidad/page.tsx`, `frontend/src/app/legal/terminos/page.tsx`, `frontend/src/app/legal/cookies/page.tsx`

### 2026-05-13 - Correccion institucional de naming CEAP

#### Objetivo
Unificar en toda la experiencia digital que CEAP significa "Camara Argentina de Empresarios del Pacífico" y eliminar variantes de marca inconsistentes.

#### Gates
- Gate 1: Ajustar metadata global y metadata de home con naming institucional.
- Gate 2: Ajustar copy clave en Hero, Value, FAQ y Footer.
- Gate 3: Ajustar naming en pagina de gracias y documentos legales.
- Gate 4: Eliminar referencias legacy de "Alliance 2.0" en correos Mailjet.
- Gate 5: Validar lint/build sin errores de compilacion.

#### Evidencia
- Metadata y schemas: `frontend/src/app/layout.tsx`, `frontend/src/app/page.tsx`
- Home content: `frontend/src/components/sections/HeroSection.tsx`, `frontend/src/components/sections/ValueSection.tsx`, `frontend/src/components/sections/SeoFaqSection.tsx`, `frontend/src/components/layout/SiteFooter.tsx`
- Nombre corporativo: `frontend/src/lib/constants.ts`
- Paginas secundarias: `frontend/src/app/gracias/page.tsx`, `frontend/src/app/legal/privacidad/page.tsx`, `frontend/src/app/legal/terminos/page.tsx`, `frontend/src/app/legal/cookies/page.tsx`
- Correos transaccionales: `frontend/src/lib/mail/leadEmails.ts`, `frontend/src/lib/mail/mailjet.ts`

### 2026-05-13 - Publicacion de cambios pendientes + FAQ al final

#### Objetivo
Publicar todos los cambios pendientes en `main` y dejar la seccion FAQ al final de la home, justo antes del footer.

#### Gates
- Gate 1: Validar lint y build de produccion antes de publicar.
- Gate 2: Ajustar orden de secciones para mover FAQ al final del contenido principal.
- Gate 3: Hacer push a `origin/main` para disparar deploy en Vercel.

#### Evidencia
- Orden de home actualizado: `frontend/src/app/page.tsx`
- Validacion tecnica: `npm run lint`, `npm run build`
