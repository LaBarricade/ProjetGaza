import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('http://commons.wikimedia.org/**')],
  },
};

export default nextConfig;
