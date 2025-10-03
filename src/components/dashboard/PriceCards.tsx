'use client'

import { memo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Euro, Clock, TrendingUp } from 'lucide-react'
import { DashboardStats } from '@/types/api'

interface PriceCardsProps {
  stats: DashboardStats | null
}

export const PriceCards = memo(function PriceCards({ stats }: PriceCardsProps) {
  // Validación robusta con valores por defecto
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
        icon={<Euro className="w-6 h-6 text-white" />}
        iconBgColor="bg-gradient-to-br from-emerald-400 to-teal-500"
        title="Precio actual"
        price={`${currentPrice.toFixed(2)}€/kWh`}
        description="Momento ideal para usar electrodomésticos"
      />
      
      <PriceCard
        icon={<Clock className="w-6 h-6 text-white" />}
        iconBgColor="bg-gradient-to-br from-amber-400 to-orange-500"
        title="Próxima hora"
        price={`${nextHourPrice.toFixed(2)}€/kWh`}
        description={`Precio bajará un ${Math.abs(priceChangePercentage)}%`}
      />
      
      <PriceCard
        icon={<TrendingUp className="w-6 h-6 text-white" />}
        iconBgColor="bg-gradient-to-br from-purple-400 to-pink-500"
        title="Ahorro este mes"
        price={`${monthlySavings}%`}
        description={`Comparado con ${comparisonType}`}
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
}

const PriceCard = memo(function PriceCard({ icon, iconBgColor, title, price, description }: PriceCardProps) {
  return (
    <Card className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/10">
      <CardContent className="p-6">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-full ${iconBgColor} flex items-center justify-center mb-4 shadow-lg`}>
          {icon}
        </div>
        
        {/* Price */}
        <div className="text-3xl font-bold text-white mb-1">
          {price}
        </div>
        
        {/* Title */}
        <div className="text-white/90 font-medium mb-2">
          {title}
        </div>
        
        {/* Description */}
        <div className="text-white/70 text-sm">
          {description}
        </div>
      </CardContent>
    </Card>
  )
})