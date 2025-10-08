'use client'

import { PriceCards } from './PriceCards'
import { DashboardStats } from '@/types/api'

interface HeroProps {
  stats?: DashboardStats | null
  isLoading?: boolean
}

export default function Hero({ stats, isLoading = false }: HeroProps) {
  return (
    // <section className="bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#7b1fa2] py-16 rounded-xl px-8 mb-8">
      // <div className="max-w-6xl mx-auto">
      <>
        {/* Hero Text */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold tracking-tight text-white mb-4">
            <span className="text-green-300 -to-blue-500">Ahorra</span> en tu
          </h1>
          <h1 className="text-5xl font-bold tracking-tight text-white mb-6">
            factura eléctrica
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Descubre cuándo es más barato usar tus electrodomésticos con datos 
            en tiempo real del mercado eléctrico español
          </p>
        </div>
        
        {/* Price Cards */}
        <PriceCards stats={stats || null} isLoading={isLoading} />
      </>
    // </section>
  )
}