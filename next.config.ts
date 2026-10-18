import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Add remote hosts here if real photos are served from a CDN, e.g.:
    // remotePatterns: [{ protocol: "https", hostname: "images.your-cdn.com" }],
  },
};

export default nextConfig;
