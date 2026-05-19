import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 solo permite valores listados; el portfolio usa quality={72}.
    qualities: [72, 75],
    localPatterns: [
      {
        // Capturas del portfolio (`?v=` para invalidar caché al reemplazar assets).
        pathname: "/projects/**",
      },
      { pathname: "/team/**", search: "" },
      { pathname: "/logo.svg", search: "" },
    ],
  },
};

export default nextConfig;
