import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system', 
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif'
        ],
      },
      colors: {
        brand: {
          DEFAULT: "#00E0FF",
          dark: "#0090A8",
        },
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Colores específicos para gráficos
        luzzia: {
          blue: '#0ea5e9',
          dark: '#111827',
          gray: '#6b7280',
          light: '#f9fafb',
        }
      },
      backgroundColor: {
        'app': '#f8fafc',
      },
      animation: {
        'chart-load': 'chartLoad 0.3s ease-out',
      },
      keyframes: {
        chartLoad: {
          from: {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      backdropBlur: {
        '16': '16px',
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
  ],
};

export default config;
