import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Inter, Montserrat } from "next/font/google";

import "./tailwind.css";
import "./globals.scss";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import { AppProviders } from "@/components/providers/AppProviders";
import type { Theme } from "@/components/providers/ThemeProvider";
import {
  SITE_DEFAULT_DESCRIPTION,
  SITE_DEFAULT_LOCALE,
  SITE_NAME,
  SITE_OG_IMAGE_PATH,
  SITE_URL,
} from "@/config/site";
import { HERO_ENTRANCE_BOOT_SCRIPT } from "@/lib/heroEntranceBoot";
import { parseThemeCookie, THEME_COOKIE_NAME } from "@/lib/themeCookie";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Desarrollo y diseño web`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DEFAULT_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: SITE_DEFAULT_LOCALE,
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Desarrollo y diseño web`,
    description: SITE_DEFAULT_DESCRIPTION,
    images: [
      {
        url: SITE_OG_IMAGE_PATH,
        alt: `${SITE_NAME} — agencia de desarrollo web`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Desarrollo y diseño web`,
    description: SITE_DEFAULT_DESCRIPTION,
    images: [SITE_OG_IMAGE_PATH],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get(THEME_COOKIE_NAME)?.value;
  const initialTheme: Theme = parseThemeCookie(themeCookie) ?? "light";

  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        montserrat.variable,
        "font-sans",
        inter.variable,
        initialTheme === "dark" && "dark",
      )}
      style={{
        colorScheme: initialTheme,
      }}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: HERO_ENTRANCE_BOOT_SCRIPT }}
        />
      </head>
      <body className="min-h-full min-w-0 flex flex-col">
        <OrganizationJsonLd />
        <AppProviders initialTheme={initialTheme}>{children}</AppProviders>
      </body>
    </html>
  );
}
