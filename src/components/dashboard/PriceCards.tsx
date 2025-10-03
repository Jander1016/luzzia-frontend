'use client'

import { memo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Euro, Clock, TrendingUp } from 'lucide-react'
import { DashboardStats } from '@/types/api'

interface PriceCardsProps {
  stats: DashboardStats | null
}

export const PriceCards = memo(function PriceCards({ stats }: PriceCardsProps) {
  const safeStats = stats ? {
    currentPrice: Math.max(0, stats.currentPrice || 0.12),
    nextHourPrice: Math.max(0, stats.nextHourPrice || 0.08),
    priceChangePercentage: stats.priceChangePercentage || -33,
    monthlySavings: Math.max(0, Math.min(100, stats.monthlySavings || 25)),
    comparisonType: stats.comparisonType || 'tarifa fija'
  } : {
    currentPrice: 0.12,
    nextHourPrice: 0.08,
    priceChangePercentage: -33,
    monthlySavings: 25,
    comparisonType: 'tarifa fija'
  }

  const {
    currentPrice,
    nextHourPrice,
    priceChangePercentage,
    monthlySavings,
    comparisonType
  } = safeStats

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <PriceCard
        icon={<Euro className="w-8 h-8 text-white" />}
        iconBgColor="bg-gradient-to-br from-cyan-400 to-teal-500 shadow-cyan-500/25"
        title="Precio actual"
        price={`${currentPrice.toFixed(2)}€/kWh`}
        description="Momento ideal para usar electrodomésticos"
        isGreenPrice={true}
      />
      
      <PriceCard
        icon={<Clock className="w-8 h-8 text-white" />}
        iconBgColor="bg-gradient-to-br from-amber-400 to-orange-500 shadow-orange-500/25"
        title="Próxima hora"
        price={`${nextHourPrice.toFixed(2)}€/kWh`}
        description={`Precio bajará un ${Math.abs(priceChangePercentage)}%`}
        isGreenPrice={true}
      />
      
      <PriceCard
        icon={<TrendingUp className="w-8 h-8 text-white" />}
        iconBgColor="bg-gradient-to-br from-fuchsia-400 to-pink-500 shadow-pink-500/25"
        title="Ahorro este mes"
        price={`${monthlySavings}%`}
        description={`Comparado con ${comparisonType}`}
        isGreenPrice={false}
      />
    </div>
  )
})

interface PriceCardProps {
  icon: React.ReactNode
  iconBgColor: string
  title: string
  price: string
  description: string
  isGreenPrice?: boolean
}

const PriceCard = memo(function PriceCard({ icon, iconBgColor, title, price, description, isGreenPrice = false }: PriceCardProps) {
  return (
    <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/90 backdrop-blur-sm border text-center border-slate-700/50 hover:border-slate-600/70 transition-all duration-300 hover:bg-gradient-to-br hover:from-slate-700/90 hover:to-slate-800/95 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-slate-900/25 group">
      <CardContent className="p-6 items-center align-middle">
        <div className={`w-16 h-16 rounded-full ${iconBgColor} flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 mx-auto`}>
          {icon}
        </div>
        
        <div className={`text-2xl font-bold mb-2 transition-colors duration-300 ${
          isGreenPrice 
            ? 'text-green-400 group-hover:text-green-300' 
            : 'text-white group-hover:text-green-300'
        }`}>
          {price}
        </div>
        
        <div className="text-white/90 font-medium mb-2 text-sm group-hover:text-white transition-colors duration-300">
          {title}
        </div>
        
        <div className="text-white/70 text-xs leading-relaxed group-hover:text-white/80 transition-colors duration-300">
          {description}
        </div>
      </CardContent>
    </Card>
  )
})
