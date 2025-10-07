import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Precios de la Luz en Tiempo Real - Gráficos Interactivos | Luzzia',
  description: 'Consulta los precios actuales de la electricidad en España con gráficos interactivos. Datos del PVPC actualizados cada hora. Encuentra las mejores horas para ahorrar.',
  keywords: [
    'precio luz tiempo real',
    'PVPC hoy',
    'precio electricidad España',
    'gráfico precios luz',
    'mercado eléctrico español',
    'tarifa PVPC',
    'precios luz hora',
    'Red Eléctrica España'
  ],
  openGraph: {
    title: 'Precios de la Luz en Tiempo Real - Gráficos Interactivos',
    description: 'Consulta los precios actuales de la electricidad en España con gráficos interactivos y datos actualizados cada hora.',
    type: 'website',
  },
}

export default function PreciosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}