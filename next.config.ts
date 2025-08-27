import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['dl.dropbox.com', 'www.onlygfx.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dl.dropbox.com',
      },
      {
        protocol: 'https',
        hostname: 'www.onlygfx.com',
      },
    ],
  },
};

export default nextConfig;
