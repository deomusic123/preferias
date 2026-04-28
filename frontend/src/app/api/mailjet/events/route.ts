import { NextResponse } from "next/server";

export const runtime = "nodejs";

type MailjetWebhookEvent = Record<string, unknown>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function parseFormEncodedPayload(payload: string): Record<string, string> {
  const params = new URLSearchParams(payload);
  const parsed: Record<string, string> = {};

  for (const [key, value] of params.entries()) {
    parsed[key] = value;
  }

  return parsed;
}

async function parseWebhookPayload(request: Request): Promise<unknown> {
  const contentType = request.headers.get("content-type")?.toLowerCase() || "";

  if (contentType.includes("application/json")) {
    return request.json();
  }

  const rawPayload = await request.text();

  if (rawPayload.trim().length === 0) {
    return null;
  }

  if (contentType.includes("application/x-www-form-urlencoded")) {
    return parseFormEncodedPayload(rawPayload);
  }

  try {
    return JSON.parse(rawPayload);
  } catch {
    return parseFormEncodedPayload(rawPayload);
  }
}

function normalizeEvents(payload: unknown): MailjetWebhookEvent[] {
  if (Array.isArray(payload)) {
    return payload.filter((item): item is MailjetWebhookEvent => isRecord(item));
  }

  if (isRecord(payload)) {
    return [payload];
  }

  return [];
}

function getEventSummary(event: MailjetWebhookEvent): Record<string, unknown> {
  return {
    event: event.event ?? event.EventType ?? "unknown",
    email: event.email ?? event.Email ?? "unknown",
    messageId: event.MessageID ?? event.message_id ?? "unknown",
    time: event.time ?? event.Time ?? "unknown",
    reason: event.error ?? event.ErrorRelatedTo ?? event.comment ?? "",
  };
}

function getWebhookToken(request: Request): string {
  const requestUrl = new URL(request.url);
  return requestUrl.searchParams.get("token")?.trim() || "";
}

export async function POST(request: Request): Promise<Response> {
  const expectedToken = process.env.MAILJET_EVENTS_SECRET?.trim() || "";

  if (expectedToken.length > 0) {
    const providedToken = getWebhookToken(request);

    if (providedToken !== expectedToken) {
      return NextResponse.json({ message: "Invalid webhook token" }, { status: 401 });
    }
  }

  let payload: unknown;

  try {
    payload = await parseWebhookPayload(request);
  } catch {
    return NextResponse.json({ message: "Invalid webhook payload" }, { status: 400 });
  }

  const events = normalizeEvents(payload);

  if (events.length === 0) {
    return NextResponse.json({ message: "Webhook payload has no events" }, { status: 422 });
  }

  const summary = events.slice(0, 20).map(getEventSummary);

  console.info("Mailjet webhook events", {
    received: events.length,
    summary,
  });

  return NextResponse.json({ ok: true, received: events.length }, { status: 200 });
}
