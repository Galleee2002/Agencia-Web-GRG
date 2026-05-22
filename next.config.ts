import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  images: {
    // Next 16 solo permite valores listados; el portfolio usa quality={72}.
    qualities: [72, 75],
    // En dev no retener variantes optimizadas al reemplazar archivos en `public/`.
    minimumCacheTTL: isDev ? 0 : undefined,
    localPatterns: [
      {
        // Capturas del portfolio (`?v=` para invalidar caché al reemplazar assets).
        pathname: "/projects/**",
      },
      {
        pathname: "/team/**",
      },
      { pathname: "/work-with-us/**", search: "" },
      { pathname: "/logo.svg", search: "" },
      { pathname: "/logo-negro.svg", search: "" },
      // Hero banner en raíz de `public/` (admite `?v=` vía publicAssetUrl).
      { pathname: "/GRG-banner.webp" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
