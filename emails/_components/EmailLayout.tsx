import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { ReactNode } from "react";

const colors = {
  bg: "#000000",
  surface: "#090909",
  text: "#ffffff",
  muted: "#a6a6a6",
  accent: "#0099ff",
  border: "rgba(255, 255, 255, 0.08)",
};

export const emailStyles = {
  colors,
};

type EmailLayoutProps = {
  preview: string;
  locale: "es" | "en";
  children: ReactNode;
};

export function EmailLayout({ preview, locale, children }: EmailLayoutProps) {
  return (
    <Html lang={locale}>
      <Head />
      <Preview>{preview}</Preview>
      <Body
        style={{
          backgroundColor: colors.bg,
          margin: 0,
          fontFamily:
            'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        <Container style={{ maxWidth: 560, margin: "0 auto", padding: "40px 24px" }}>
          <Section
            style={{
              borderBottom: `1px solid ${colors.border}`,
              paddingBottom: 24,
              marginBottom: 32,
            }}
          >
            <Text
              style={{
                color: colors.text,
                fontSize: 18,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              GRG Solutions
            </Text>
          </Section>
          {children}
          <Section style={{ marginTop: 40, paddingTop: 24, borderTop: `1px solid ${colors.border}` }}>
            <Text style={{ color: colors.muted, fontSize: 12, lineHeight: "20px", margin: 0 }}>
              {locale === "en"
                ? "GRG Solutions — Web development agency"
                : "GRG Solutions — Agencia de desarrollo web"}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
