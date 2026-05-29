import { Heading, Link, Section, Text } from "@react-email/components";

import { EmailLayout, emailStyles } from "./_components/EmailLayout";

const { colors } = emailStyles;

export type ContactConfirmationEmailProps = {
  name: string;
  serviceLabel: string;
  locale: "es" | "en";
  siteUrl: string;
};

export default function ContactConfirmationEmail({
  name,
  serviceLabel,
  locale,
  siteUrl,
}: ContactConfirmationEmailProps) {
  const isEn = locale === "en";
  const preview = isEn
    ? "We received your message — GRG Solutions"
    : "Recibimos tu mensaje — GRG Solutions";

  return (
    <EmailLayout preview={preview} locale={locale}>
      <Heading
        style={{
          color: colors.text,
          fontSize: 24,
          fontWeight: 600,
          letterSpacing: "-0.03em",
          margin: "0 0 16px",
        }}
      >
        {isEn ? `Hi ${name},` : `Hola ${name},`}
      </Heading>
      <Text style={{ color: colors.muted, fontSize: 15, lineHeight: "24px", margin: "0 0 16px" }}>
        {isEn
          ? "Thank you for contacting GRG Solutions. We received your inquiry and will review it shortly."
          : "Gracias por contactar a GRG Solutions. Recibimos tu consulta y la revisaremos a la brevedad."}
      </Text>
      <Section
        style={{
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: 8,
          padding: "16px 20px",
          marginBottom: 24,
        }}
      >
        <Text style={{ color: colors.muted, fontSize: 12, margin: "0 0 4px", textTransform: "uppercase" }}>
          {isEn ? "Service" : "Servicio"}
        </Text>
        <Text style={{ color: colors.text, fontSize: 15, margin: 0 }}>{serviceLabel}</Text>
      </Section>
      <Text style={{ color: colors.muted, fontSize: 15, lineHeight: "24px", margin: "0 0 24px" }}>
        {isEn
          ? "If you need to add details, reply to this email or write to us again from the website."
          : "Si necesitás agregar detalles, respondé a este correo o escribinos de nuevo desde el sitio."}
      </Text>
      <Link
        href={siteUrl}
        style={{
          color: colors.accent,
          fontSize: 14,
          textDecoration: "none",
        }}
      >
        {isEn ? "Visit our website" : "Visitar el sitio web"} →
      </Link>
    </EmailLayout>
  );
}

ContactConfirmationEmail.PreviewProps = {
  name: "María García",
  serviceLabel: "Sitio web corporativo",
  locale: "es",
  siteUrl: "https://grgsolutions.com.ar",
} satisfies ContactConfirmationEmailProps;
