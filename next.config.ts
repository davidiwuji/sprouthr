import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use Webpack instead of Turbopack for platform compatibility
  webpack: (config) => {
    return config;
  },
  // Skip TS type checking — WASM TypeScript checker crashes on this machine
  // Webpack still compiles and checks syntax via SWC
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
