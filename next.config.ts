import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Strict React mode
  reactStrictMode: true,

  // Image optimization — allow external domains as needed
  images: {
    remotePatterns: [],
  },

  // Vercel deployment — no changes needed; next build outputs to .next/
};

export default nextConfig;
