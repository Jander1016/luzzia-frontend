'use client'

// import { PriceCards } from './PriceCards'
import { DashboardStats } from '@/types/api'
import { PriceCardsV2 } from './PriceCardsV2'
// import { PriceCardsV2 } from './PriceCardsV2'

interface HeroProps {
  stats?: DashboardStats | null
  isLoading?: boolean
}

export default function Hero({ stats, isLoading = false }: HeroProps) {
  return (
    <main role="main" aria-labelledby="hero-title">
      {/* Hero Section */}
      <header className="text-center mb-12">
        <div className="min-h-[140px] flex flex-col justify-center">
          <h1 
            id="hero-title"
            className="text-5xl font-bold tracking-tight text-white mb-4 leading-tight"
          >
            <span className="bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">
              Ahorra
            </span> en tu
          </h1>
          <div 
            className="text-5xl font-bold tracking-tight text-white mb-6 leading-tight"
            aria-label="factura eléctrica"
          >
            factura eléctrica
          </div>
        </div>
        <p 
          className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed"
          role="doc-subtitle"
        >
          Descubre cuándo es más barato usar tus electrodomésticos con datos 
          en tiempo real del mercado eléctrico español
        </p>
      </header>
      
      {/* Price Cards Section */}
      <section aria-labelledby="price-section-title">
        <h2 id="price-section-title" className="sr-only">
          Información de precios eléctricos en tiempo real
        </h2>
        <PriceCardsV2 stats={stats || null} isLoading={isLoading} />
      </section>
    </main>
  )
}