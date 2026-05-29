import { NextResponse } from "next/server";

import { contactSchema } from "@/lib/email/contactSchema";
import { sendContactSubmission } from "@/lib/email/sendContactSubmission";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 },
    );
  }

  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "validation_error",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const result = await sendContactSubmission(parsed.data);

  if (!result.ok) {
    if (result.code === "missing_api_key") {
      return NextResponse.json(
        { ok: false, error: "service_unavailable" },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { ok: false, error: "send_failed" },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
