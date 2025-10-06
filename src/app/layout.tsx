import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || 'Luzzia - Energía Inteligente',
  description: 'Descubre cuándo es más barato usar tus electrodomésticos con datos en tiempo real del mercado eléctrico español',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-gradient-to-br from-[#09121a] via-[#1b2c62] to-[#471581] py-1 rounded-lg text-white`}>
        <Header />
        <main className="container mx-auto p-4 sm: max-w-full p1">{children}</main>
      </body>
    </html>
  );
}
