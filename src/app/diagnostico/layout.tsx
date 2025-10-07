import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Diagnóstico de Sistema - Luzzia',
  description: 'Herramientas de diagnóstico y verificación del sistema Luzzia para desarrolladores y administradores.',
  keywords: ['diagnóstico sistema', 'herramientas luzzia', 'verificación API'],
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Diagnóstico de Sistema - Luzzia',
    description: 'Herramientas de diagnóstico interno del sistema.',
    type: 'website',
  },
}

export default function DiagnosticoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}