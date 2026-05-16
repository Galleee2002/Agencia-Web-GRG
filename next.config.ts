import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 solo permite valores listados; el portfolio usa quality={72}.
    qualities: [72, 75],
  },
};

export default nextConfig;
