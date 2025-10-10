'use client'

import { memo, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Zap, 
  TrendingDown, 
  TrendingUp, 
  Clock4, 
  ArrowUpRight,
  ArrowDownRight,
  Percent
} from 'lucide-react'
import { DashboardStats } from '@/types/api'

interface PriceCardsProps {
  stats: DashboardStats | null
  isLoading?: boolean
}

export const PriceCards = memo(function PriceCards({ stats, isLoading = false }: PriceCardsProps) {
  // Mock data para precios del día (esto vendría de tu API real)
  const mockDayPrices = useMemo(() => {
    const prices = []
    for (let hour = 0; hour < 24; hour++) {
      prices.push({
        hour,
        price: 0.08 + Math.random() * 0.15, // Precios entre 0.08 y 0.23
      })
    }
    return prices
  }, [])

  const currentHour = new Date().getHours()
  const currentTime = new Date().toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })

  // Análisis de precios del día
  const priceAnalysis = useMemo(() => {
    const sortedPrices = [...mockDayPrices].sort((a, b) => a.price - b.price)
    const currentPrice = mockDayPrices.find(p => p.hour === currentHour)?.price || 0.12
    const lowestPrice = sortedPrices[0]
    const highestPrice = sortedPrices[sortedPrices.length - 1]
    
    // Siguiente hora
    const nextHour = currentHour === 23 ? 0 : currentHour + 1
    const nextHourPrice = mockDayPrices.find(p => p.hour === nextHour)?.price || 0.10
    
    // Porcentaje de cambio respecto a siguiente hora
    const nextHourChange = ((nextHourPrice - currentPrice) / currentPrice) * 100
    
    // Porcentaje respecto al promedio del día
    const avgPrice = mockDayPrices.reduce((sum, p) => sum + p.price, 0) / mockDayPrices.length
    const avgComparison = ((currentPrice - avgPrice) / avgPrice) * 100

    return {
      current: { price: currentPrice, hour: currentHour },
      lowest: lowestPrice,
      highest: highestPrice,
      nextHour: { price: nextHourPrice, hour: nextHour, change: nextHourChange },
      avgComparison
    }
  }, [mockDayPrices, currentHour])

  // Note: Keeping safeStats for future API integration
  const _safeStats = stats || {
    currentPrice: priceAnalysis.current.price,
    nextHourPrice: priceAnalysis.nextHour.price,
    priceChangePercentage: priceAnalysis.nextHour.change,
    monthlySavings: 25,
    comparisonType: 'tarifa fija'
  }

  return (
    <div className="space-y-6">
      {/* Hora actual destacada */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
          <Clock4 className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">
            Datos actualizados a las {currentTime}
          </span>
        </div>
      </div>

      {/* Grid de 3 tarjetas principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. PRECIO ACTUAL */}
        <PriceCard
          icon={<Zap className="w-8 h-8 text-white" />}
          iconBgColor="bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/25"
          title="Precio Actual"
          subtitle={`${currentHour.toString().padStart(2, '0')}:00h - ${currentTime}`}
          price={isLoading ? "..." : `${priceAnalysis.current.price.toFixed(4)}€/kWh`}
          comparison={`${priceAnalysis.avgComparison > 0 ? '+' : ''}${priceAnalysis.avgComparison.toFixed(1)}% vs promedio hoy`}
          isGood={priceAnalysis.avgComparison < 0}
          isLoading={isLoading}
          badge="AHORA"
        />
        
        {/* 2. PRECIO MÁS BAJO DEL DÍA */}
        <PriceCard
          icon={<TrendingDown className="w-8 h-8 text-white" />}
          iconBgColor="bg-gradient-to-br from-green-500 to-green-600 shadow-green-500/25"
          title="Precio Más Bajo"
          subtitle={`Mejor hora: ${priceAnalysis.lowest.hour.toString().padStart(2, '0')}:00h`}
          price={`${priceAnalysis.lowest.price.toFixed(4)}€/kWh`}
          comparison={`${(((priceAnalysis.current.price - priceAnalysis.lowest.price) / priceAnalysis.lowest.price) * 100).toFixed(1)}% más caro ahora`}
          isGood={true}
          badge="MEJOR"
        />
        
        {/* 3. PRECIO MÁS ALTO DEL DÍA */}
        <PriceCard
          icon={<TrendingUp className="w-8 h-8 text-white" />}
          iconBgColor="bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/25"
          title="Precio Más Alto"
          subtitle={`Peor hora: ${priceAnalysis.highest.hour.toString().padStart(2, '0')}:00h`}
          price={`${priceAnalysis.highest.price.toFixed(4)}€/kWh`}
          comparison={`${(((priceAnalysis.highest.price - priceAnalysis.current.price) / priceAnalysis.current.price) * 100).toFixed(1)}% más caro que ahora`}
          isGood={false}
          badge="EVITAR"
        />
      </div>

      {/* Información de siguiente hora */}
      <Card className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-slate-600/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-white text-lg">
            <ArrowUpRight className={`w-5 h-5 ${priceAnalysis.nextHour.change > 0 ? 'text-red-400' : 'text-green-400'}`} />
            Próxima Hora ({priceAnalysis.nextHour.hour.toString().padStart(2, '0')}:00h)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-white mb-1">
                {priceAnalysis.nextHour.price.toFixed(4)}€/kWh
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                priceAnalysis.nextHour.change > 0 ? 'text-red-400' : 'text-green-400'
              }`}>
                {priceAnalysis.nextHour.change > 0 ? 
                  <ArrowUpRight className="w-4 h-4" /> : 
                  <ArrowDownRight className="w-4 h-4" />
                }
                {priceAnalysis.nextHour.change > 0 ? '+' : ''}{priceAnalysis.nextHour.change.toFixed(1)}%
              </div>
            </div>
            <div className="text-right">
              <div className="text-white/70 text-sm">
                {priceAnalysis.nextHour.change > 0 ? 'Subida de precio' : 'Bajada de precio'}
              </div>
              <div className="text-white/50 text-xs">
                vs hora actual
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
})

interface PriceCardProps {
  icon: React.ReactNode
  iconBgColor: string
  title: string
  subtitle: string
  price: string
  comparison: string
  isGood: boolean
  isLoading?: boolean
  badge?: string
}

const PriceCard = memo(function PriceCard({ 
  icon, 
  iconBgColor, 
  title, 
  subtitle,
  price, 
  comparison, 
  isGood,
  isLoading = false,
  badge
}: PriceCardProps) {
  return (
    <Card className={`
      relative overflow-hidden transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl
      ${isGood 
        ? 'bg-gradient-to-br from-green-900/20 to-green-800/30 border-green-600/50 hover:border-green-500/70' 
        : 'bg-gradient-to-br from-slate-800/80 to-slate-900/90 border-slate-700/50 hover:border-slate-600/70'
      }
      ${isLoading ? 'animate-pulse' : ''}
    `}>
      {badge && (
        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold ${
          badge === 'AHORA' ? 'bg-blue-500 text-white' :
          badge === 'MEJOR' ? 'bg-green-500 text-white' :
          'bg-red-500 text-white'
        }`}>
          {badge}
        </div>
      )}
      
      <CardContent className="p-6">
        <div className={`w-16 h-16 rounded-full ${iconBgColor} flex items-center justify-center mb-4 shadow-lg transition-all duration-300 group-hover:scale-110 ${isLoading ? 'opacity-50' : ''}`}>
          {icon}
        </div>
        
        <div className={`text-2xl font-bold mb-2 transition-colors duration-300 ${
          isGood ? 'text-green-400' : 'text-white'
        } ${isLoading ? 'opacity-50' : ''}`}>
          {price}
        </div>
        
        <div className={`text-white font-medium mb-1 text-sm ${isLoading ? 'opacity-50' : ''}`}>
          {title}
        </div>
        
        <div className={`text-white/70 text-xs mb-3 ${isLoading ? 'opacity-50' : ''}`}>
          {subtitle}
        </div>
        
        <div className={`flex items-center gap-1 text-xs ${
          isGood ? 'text-green-300' : 'text-white/60'
        } ${isLoading ? 'opacity-50' : ''}`}>
          <Percent className="w-3 h-3" />
          {comparison}
        </div>
      </CardContent>
    </Card>
  )
})
