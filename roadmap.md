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
