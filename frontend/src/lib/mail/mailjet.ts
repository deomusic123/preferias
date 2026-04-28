type MailjetEnvironmentKey =
  | "MAILJET_API_KEY"
  | "MAILJET_API_SECRET"
  | "MAILJET_FROM_EMAIL"
  | "LEAD_INBOX_EMAIL";

const REQUIRED_MAILJET_ENV_KEYS: MailjetEnvironmentKey[] = [
  "MAILJET_API_KEY",
  "MAILJET_API_SECRET",
  "MAILJET_FROM_EMAIL",
  "LEAD_INBOX_EMAIL",
];

const MAILJET_API_URL = "https://api.mailjet.com/v3.1/send";

type MailjetRecipient = {
  email: string;
  name?: string;
};

export type MailjetOutboundEmail = {
  to: MailjetRecipient;
  subject: string;
  textPart: string;
  htmlPart: string;
};

export type MailjetConfiguration = {
  apiKey: string;
  apiSecret: string;
  fromEmail: string;
  fromName: string;
  leadInboxEmail: string;
  replyToEmail?: string;
  replyToName?: string;
};

type MailjetConfigResult =
  | {
      ok: true;
      config: MailjetConfiguration;
    }
  | {
      ok: false;
      missingKeys: MailjetEnvironmentKey[];
    };

type MailjetApiRecipient = {
  Email: string;
  Name?: string;
};

type MailjetApiMessage = {
  From: MailjetApiRecipient;
  To: MailjetApiRecipient[];
  ReplyTo?: MailjetApiRecipient;
  Subject: string;
  TextPart: string;
  HTMLPart: string;
};

type MailjetApiRequestBody = {
  Messages: MailjetApiMessage[];
};

function toApiRecipient(recipient: MailjetRecipient): MailjetApiRecipient {
  if (recipient.name && recipient.name.trim().length > 0) {
    return {
      Email: recipient.email,
      Name: recipient.name,
    };
  }

  return {
    Email: recipient.email,
  };
}

export function getMailjetConfigurationFromEnv(): MailjetConfigResult {
  const missingKeys = REQUIRED_MAILJET_ENV_KEYS.filter((key) => {
    const value = process.env[key];
    return !value || value.trim().length === 0;
  });

  if (missingKeys.length > 0) {
    return {
      ok: false,
      missingKeys,
    };
  }

  return {
    ok: true,
    config: {
      apiKey: process.env.MAILJET_API_KEY as string,
      apiSecret: process.env.MAILJET_API_SECRET as string,
      fromEmail: process.env.MAILJET_FROM_EMAIL as string,
      fromName: process.env.MAILJET_FROM_NAME?.trim() || "Alliance 2.0",
      leadInboxEmail: process.env.LEAD_INBOX_EMAIL as string,
      replyToEmail: process.env.MAILJET_REPLY_TO_EMAIL?.trim() || undefined,
      replyToName: process.env.MAILJET_REPLY_TO_NAME?.trim() || undefined,
    },
  };
}

export async function sendMailjetEmail(
  config: MailjetConfiguration,
  email: MailjetOutboundEmail,
): Promise<void> {
  const replyTo =
    config.replyToEmail && config.replyToEmail.length > 0
      ? {
          Email: config.replyToEmail,
          ...(config.replyToName && config.replyToName.length > 0
            ? { Name: config.replyToName }
            : {}),
        }
      : undefined;

  const payload: MailjetApiRequestBody = {
    Messages: [
      {
        From: {
          Email: config.fromEmail,
          Name: config.fromName,
        },
        To: [toApiRecipient(email.to)],
        ...(replyTo ? { ReplyTo: replyTo } : {}),
        Subject: email.subject,
        TextPart: email.textPart,
        HTMLPart: email.htmlPart,
      },
    ],
  };

  const authValue = Buffer.from(`${config.apiKey}:${config.apiSecret}`).toString("base64");

  const response = await fetch(MAILJET_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${authValue}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    const responseText = await response.text();
    const detail = responseText.slice(0, 700);

    throw new Error(`Mailjet API error (${response.status}): ${detail}`);
  }
}
