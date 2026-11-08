import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.0.178', '172.20.10.5'],
  devIndicators: false,
};

export default nextConfig;
