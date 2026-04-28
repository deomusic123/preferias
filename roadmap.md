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
