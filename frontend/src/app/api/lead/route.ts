import { NextResponse } from "next/server";
import { leadSchema, sanitizeLeadPayload } from "@/lib/schemas/lead";

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

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

  if (!N8N_WEBHOOK_URL) {
    return NextResponse.json(
      {
        ok: true,
        queued: false,
        message: "Webhook pendiente de configuración en entorno.",
      },
      { status: 202 },
    );
  }

  try {
    const webhookResponse = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sanitizedPayload),
      cache: "no-store",
    });

    if (!webhookResponse.ok) {
      const responseText = await webhookResponse.text();

      return NextResponse.json(
        {
          message: "No se pudo procesar el lead en n8n.",
          detail: responseText.slice(0, 400),
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      {
        message: "Error de conexión con la automatización.",
      },
      { status: 502 },
    );
  }
}
