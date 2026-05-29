import ContactConfirmationEmail from "../../../emails/ContactConfirmationEmail";
import ContactInquiryEmail from "../../../emails/ContactInquiryEmail";
import { SITE_URL } from "@/config/site";
import { getResendClient, getResendConfig } from "@/lib/resend";

import type { ContactFormPayload } from "./contactSchema";
import { getServiceLabel } from "./getServiceLabel";

export type SendContactResult =
  | { ok: true }
  | { ok: false; code: "missing_api_key" | "resend_error"; message: string };

export async function sendContactSubmission(
  payload: ContactFormPayload,
): Promise<SendContactResult> {
  const resend = getResendClient();
  if (!resend) {
    return {
      ok: false,
      code: "missing_api_key",
      message: "RESEND_API_KEY no configurada",
    };
  }

  const config = getResendConfig();
  const submissionId = crypto.randomUUID();
  const serviceLabel = getServiceLabel(payload.service, payload.locale);
  const company = payload.company?.trim() || undefined;
  const submittedAt = new Date().toISOString();
  const isEn = payload.locale === "en";

  const confirmation = await resend.emails.send(
    {
      from: config.from,
      to: [payload.email],
      subject: isEn ? "We received your message" : "Recibimos tu mensaje",
      react: ContactConfirmationEmail({
        name: payload.name,
        serviceLabel,
        locale: payload.locale,
        siteUrl: SITE_URL,
      }),
    },
    { idempotencyKey: `contact-confirmation/${submissionId}` },
  );

  if (confirmation.error) {
    console.error("[resend] confirmation failed:", confirmation.error);
    return {
      ok: false,
      code: "resend_error",
      message: confirmation.error.message,
    };
  }

  const inquiry = await resend.emails.send(
    {
      from: config.from,
      to: [config.notifyEmail],
      replyTo: payload.email,
      subject: `Nueva consulta — ${payload.name}`,
      react: ContactInquiryEmail({
        name: payload.name,
        email: payload.email,
        company,
        serviceLabel,
        project: payload.project,
        submittedAt,
        locale: payload.locale,
      }),
    },
    { idempotencyKey: `contact-inquiry/${submissionId}` },
  );

  if (inquiry.error) {
    console.error("[resend] inquiry failed:", inquiry.error);
    return {
      ok: false,
      code: "resend_error",
      message: inquiry.error.message,
    };
  }

  return { ok: true };
}
