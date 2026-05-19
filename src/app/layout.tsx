import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import "./tailwind.css";
import "./globals.scss";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agencia Web GMG",
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
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className="min-h-full min-w-0 flex flex-col">{children}</body>
    </html>
  );
}
