import { designTokens } from "./src/styles/design-system";

module.exports = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    // PriceCards y charts - variantes extendidas
    'text-blue-400', 'text-blue-500', 'text-green-400', 'text-green-500', 'text-red-400', 'text-red-500', 'text-cyan-400', 'text-cyan-500', 'text-pink-400', 'text-pink-500', 'text-emerald-400', 'text-emerald-500',
    'bg-muted', 'bg-muted/20', 'bg-muted/50', 'bg-slate-800', 'bg-slate-800/60', 'bg-gradient-to-br', 'bg-blue-500', 'bg-indigo-500', 'bg-purple-600', 'bg-gray-900', 'bg-slate-900',
    'border-slate-700/30', 'border-slate-700/50', 'border-slate-800', 'border-blue-500/30', 'border-slate-400/10',
    'rounded-full', 'rounded-lg', 'rounded-2xl', 'rounded-xl',
    'font-bold', 'font-extrabold', 'font-medium', 'font-semibold', 'text-lg', 'text-xl', 'text-xs', 'text-base',
    'animate-pulse', 'animate-spin', 'animate-pulse-glow', 'animate-chart-load',
    'prose', 'dark:prose-invert',
    'shadow-lg', 'shadow-xl', 'shadow-2xl',
    'size-7', 'size-12', 'size-14',
    'text-muted-foreground', 'text-foreground', 'text-white', 'text-slate-300', 'text-slate-400', 'text-slate-900', 'text-yellow-400', 'text-slate-400', 'text-slate-300', 'text-slate-900', 'text-slate-800',
    // Layout/grid
    'container', 'mx-auto', 'px-4', 'max-w-4xl', 'min-h-screen', 'h-72', 'h-8', 'h-4', 'h-3', 'h-2', 'w-8', 'w-16', 'w-48', 'w-32', 'w-28', 'w-20', 'w-2', 'w-10', 'h-10', 'w-12', 'h-12', 'w-5', 'h-5', 'w-6', 'h-6',
    'flex', 'items-center', 'justify-center', 'text-center', 'gap-2', 'space-y-8', 'space-y-3', 'space-y-4', 'mb-1', 'mb-2', 'mb-3', 'mb-4', 'mb-6', 'mb-10', 'mb-12', 'mb-20', 'mt-1', 'mt-2', 'mt-3', 'mt-4',
    'grid', 'grid-cols-1', 'grid-cols-2', 'md:grid-cols-3', 'md:grid-cols-2', 'lg:grid-cols-3',
    // Responsive/dark
    'dark:text-blue-300', 'dark:prose-invert', 'dark:text-yellow-400',
    // Utilidades backdrop y transition
    'backdrop-blur-md', 'transition-all', 'duration-300',
  ],
  theme: {
    // Use design system tokens
    colors: {
      // Core colors from design system
      primary: designTokens.colors.primary,
      success: designTokens.colors.success,
      warning: designTokens.colors.warning,
      danger: designTokens.colors.danger,
      neutral: designTokens.colors.neutral,

      // Semantic aliases
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      border: "hsl(var(--border))",
      muted: {
        DEFAULT: "hsl(var(--muted))",
        foreground: "hsl(var(--muted-foreground))",
      },
      accent: {
        DEFAULT: "hsl(var(--accent))",
        foreground: "hsl(var(--accent-foreground))",
      },
      card: {
        DEFAULT: "hsl(var(--card))",
        foreground: "hsl(var(--card-foreground))",
      },

      // Legacy support
      brand: {
        DEFAULT: "#00E0FF",
        dark: "#0090A8",
      },

      // Chart colors
      luzzia: {
        blue: '#0ea5e9',
        dark: '#111827',
        gray: '#6b7280',
        light: '#f9fafb',
      }
    },

    fontFamily: {
      // Opción A: Reemplaza la fuente 'sans' (más común)
      sans: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      // Opción B: Crea una nueva clase 'font-luzzia'
      luzzia: ['Montserrat', 'sans-serif'],
    },
    fontSize: designTokens.typography.fontSize,
    fontWeight: designTokens.typography.fontWeight,
    spacing: designTokens.spacing,
    borderRadius: designTokens.borderRadius,
    boxShadow: designTokens.boxShadow,
    screens: designTokens.screens,
    zIndex: designTokens.zIndex,

    extend: {
      // Enhanced animations
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'chart-load': 'chartLoad 0.6s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        chartLoad: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '50%': { opacity: '0.5', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },

      // Enhanced backdrop blur
      backdropBlur: {
        '16': '16px',
        '24': '24px',
      },

      // Custom gradients
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'price-excellent': 'linear-gradient(135deg, var(--tw-gradient-stops))',
      },

      // Enhanced transitions
      transitionDuration: designTokens.animation.duration,
      transitionTimingFunction: designTokens.animation.easing,

      // Container improvements
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
    require('@tailwindcss/forms'),

    // Custom plugin for accessibility improvements
    function ({ addUtilities }: any) {
      addUtilities({
        '.focus-ring': {
          '@apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2': {},
        },
        '.text-balance': {
          'text-wrap': 'balance',
        },
        '.animation-reduce-motion': {
          '@media (prefers-reduced-motion: reduce)': {
            'animation-duration': '0.01ms !important',
            'animation-iteration-count': '1 !important',
            'transition-duration': '0.01ms !important',
          },
        },
      })
    },
  ],
};

