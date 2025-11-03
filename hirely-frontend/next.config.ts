import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build configurations
  output: 'standalone',
  trailingSlash: true,
  
  // Updated image configuration
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.railway.app',
        port: '',
        pathname: '/**',
      }
    ],
  },
  
  // Experimental features for build optimization
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
} satisfies NextConfig;

export default nextConfig;
