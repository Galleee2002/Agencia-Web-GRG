import type { Metadata } from "next";
import { Geist, Inter, Montserrat } from "next/font/google";
import "./tailwind.css";
import "./globals.scss";
import { AppProviders } from "@/components/providers/AppProviders";
import { ThemeScript } from "@/components/providers/ThemeScript";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
      )}
    >
      <body className="min-h-full min-w-0 flex flex-col">
        <ThemeScript />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
