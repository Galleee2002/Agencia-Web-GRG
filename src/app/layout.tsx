import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Inter, Montserrat } from "next/font/google";

import "./tailwind.css";
import "./globals.scss";
import { AppProviders } from "@/components/providers/AppProviders";
import { HERO_ENTRANCE_BOOT_SCRIPT } from "@/lib/heroEntranceBoot";
import { parseThemeCookie } from "@/lib/themeCookie";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "GRG Solutions",
  description: "Base project with Next.js, TypeScript, SCSS and Atomic Design.",
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
  const themeCookie = parseThemeCookie(
    cookieStore.get("site-theme")?.value,
  );
  const isDark = themeCookie === "dark";

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
        isDark && "dark",
      )}
      style={{ colorScheme: isDark ? "dark" : "light" }}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: HERO_ENTRANCE_BOOT_SCRIPT }}
        />
      </head>
      <body className="min-h-full min-w-0 flex flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
