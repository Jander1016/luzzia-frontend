import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { CookieBanner } from "@/components/legal/CookieBanner";
// import ClientStartupBanner from "@/components/marketing/ClientStartupBanner";

const inter = Inter({ subsets: ["latin"], display: 'swap' });

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
      <body className={`${inter.className} min-h-screen transition-colors duration-300`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          {/* Main Layout */}
          <div className="bg-gradient-to-br from-background via-background/95 to-background dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
            <Header />
            {/* <ClientStartupBanner /> */}
            <main className="container mx-auto p-4 min-h-screen">
              {children}
            </main>
          </div>
          
          {/* RGPD Cookie Banner */}
          <CookieBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
