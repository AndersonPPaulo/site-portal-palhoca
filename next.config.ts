import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      process.env.IMAGE_DOMAIN_1 || "",
      process.env.IMAGE_DOMAIN_2 || "",
    ].filter(Boolean), // para evitar strings vazias
  },
};

export default nextConfig;
