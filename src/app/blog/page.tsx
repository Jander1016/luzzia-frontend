import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog Luzzia - Consejos de Ahorro Energético y Smart Home',
  description: 'Descubre consejos prácticos para ahorrar en tu factura eléctrica, reviews de dispositivos inteligentes y las últimas tendencias en eficiencia energética.',
  keywords: [
    'blog ahorro energético',
    'consejos electricidad',
    'smart home España',
    'dispositivos inteligentes',
    'eficiencia energética',
    'electrodomésticos eficientes',
    'domótica ahorro'
  ],
  openGraph: {
    title: 'Blog Luzzia - Consejos de Ahorro Energético',
    description: 'Consejos prácticos, reviews y tendencias para optimizar tu consumo eléctrico con tecnología inteligente.',
    type: 'website',
  },
}

export default function BlogPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Blog Luzzia</h1>
      <p className="mt-2 text-slate-300">Consejos de ahorro energético y tecnología inteligente.</p>
    </div>
  )
}