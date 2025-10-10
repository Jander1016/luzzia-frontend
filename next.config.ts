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
    },
    // Optimizaciones para reducir JS execution time
    optimizePackageImports: ['lucide-react', 'recharts', 'date-fns'],
  },
  // Optimizaciones de bundle más conservadoras
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Optimización específica para iconos
      config.resolve.alias = {
        ...config.resolve.alias,
        'lucide-react': 'lucide-react/dist/esm/lucide-react.js',
      }
    }
    return config
  },
};

export default nextConfig;
