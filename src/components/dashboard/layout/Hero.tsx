'use client'

import { DashboardStats } from '@/types/api'
import  PriceCardsV2  from '../cards/PriceCardsV2'
import { useTodayPrices } from '@/hooks/useElectricityData'
import { GradientTextStyles } from '@/components/ui/gradientText'

interface HeroProps {
  stats?: DashboardStats | null
  isLoading?: boolean
}

export default function Hero({ stats, isLoading = false }: HeroProps) {
  const { data: dailyPrices, isLoading: pricesLoading } = useTodayPrices();

  return (
    <main aria-labelledby="hero-title">
      {/* Hero Section */}
      <header className="text-center mb-12">
          <h1 
            id="hero-title"
            className="text-5xl font-bold tracking-tight text-white mb-4 leading-tight"
          >
            <span className={`${GradientTextStyles}`}>
              Precio&nbsp;
            </span> 
            <span className={`${GradientTextStyles}`}>
             de la&nbsp;
            </span> 
            <span className={`${GradientTextStyles}`}>
            luz hoy en España
            </span> 
          </h1>
        <p 
          className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed"
          role="doc-subtitle"
        >
          Consulta el precio de la electricidad por horas y descubre cuándo es más barata la luz <span className={`text-[#03faae] font-bold`}>para ahorrar hasta un 30% </span> en tu factura eléctrica.
        </p>
      </header>
      
      {/* Price Cards Section */}
      <section aria-labelledby="price-section-title">
        <h2 id="price-section-title" className="sr-only">
          Información de precios eléctricos en tiempo real
        </h2>
        <PriceCardsV2
          stats={stats || null}
          dailyPrices={dailyPrices}
          isLoading={isLoading || pricesLoading}
        />
      </section>
    </main>
  )
}