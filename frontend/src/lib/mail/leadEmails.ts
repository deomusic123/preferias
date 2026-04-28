import type { LeadData } from "@/lib/schemas/lead";
import type { MailjetOutboundEmail } from "@/lib/mail/mailjet";

export type LeadRequestMetadata = {
  submittedAtIso: string;
  ipAddress: string;
  userAgent: string;
  referer: string;
};

type LeadField = {
  label: string;
  value: string;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizeString(value: string): string {
  const normalized = value.trim();

  if (normalized.length === 0) {
    return "No informado";
  }

  return normalized;
}

function normalizeArray(values: string[]): string {
  const cleanedValues = values.map((item) => item.trim()).filter((item) => item.length > 0);

  if (cleanedValues.length === 0) {
    return "No informado";
  }

  return cleanedValues.join(", ");
}

function getLeadCommonFields(lead: LeadData): LeadField[] {
  return [
    { label: "Tipo de lead", value: lead.tipoUsuario },
    { label: "Nombre", value: `${lead.nombre} ${lead.apellido}` },
    { label: "Empresa", value: lead.empresa },
    { label: "Email", value: lead.email },
    { label: "Telefono", value: lead.telefono },
    { label: "Pais de contacto", value: lead.paisContacto },
    { label: "Cargo", value: lead.cargo },
    { label: "Mensaje", value: lead.mensaje || "No informado" },
    { label: "UTM Source", value: lead.utmSource || "No informado" },
    { label: "UTM Medium", value: lead.utmMedium || "No informado" },
    { label: "UTM Campaign", value: lead.utmCampaign || "No informado" },
    { label: "Consentimiento", value: lead.consentimiento ? "Aceptado" : "No" },
  ];
}

function getLeadSpecificFields(lead: LeadData): LeadField[] {
  if (lead.tipoUsuario === "productor") {
    return [
      { label: "Rubro", value: lead.rubro },
      { label: "Subrubro", value: lead.subrubro },
      { label: "Pais de operacion", value: lead.paisOperacion },
      { label: "Ciudad", value: lead.ciudadOperacion },
      { label: "Exporta actualmente", value: lead.exportaActualmente },
      { label: "Cantidad de produccion", value: lead.cantidadProduccion },
      { label: "Capacidad de produccion", value: lead.capacidadProduccion },
      { label: "Certificaciones", value: lead.certificaciones },
      { label: "Mercados de interes", value: normalizeArray(lead.mercadosInteres) },
      { label: "Obstaculo principal", value: lead.obstaculoPrincipal },
    ];
  }

  return [
    { label: "Area de interes", value: lead.areaInteres },
    { label: "Rango de inversion", value: lead.rangoInversion },
    { label: "Pais objetivo", value: lead.paisObjetivo },
    { label: "Horizonte de inversion", value: lead.horizonteInversion },
    { label: "Tipo de participacion", value: lead.tipoParticipacion },
    { label: "Experiencia previa", value: lead.experienciaPrevia },
    { label: "Nivel de riesgo", value: lead.nivelRiesgo },
    { label: "Objetivo esperado", value: lead.objetivoEsperado },
  ];
}

function renderHtmlRows(fields: LeadField[]): string {
  return fields
    .map(
      (field) => `
      <tr>
        <td style="padding:10px 12px;border:1px solid #d9dee7;background:#f9fafb;font-weight:600;width:34%;">${escapeHtml(field.label)}</td>
        <td style="padding:10px 12px;border:1px solid #d9dee7;">${escapeHtml(normalizeString(field.value))}</td>
      </tr>`,
    )
    .join("");
}

function renderTextRows(fields: LeadField[]): string {
  return fields.map((field) => `${field.label}: ${normalizeString(field.value)}`).join("\n");
}

function getLeadSummaryFields(lead: LeadData): LeadField[] {
  if (lead.tipoUsuario === "productor") {
    return [
      { label: "Perfil", value: "Productor" },
      { label: "Rubro", value: lead.rubro },
      { label: "Pais de operacion", value: lead.paisOperacion },
      { label: "Mercados de interes", value: normalizeArray(lead.mercadosInteres) },
    ];
  }

  return [
    { label: "Perfil", value: "Inversor" },
    { label: "Area de interes", value: lead.areaInteres },
    { label: "Rango de inversion", value: lead.rangoInversion },
    { label: "Pais objetivo", value: lead.paisObjetivo },
  ];
}

export function buildInternalLeadEmail(
  lead: LeadData,
  metadata: LeadRequestMetadata,
  inboxEmail: string,
): MailjetOutboundEmail {
  const allFields: LeadField[] = [
    ...getLeadCommonFields(lead),
    ...getLeadSpecificFields(lead),
    { label: "Fecha de envio", value: metadata.submittedAtIso },
    { label: "IP", value: metadata.ipAddress },
    { label: "User Agent", value: metadata.userAgent },
    { label: "Referer", value: metadata.referer },
  ];

  const subject = `[Lead ${lead.tipoUsuario.toUpperCase()}] ${lead.nombre} ${lead.apellido} - ${lead.empresa}`;
  const textPart = `Nuevo lead recibido\n\n${renderTextRows(allFields)}`;

  const htmlPart = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#0f172a;line-height:1.45;">
      <h2 style="margin:0 0 14px;">Nuevo lead recibido</h2>
      <p style="margin:0 0 14px;">Se registro un nuevo ${escapeHtml(lead.tipoUsuario)} en el formulario web.</p>
      <table style="border-collapse:collapse;width:100%;max-width:840px;font-size:14px;">
        ${renderHtmlRows(allFields)}
      </table>
    </div>
  `;

  return {
    to: {
      email: inboxEmail,
      name: "Equipo comercial",
    },
    subject,
    textPart,
    htmlPart,
  };
}

export function buildLeadConfirmationEmail(lead: LeadData): MailjetOutboundEmail {
  const summaryFields = getLeadSummaryFields(lead);
  const subject =
    lead.tipoUsuario === "productor"
      ? "Recibimos tu solicitud de Productor | Alliance 2.0"
      : "Recibimos tu solicitud de Inversor | Alliance 2.0";

  const introText =
    lead.tipoUsuario === "productor"
      ? "Gracias por compartir tu perfil productivo. Nuestro equipo comercial lo esta revisando."
      : "Gracias por compartir tu perfil de inversion. Nuestro equipo comercial lo esta revisando.";

  const nextStepsText =
    "En un plazo maximo de 48 horas habiles te enviaremos una primera evaluacion y proximos pasos.";

  const textPart = [
    `Hola ${lead.nombre},`,
    "",
    introText,
    nextStepsText,
    "",
    "Resumen de tu solicitud:",
    renderTextRows(summaryFields),
    "",
    "Si necesitas actualizar datos, responde este correo.",
    "",
    "Equipo Alliance 2.0",
  ].join("\n");

  const htmlPart = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#0f172a;line-height:1.5;">
      <h2 style="margin:0 0 12px;">Hola ${escapeHtml(lead.nombre)},</h2>
      <p style="margin:0 0 10px;">${escapeHtml(introText)}</p>
      <p style="margin:0 0 16px;">${escapeHtml(nextStepsText)}</p>
      <table style="border-collapse:collapse;width:100%;max-width:680px;font-size:14px;margin-bottom:16px;">
        ${renderHtmlRows(summaryFields)}
      </table>
      <p style="margin:0;">Si necesitas actualizar datos, responde este correo.</p>
      <p style="margin:10px 0 0;">Equipo Alliance 2.0</p>
    </div>
  `;

  return {
    to: {
      email: lead.email,
      name: `${lead.nombre} ${lead.apellido}`.trim(),
    },
    subject,
    textPart,
    htmlPart,
  };
}
