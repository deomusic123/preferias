import { NextResponse } from "next/server";
import {
  buildInternalLeadEmail,
  buildLeadConfirmationEmail,
  type LeadRequestMetadata,
} from "@/lib/mail/leadEmails";
import { getMailjetConfigurationFromEnv, sendMailjetEmail } from "@/lib/mail/mailjet";
import { leadSchema, sanitizeLeadPayload } from "@/lib/schemas/lead";

export const runtime = "nodejs";

function resolveClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    const [firstIp] = forwardedFor.split(",");

    if (firstIp && firstIp.trim().length > 0) {
      return firstIp.trim();
    }
  }

  const realIp = request.headers.get("x-real-ip");

  if (realIp && realIp.trim().length > 0) {
    return realIp.trim();
  }

  return "No disponible";
}

function getLeadRequestMetadata(request: Request): LeadRequestMetadata {
  return {
    submittedAtIso: new Date().toISOString(),
    ipAddress: resolveClientIp(request),
    userAgent: request.headers.get("user-agent")?.trim() || "No disponible",
    referer: request.headers.get("referer")?.trim() || "No disponible",
  };
}

export async function POST(request: Request): Promise<Response> {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Payload inválido" }, { status: 400 });
  }

  const parsedPayload = leadSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return NextResponse.json(
      {
        message: "Datos inválidos",
        issues: parsedPayload.error.flatten(),
      },
      { status: 422 },
    );
  }

  const sanitizedPayload = sanitizeLeadPayload(parsedPayload.data);

  if (sanitizedPayload.honeypot && sanitizedPayload.honeypot.length > 0) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const mailjetConfigResult = getMailjetConfigurationFromEnv();

  if (!mailjetConfigResult.ok) {
    return NextResponse.json(
      {
        message: "Mailjet no esta configurado en entorno.",
        missingEnv: mailjetConfigResult.missingKeys,
      },
      { status: 503 },
    );
  }

  const mailjetConfig = mailjetConfigResult.config;
  const leadRequestMetadata = getLeadRequestMetadata(request);

  try {
    const internalLeadEmail = buildInternalLeadEmail(
      sanitizedPayload,
      leadRequestMetadata,
      mailjetConfig.leadInboxEmail,
    );

    await sendMailjetEmail(mailjetConfig, internalLeadEmail);
  } catch (error) {
    return NextResponse.json(
      {
        message: "No se pudo enviar la notificacion interna del lead.",
        detail: error instanceof Error ? error.message.slice(0, 400) : "Error desconocido",
      },
      { status: 502 },
    );
  }

  let confirmationSent = true;

  try {
    const leadConfirmationEmail = buildLeadConfirmationEmail(sanitizedPayload);
    await sendMailjetEmail(mailjetConfig, leadConfirmationEmail);
  } catch (error) {
    confirmationSent = false;

    console.error("Mailjet confirmation email failed", {
      detail: error instanceof Error ? error.message : "Unknown error",
      leadType: sanitizedPayload.tipoUsuario,
      email: sanitizedPayload.email,
    });
  }

  if (!confirmationSent) {
    return NextResponse.json(
      {
        ok: true,
        confirmationSent: false,
        message: "Lead recibido. El equipo fue notificado, pero fallo el correo de confirmacion.",
      },
      { status: 200 },
    );
  }

  return NextResponse.json({ ok: true, confirmationSent: true }, { status: 200 });
}
