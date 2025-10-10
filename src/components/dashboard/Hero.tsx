'use client'

import { PriceCards } from './PriceCards'
import { DashboardStats } from '@/types/api'

interface HeroProps {
  stats?: DashboardStats | null
  isLoading?: boolean
}

export default function Hero({ stats, isLoading = false }: HeroProps) {
  return (
    <>
      {/* Hero Text */}
      <div className="text-center mb-12">
        <div className="min-h-[140px] flex flex-col justify-center">
          <h1 className="text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
            <span className="text-green-300 -to-blue-500">Ahorra</span> en tu
          </h1>
          <h2 className="text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
            factura eléctrica
          </h2>
        </div>
        <p className="text-xl text-white/80 max-w-3xl mx-auto">
          Descubre cuándo es más barato usar tus electrodomésticos con datos 
          en tiempo real del mercado eléctrico español
        </p>
      </div>
      
      {/* Price Cards */}
      <PriceCards stats={stats || null} isLoading={isLoading} />
    </>
  )
}