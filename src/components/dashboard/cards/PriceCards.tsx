'use client'

import { memo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Euro, TrendingUp } from 'lucide-react'
import { DashboardStats } from '@/types/api'

interface PriceCardsProps {
  stats: DashboardStats | null
  isLoading?: boolean
}

export const PriceCards = memo(function PriceCards({ stats, isLoading = false }: PriceCardsProps) {
  // Valores fijos para evitar problemas de hidratación

  // Valores por defecto para evitar problemas de hidratación
  const defaultStats = {
    currentPrice: 0.1200,
    minPrice: 0.1000,
    minPriceHour: 3,
    maxPrice: 0.2000,
    maxPriceHour: 19,
    lastUpdated: new Date().toISOString()
  }

  const safeStats = stats ? {
    currentPrice: stats.currentPrice ?? defaultStats.currentPrice,
    minPrice: stats.minPrice ?? defaultStats.minPrice,
    minPriceHour: stats.minPriceHour ?? defaultStats.minPriceHour,
    maxPrice: stats.maxPrice ?? defaultStats.maxPrice,
    maxPriceHour: stats.maxPriceHour ?? defaultStats.maxPriceHour,
    lastUpdated: stats.lastUpdated ?? defaultStats.lastUpdated
  } : defaultStats

  return (
    <section className="space-y-8" role="region" 
    // aria-labelledby="price-cards-heading"
    >
      {/* Indicador de hora de actualización */}
      {/* <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full backdrop-blur-sm">
          <Clock className="size-4 text-primary" aria-hidden="true" />
          <span className="text-sm font-medium" id="price-cards-heading">
            Datos actualizados: {new Date(safeStats.lastUpdated).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div> */}

      {/* Grid principal de cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <PriceCard
          icon={<Euro className="w-8 h-8 text-white" />}
          iconBgColor="bg-gradient-to-br from-cyan-400 to-teal-500 shadow-cyan-500/25"
          title="Precio actual"
          price={isLoading ? "..." : `${safeStats.currentPrice.toFixed(4)}€/kWh`}
          description={`Hora actual: ${new Date().getHours().toString().padStart(2, '0')}:00`}
          isGreenPrice={true}
          isLoading={isLoading}
        />
        <PriceCard
          icon={<TrendingUp className="w-8 h-8 text-white" />}
          iconBgColor="bg-gradient-to-br from-green-400 to-emerald-500 shadow-green-500/25"
          title="Precio más bajo del día"
          price={`${safeStats.minPrice.toFixed(4)}€/kWh`}
          description={`Hora: ${safeStats.minPriceHour.toString().padStart(2, '0')}:00`}
          isGreenPrice={true}
        />
        <PriceCard
          icon={<TrendingUp className="w-8 h-8 text-white" />}
          iconBgColor="bg-gradient-to-br from-pink-400 to-red-500 shadow-pink-500/25"
          title="Precio más alto del día"
          price={`${safeStats.maxPrice.toFixed(4)}€/kWh`}
          description={`Hora: ${safeStats.maxPriceHour.toString().padStart(2, '0')}:00`}
          isGreenPrice={false}
        />
      </div>
    </section>
  )
})

interface PriceCardProps {
  icon: React.ReactNode
  iconBgColor: string
  title: string
  price: string
  description: string
  isGreenPrice?: boolean
  isLoading?: boolean
}

const PriceCard = memo(function PriceCard({ icon, iconBgColor, title, price, description, isGreenPrice = false, isLoading = false }: PriceCardProps) {
  return (
    <Card className={`bg-gradient-to-br from-slate-800/80 to-slate-900/90 backdrop-blur-sm border text-center border-slate-700/50 hover:border-slate-600/70 transition-all duration-300 hover:bg-gradient-to-br hover:from-slate-700/90 hover:to-slate-800/95 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-slate-900/25 group ${isLoading ? 'animate-pulse' : ''}`}>
      <CardContent className="p-6 items-center align-middle">
        <div className={`w-16 h-16 rounded-full ${iconBgColor} flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 mx-auto ${isLoading ? 'opacity-50' : ''}`}>
          {icon}
        </div>
        
        <div className={`text-2xl font-bold mb-2 transition-colors duration-300 ${
          isGreenPrice 
            ? 'text-green-400 group-hover:text-green-300' 
            : 'text-white group-hover:text-green-300'
        } ${isLoading ? 'opacity-50' : ''}`}>
          {price}
        </div>
        
        <div className={`text-white/90 font-medium mb-2 text-sm group-hover:text-white transition-colors duration-300 ${isLoading ? 'opacity-50' : ''}`}>
          {title}
        </div>
        
        <div className={`text-white/70 text-xs leading-relaxed group-hover:text-white/80 transition-colors duration-300 ${isLoading ? 'opacity-50' : ''}`}>
          {description}
        </div>
      </CardContent>
    </Card>
  )
})