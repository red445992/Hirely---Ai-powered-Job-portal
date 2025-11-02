import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 output: 'standalone', // This creates a standalone build for production
  trailingSlash: true,
  // Add if you have image domains
  images: {
    domains: ['localhost'],
  },
};

export default nextConfig;
