import { Heading, Section, Text } from "@react-email/components";

import { EmailLayout, emailStyles } from "./_components/EmailLayout";

const { colors } = emailStyles;

export type ContactInquiryEmailProps = {
  name: string;
  email: string;
  company?: string;
  serviceLabel: string;
  project: string;
  submittedAt: string;
  locale: "es" | "en";
};

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <Section style={{ marginBottom: 16 }}>
      <Text style={{ color: colors.muted, fontSize: 12, margin: "0 0 4px", textTransform: "uppercase" }}>
        {label}
      </Text>
      <Text
        style={{
          color: colors.text,
          fontSize: 15,
          lineHeight: "22px",
          margin: 0,
          whiteSpace: "pre-wrap",
        }}
      >
        {value}
      </Text>
    </Section>
  );
}

export default function ContactInquiryEmail({
  name,
  email,
  company,
  serviceLabel,
  project,
  submittedAt,
  locale,
}: ContactInquiryEmailProps) {
  const isEn = locale === "en";
  const preview = `Nueva consulta — ${name}`;

  return (
    <EmailLayout preview={preview} locale={locale}>
      <Heading
        style={{
          color: colors.text,
          fontSize: 22,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          margin: "0 0 8px",
        }}
      >
        {isEn ? "New contact inquiry" : "Nueva consulta de contacto"}
      </Heading>
      <Text style={{ color: colors.muted, fontSize: 13, margin: "0 0 28px" }}>
        {submittedAt}
      </Text>
      <FieldRow label={isEn ? "Name" : "Nombre"} value={name} />
      <FieldRow label="Email" value={email} />
      {company ? (
        <FieldRow label={isEn ? "Company" : "Empresa"} value={company} />
      ) : null}
      <FieldRow label={isEn ? "Service" : "Servicio"} value={serviceLabel} />
      <FieldRow label={isEn ? "Project" : "Proyecto"} value={project} />
    </EmailLayout>
  );
}

ContactInquiryEmail.PreviewProps = {
  name: "María García",
  email: "maria@ejemplo.com",
  company: "Acme SA",
  serviceLabel: "Sitio web corporativo",
  project: "Necesitamos un sitio institucional con blog y formulario de contacto.",
  submittedAt: new Date().toISOString(),
  locale: "es",
} satisfies ContactInquiryEmailProps;
