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

function renderLeadClientSummaryRows(fields: LeadField[]): string {
  return fields
    .map(
      (field) => `
      <tr>
        <td style="padding:12px 14px;border:1px solid #263246;background:#101a2b;width:40%;font-size:12px;letter-spacing:0.03em;text-transform:uppercase;font-weight:700;color:#8aa1c5;">
          ${escapeHtml(field.label)}
        </td>
        <td style="padding:12px 14px;border:1px solid #263246;background:#0e1624;font-size:14px;font-weight:600;color:#f3f4f6;">
          ${escapeHtml(normalizeString(field.value))}
        </td>
      </tr>`,
    )
    .join("");
}

function renderLeadInternalRows(fields: LeadField[]): string {
  return fields
    .map(
      (field) => `
      <tr>
        <td style="padding:11px 13px;border:1px solid #dde3ed;background:#f4f7fc;width:36%;font-size:12px;letter-spacing:0.03em;text-transform:uppercase;font-weight:700;color:#475569;">
          ${escapeHtml(field.label)}
        </td>
        <td style="padding:11px 13px;border:1px solid #dde3ed;background:#ffffff;font-size:14px;color:#0f172a;font-weight:600;">
          ${escapeHtml(normalizeString(field.value))}
        </td>
      </tr>`,
    )
    .join("");
}

function getLeadMetadataFields(metadata: LeadRequestMetadata): LeadField[] {
  return [
    { label: "Fecha de envio", value: metadata.submittedAtIso },
    { label: "IP", value: metadata.ipAddress },
    { label: "User Agent", value: metadata.userAgent },
    { label: "Referer", value: metadata.referer },
  ];
}

function getLeadProfileLabel(lead: LeadData): string {
  return lead.tipoUsuario === "productor" ? "Perfil Productor" : "Perfil Inversor";
}

function getLeadIntroText(lead: LeadData): string {
  if (lead.tipoUsuario === "productor") {
    return "Gracias por compartir tu capacidad productiva y objetivos de expansion comercial.";
  }

  return "Gracias por compartir tu perfil de inversion y foco estrategico.";
}

function getLeadNextStepText(lead: LeadData): string {
  if (lead.tipoUsuario === "productor") {
    return "Nuestro equipo evaluara tu perfil y preparara una hoja de ruta comercial inicial para potenciales convenios internacionales.";
  }

  return "Nuestro equipo evaluara tu perfil y preparara una hoja de ruta inicial con oportunidades alineadas a tu rango y horizonte de inversion.";
}

export function buildInternalLeadEmail(
  lead: LeadData,
  metadata: LeadRequestMetadata,
  inboxEmail: string,
): MailjetOutboundEmail {
  const commonFields = getLeadCommonFields(lead);
  const specificFields = getLeadSpecificFields(lead);
  const metadataFields = getLeadMetadataFields(metadata);
  const leadProfile = getLeadProfileLabel(lead);
  const leadFullName = `${lead.nombre} ${lead.apellido}`.trim();
  const subject = `[Lead ${lead.tipoUsuario.toUpperCase()}] ${leadFullName} - ${lead.empresa}`;
  const replyMailHref = `mailto:${encodeURIComponent(lead.email)}?subject=${encodeURIComponent("Alliance 2.0 - Seguimiento comercial")}`;
  const phoneHrefValue = lead.telefono.replace(/[^+\d]/g, "");
  const phoneHref = `tel:${phoneHrefValue.length > 0 ? phoneHrefValue : lead.telefono}`;
  const safeLeadName = escapeHtml(leadFullName);
  const safeLeadCompany = escapeHtml(lead.empresa);
  const safeLeadProfile = escapeHtml(leadProfile);
  const safeLeadEmail = escapeHtml(lead.email);
  const safeLeadPhone = escapeHtml(lead.telefono);

  const textPart = [
    "Nuevo lead recibido",
    "",
    `Perfil: ${leadProfile}`,
    `Lead: ${leadFullName}`,
    `Empresa: ${lead.empresa}`,
    `Email: ${lead.email}`,
    `Telefono: ${lead.telefono}`,
    "",
    "--- Datos generales ---",
    renderTextRows(commonFields),
    "",
    `--- ${leadProfile} - Detalle ---`,
    renderTextRows(specificFields),
    "",
    "--- Trazabilidad tecnica ---",
    renderTextRows(metadataFields),
  ].join("\n");

  const htmlPart = `
    <div style="margin:0;padding:0;background:#eef3fb;font-family:Arial,Helvetica,sans-serif;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#eef3fb;">
        <tr>
          <td align="center" style="padding:26px 12px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:780px;border:1px solid #d3dce8;border-radius:16px;overflow:hidden;background:#ffffff;">
              <tr>
                <td style="padding:20px 24px;background:linear-gradient(120deg,#0b0f19 0%,#13243f 100%);border-bottom:1px solid #22324f;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td valign="middle">
                        <img src="https://ceapargentina.com/ceap-white.png" width="128" alt="CEAP" style="display:block;border:0;outline:none;text-decoration:none;height:auto;max-width:128px;" />
                      </td>
                      <td align="right" valign="middle" style="font-size:11px;letter-spacing:0.05em;text-transform:uppercase;color:#95afcf;font-weight:700;">
                        Nuevo lead comercial
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td style="padding:20px 24px 8px;">
                  <span style="display:inline-block;padding:6px 10px;border-radius:999px;background:#e9f4ff;border:1px solid #b7d9ff;font-size:11px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:#1d4d89;">
                    ${safeLeadProfile}
                  </span>
                  <h2 style="margin:12px 0 0;font-size:24px;line-height:1.25;color:#0f172a;font-weight:800;">
                    ${safeLeadName}
                  </h2>
                  <p style="margin:6px 0 0;font-size:14px;color:#334155;font-weight:600;">
                    ${safeLeadCompany}
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding:10px 24px 0;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="border-radius:999px;background:#00e5ff;">
                        <a href="${replyMailHref}" style="display:inline-block;padding:11px 18px;font-size:12px;font-weight:800;letter-spacing:0.02em;color:#03141d;text-decoration:none;">
                          Responder lead
                        </a>
                      </td>
                      <td style="width:10px;">&nbsp;</td>
                      <td style="border-radius:999px;background:#0f172a;">
                        <a href="${phoneHref}" style="display:inline-block;padding:11px 18px;font-size:12px;font-weight:800;letter-spacing:0.02em;color:#f8fafc;text-decoration:none;">
                          Llamar ${safeLeadPhone}
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td style="padding:18px 24px 0;font-size:14px;color:#334155;line-height:1.55;">
                  <strong style="color:#0f172a;">Contacto principal:</strong>
                  <a href="mailto:${escapeHtml(lead.email)}" style="color:#0069b4;text-decoration:none;"> ${safeLeadEmail}</a>
                </td>
              </tr>

              <tr>
                <td style="padding:20px 24px 0;">
                  <h3 style="margin:0 0 10px;font-size:15px;line-height:1.3;color:#0f172a;font-weight:800;letter-spacing:0.02em;text-transform:uppercase;">Datos generales</h3>
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
                    ${renderLeadInternalRows(commonFields)}
                  </table>
                </td>
              </tr>

              <tr>
                <td style="padding:20px 24px 0;">
                  <h3 style="margin:0 0 10px;font-size:15px;line-height:1.3;color:#0f172a;font-weight:800;letter-spacing:0.02em;text-transform:uppercase;">${safeLeadProfile} - Detalle</h3>
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
                    ${renderLeadInternalRows(specificFields)}
                  </table>
                </td>
              </tr>

              <tr>
                <td style="padding:20px 24px 24px;">
                  <h3 style="margin:0 0 10px;font-size:15px;line-height:1.3;color:#0f172a;font-weight:800;letter-spacing:0.02em;text-transform:uppercase;">Trazabilidad tecnica</h3>
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
                    ${renderLeadInternalRows(metadataFields)}
                  </table>
                </td>
              </tr>

              <tr>
                <td style="padding:12px 24px;background:#f8fafc;border-top:1px solid #d9e2ef;font-size:11px;line-height:1.55;color:#64748b;">
                  Generado automaticamente desde ceapargentina.com · Alliance 2.0
                </td>
              </tr>
            </table>
          </td>
        </tr>
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

  const introText = getLeadIntroText(lead);
  const nextStepText = getLeadNextStepText(lead);
  const profileLabel = getLeadProfileLabel(lead);
  const ctaUrl = "https://ceapargentina.com";
  const supportEmail = "ceapargentina@proton.me";
  const firstName = escapeHtml(lead.nombre);
  const safeProfileLabel = escapeHtml(profileLabel);
  const summaryRows = renderLeadClientSummaryRows(summaryFields);

  const textPart = [
    `Hola ${lead.nombre},`,
    "",
    introText,
    nextStepText,
    "En un plazo maximo de 48 horas habiles recibirias una respuesta inicial de nuestro equipo.",
    "",
    "Resumen de tu solicitud:",
    renderTextRows(summaryFields),
    "",
    `Si necesitas actualizar datos, escribe a ${supportEmail}.`,
    "",
    "Equipo Alliance 2.0",
  ].join("\n");

  const htmlPart = `
    <div style="margin:0;padding:0;background:#070c14;font-family:Arial,Helvetica,sans-serif;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#070c14;">
        <tr>
          <td align="center" style="padding:26px 12px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:680px;border:1px solid #22304a;border-radius:18px;overflow:hidden;background:#0b0f19;">
              <tr>
                <td style="padding:22px 24px;background:linear-gradient(120deg,#0b0f19 0%,#10203a 100%);border-bottom:1px solid #23324d;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td valign="middle">
                        <img src="https://ceapargentina.com/ceap-white.png" width="132" alt="CEAP" style="display:block;border:0;outline:none;text-decoration:none;height:auto;max-width:132px;" />
                      </td>
                      <td align="right" valign="middle" style="font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:#8aa1c5;font-weight:700;">
                        Alliance 2.0
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td style="padding:24px 24px 6px;">
                  <span style="display:inline-block;padding:6px 10px;border-radius:999px;background:#10233f;border:1px solid #2a4470;font-size:11px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#8fd9ff;">
                    ${safeProfileLabel}
                  </span>
                  <h2 style="margin:14px 0 0;font-size:28px;line-height:1.2;color:#f3f4f6;font-weight:700;">
                    Hola ${firstName}, recibimos tu solicitud.
                  </h2>
                </td>
              </tr>

              <tr>
                <td style="padding:12px 24px 0;font-size:15px;line-height:1.6;color:#c9d4e6;">
                  <p style="margin:0 0 10px;">${escapeHtml(introText)}</p>
                  <p style="margin:0;">${escapeHtml(nextStepText)}</p>
                </td>
              </tr>

              <tr>
                <td style="padding:18px 24px 0;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid #2f4b74;border-radius:12px;background:#0d1f36;">
                    <tr>
                      <td style="padding:14px 16px;font-size:13px;line-height:1.55;color:#d4e7ff;">
                        <strong style="display:block;margin-bottom:6px;font-size:13px;letter-spacing:0.04em;text-transform:uppercase;color:#00e5ff;">Proximo paso</strong>
                        Dentro de las proximas 48 horas habiles te enviaremos una respuesta inicial de nuestro equipo comercial.
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td style="padding:22px 24px 0;">
                  <h3 style="margin:0 0 10px;font-size:16px;line-height:1.3;color:#f3f4f6;font-weight:700;">Resumen de tu solicitud</h3>
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
                    ${summaryRows}
                  </table>
                </td>
              </tr>

              <tr>
                <td style="padding:24px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="border-radius:999px;background:#00e5ff;">
                        <a href="${ctaUrl}" style="display:inline-block;padding:12px 20px;font-size:13px;font-weight:700;letter-spacing:0.02em;color:#03141d;text-decoration:none;">
                          Ver sitio oficial
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td style="padding:0 24px 24px;font-size:13px;line-height:1.55;color:#9eb0cb;">
                  Si deseas actualizar informacion o sumar contexto adicional, responde este correo o escribe a
                  <a href="mailto:${supportEmail}" style="color:#00e5ff;text-decoration:none;">${supportEmail}</a>.
                </td>
              </tr>

              <tr>
                <td style="padding:14px 24px;background:#0a1220;border-top:1px solid #1f2b43;font-size:11px;line-height:1.5;color:#6f819c;">
                  CEAP Argentina · Plataforma B2B para convenios internacionales de comercio exterior.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
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
