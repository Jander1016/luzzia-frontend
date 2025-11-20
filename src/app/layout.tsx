import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { CookieBanner } from "@/components/legal/CookieBanner";
import { ElectricityDataProvider } from "@/hooks/useElectricityDataContext";
import HeaderV2 from "@/components/layout/HeaderV2";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    default: 'Luzzia - Ahorra en tu Factura de Luz con Precios en Tiempo Real',
    template: '%s | Luzzia'
  },
  description: 'Descubre cuándo es más barato usar tus electrodomésticos con datos en tiempo real del mercado eléctrico español. Reduce tu factura hasta un 30% con alertas inteligentes.',
  keywords: [
    'precio luz tiempo real',
    'ahorro factura eléctrica',
    'mercado eléctrico español',
    'precios electricidad hora',
    'PVPC',
    'tarifa eléctrica',
    'consumo inteligente',
    'ahorro energético',
    'Red Eléctrica España',
    'electricidad barata España'
  ],
  authors: [{ name: 'Jander Gomez' }],
  creator: 'Jander',
  publisher: 'Jander',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://luzzia.es'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: '/',
    title: 'Luzzia - Ahorra en tu Factura de Luz con Precios en Tiempo Real',
    description: 'Descubre cuándo es más barato usar tus electrodomésticos con datos en tiempo real del mercado eléctrico español. Reduce tu factura hasta un 30%.',
    siteName: 'Luzzia',
    images: [
      {
        url: '/logo.webp',
        width: 1200,
        height: 630,
        alt: 'Luzzia - Ahorro Energético Inteligente',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luzzia - Ahorra en tu Factura de Luz',
    description: 'Descubre cuándo es más barato usar tus electrodomésticos con datos en tiempo real.',
    images: ['/logo.webp'],
  },
  other: {
    'linkedin:title': 'Luzzia - Ahorra en tu Factura de Luz con Precios en Tiempo Real',
    'linkedin:description': 'Descubre cuándo es más barato usar tus electrodomésticos con datos en tiempo real del mercado eléctrico español. Reduce tu factura hasta un 30%.',
    'linkedin:image': '/logo.webp',
    'linkedin:url': '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="font-sans min-h-screen transition-colors duration-300 bg-neutral-50 dark:bg-neutral-950">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <ElectricityDataProvider>
            {/* Skip to main content link for keyboard navigation */}
            <Link
              href="#main-content" 
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50 transition-all"
            >
              Saltar al contenido principal
            </Link>
            
            {/* Main Application Structure */}
            <div 
              className="bg-gradient-to-br from-background via-background/95 to-background dark:from-slate-950 dark:via-slate-900 dark:to-slate-800"
              role="application"
              aria-label="Aplicación de precios eléctricos Luzzia"
            >
              {/* Site Header */}
              <HeaderV2 />
              
              {/* Main Content Area */}
              <main 
                id="main-content"
                className="container mx-auto p-4 min-h-screen"
                role="main"
                aria-label="Contenido principal"
                tabIndex={-1}
              >
                {children}
              </main>
              
              {/* Footer placeholder for future use */}
              <footer 
                className="sr-only"
                role="contentinfo"
                aria-label="Información del sitio"
              >
                <p>© 2024 Luzzia - Ahorro energético inteligente</p>
              </footer>
            </div>
            
            {/* RGPD Cookie Banner */}
            <CookieBanner />
          </ElectricityDataProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
