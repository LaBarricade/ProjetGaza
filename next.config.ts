import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL('http://commons.wikimedia.org/**'),
      new URL('https://upload.wikimedia.org/**'),
    ],
  },
};

export default nextConfig;
