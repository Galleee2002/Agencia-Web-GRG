import { Resend } from "resend";

import { SITE_CONTACT } from "@/config/site";

export function getResendConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.RESEND_FROM_EMAIL ?? "GRG Solutions <onboarding@resend.dev>";
  const notifyEmail = process.env.RESEND_NOTIFY_EMAIL ?? SITE_CONTACT.email;

  return { apiKey, from, notifyEmail };
}

let resendClient: Resend | null = null;

export function getResendClient(): Resend | null {
  const { apiKey } = getResendConfig();
  if (!apiKey) return null;

  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }

  return resendClient;
}
