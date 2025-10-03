// import type { Config } from "tailwindcss";

// const config: Config = {
//   content: [
//     "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         brand: {
//           DEFAULT: "#00E0FF",
//           dark: "#0090A8",
//         },
//         border: "hsl(var(--border))",
//         background: "hsl(var(--background))",
//         foreground: "hsl(var(--foreground))",
//         primary: {
//           DEFAULT: "hsl(var(--primary))",
//           foreground: "hsl(var(--primary-foreground))",
//         },
//         secondary: {
//           DEFAULT: "hsl(var(--secondary))",
//           foreground: "hsl(var(--secondary-foreground))",
//         },
//         card: {
//           DEFAULT: "hsl(var(--card))",
//           foreground: "hsl(var(--card-foreground))",
//         },
//       },
//     },
//   },
//   plugins: [],
// };

// export default config;

// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Colores basados en la imagen de Luzzia
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9', // Azul principal de Luzzia
          600: '#0284c7', // Azul más oscuro
          700: '#0369a1',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          500: '#6b7280', // Gris texto secundario
          600: '#4b5563', // Gris texto principal
          700: '#374151', // Gris más oscuro
          900: '#111827', // Negro texto principal
        },
        green: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e', // Verde para precios bajos
          600: '#16a34a',
        },
        blue: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6', // Azul para ahorro
          600: '#2563eb',
        },
        // Colores específicos de la imagen
        luzzia: {
          blue: '#0ea5e9', // Azul Luzzia exacto
          dark: '#111827', // Negro texto
          gray: '#6b7280', // Gris texto secundario
          light: '#f9fafb', // Fondo claro
        }
      },
      backgroundColor: {
        'app': '#f8fafc', // Fondo de la aplicación
      }
    },
  },
  plugins: [],
}
