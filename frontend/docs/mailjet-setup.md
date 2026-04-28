# Mailjet setup (Lead API)

Esta guia configura el flujo completo de correos para leads Productor/Inversor usando la API actual en `src/app/api/lead/route.ts`.

## 1. Crear y preparar cuenta Mailjet

1. Crear API Key y Secret en Mailjet (Account Settings -> REST API).
2. Verificar dominio o remitente para `MAILJET_FROM_EMAIL`.
3. Configurar SPF, DKIM y DMARC en DNS para buena entregabilidad.

### Recomendacion critica de entregabilidad

- No usar como `MAILJET_FROM_EMAIL` un dominio de tercero (ej: `@proton.me`, `@gmail.com`).
- Usar un remitente de dominio propio autenticado en Mailjet (ej: `noreply@ceapargentina.com`).
- Si quieres recibir respuestas en otra casilla, usar `MAILJET_REPLY_TO_EMAIL`.

## 2. Configurar variables en Vercel

Agregar estas variables en el proyecto de Vercel:

- `MAILJET_API_KEY`
- `MAILJET_API_SECRET`
- `MAILJET_FROM_EMAIL`
- `MAILJET_FROM_NAME` (ej. `Alliance 2.0`)
- `LEAD_INBOX_EMAIL` (casilla que recibe la ficha completa del lead)
- `MAILJET_REPLY_TO_EMAIL` (opcional)
- `MAILJET_REPLY_TO_NAME` (opcional)
- `MAILJET_EVENTS_SECRET` (opcional, recomendado)

Referencia local: `.env.example`.

## 3. Flujo que queda activo

1. El formulario envia a `POST /api/lead`.
2. Se valida con Zod y se sanitiza el payload.
3. Si pasa validacion:
   - Se envia un correo interno a `LEAD_INBOX_EMAIL` con toda la ficha.
   - Se envia un correo de confirmacion al lead.
4. Si falla correo interno, la API responde error (para no perder alertas comerciales).
5. Si falla correo de confirmacion al lead, la API responde `ok: true` y lo deja logueado en servidor.

## 4. Plantillas personalizadas (ya incluidas en codigo)

Las plantillas que usa Mailjet se generan desde:

- `src/lib/mail/leadEmails.ts`

Correos implementados:

- Confirmacion Productor
- Confirmacion Inversor
- Notificacion interna con detalle completo del lead

## 5. Campos que llega en la notificacion interna

- Datos comunes: nombre, apellido, empresa, email, telefono, pais, cargo, mensaje
- Datos especificos segun perfil (productor/inversor)
- UTM source, medium, campaign
- Metadata tecnica: fecha ISO, IP, user-agent, referer

## 6. Prueba recomendada (end-to-end)

1. Deploy con variables cargadas en Vercel.
2. Enviar un lead Productor de prueba.
3. Verificar:
   - Llegada a `LEAD_INBOX_EMAIL`
   - Llegada al correo del lead
4. Repetir con lead Inversor.
5. Revisar logs de Vercel si hay error de credenciales o remitente.

## 7. Diagnostico de entrega con Event API (recomendado)

Se implemento un endpoint receptor de eventos:

- `POST /api/mailjet/events`

Configuracion sugerida en Mailjet (Event API):

1. URL del webhook: `https://TU_DOMINIO/api/mailjet/events?token=TU_TOKEN`
2. En Vercel, setear `MAILJET_EVENTS_SECRET=TU_TOKEN`.
3. Activar eventos: sent, bounce, blocked, deferred, spam, unsub.

Los eventos quedan en logs de Vercel y permiten detectar por que un correo no llega a inbox.
