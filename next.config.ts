import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // desactiva el sistema de optimización
  },
  reactStrictMode: true,
  experimental: {
    reactCompiler: {
      // Configuración básica para React Compiler
      compilationMode: 'annotation'
    }
  },
};

export default nextConfig;
