'use client'

import { memo, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Zap, 
  TrendingDown, 
  TrendingUp, 
  Clock4
} from 'lucide-react'
import { DashboardStats, ElectricityPrice } from '@/types/api'

interface PriceCardsV2Props {
  stats: DashboardStats | null
  dailyPrices?: ElectricityPrice[]
  isLoading?: boolean
}

// Interface para las cards específicas
interface PriceCardData {
  id: string
  title: string
  price: string
  subtitle: string
  icon: React.ReactNode
  colorClass: string
  iconBgClass: string
}

export const PriceCardsV2 = memo(function PriceCardsV2({ 
  stats, 
  dailyPrices = [], 
  isLoading = false 
}: PriceCardsV2Props) {
  
  // Procesamiento de datos reales de la API
  const processedData = useMemo(() => {
    if (!stats && dailyPrices.length === 0) {
      return null;
    }

    const currentHour = new Date().getHours();
    
    // Datos del precio actual
    const currentPrice = stats?.currentPrice ?? 0;
    
    // Encontrar precios más bajo y más alto del día desde la API
    let lowestPrice = { price: 0, hour: 0 };
    let highestPrice = { price: 0, hour: 0 };
    
    if (dailyPrices.length > 0) {
      const prices = dailyPrices.map(p => ({ price: p.price, hour: p.hour }));
      lowestPrice = prices.reduce((min, current) => 
        current.price < min.price ? current : min
      );
      highestPrice = prices.reduce((max, current) => 
        current.price > max.price ? current : max
      );
    }

    return {
      current: {
        price: currentPrice,
        hour: currentHour
      },
      lowest: lowestPrice,
      highest: highestPrice,
      lastUpdated: stats?.lastUpdated ?? new Date().toISOString()
    };
  }, [stats, dailyPrices]);

  if (isLoading) {
    return <PriceCardsSkeleton />
  }

  if (!processedData) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No hay datos disponibles</p>
      </div>
    );
  }

  // Configuración de las 3 cards requeridas
  const cardsData: PriceCardData[] = [
    {
      id: 'current',
      title: 'PRECIO ACTUAL',
      price: `${processedData.current.price.toFixed(4)} €/kWh`,
      subtitle: `Hora: ${processedData.current.hour.toString().padStart(2, '0')}:00`,
      icon: <Zap className="size-6 text-white" aria-hidden="true" />,
      colorClass: 'bg-blue-800',
      iconBgClass: 'bg-blue-900/50'
    },
    {
      id: 'lowest',
      title: 'PRECIO MÁS BAJO DEL DÍA',
      price: `${processedData.lowest.price.toFixed(4)} €/kWh`,
      subtitle: `Hora: ${processedData.lowest.hour.toString().padStart(2, '0')}:00`,
      icon: <TrendingDown className="size-6 text-white" aria-hidden="true" />,
      colorClass: 'bg-green-800',
      iconBgClass: 'bg-green-900/50'
    },
    {
      id: 'highest',
      title: 'PRECIO MÁS ALTO DEL DÍA',
      price: `${processedData.highest.price.toFixed(4)} €/kWh`,
      subtitle: `Hora: ${processedData.highest.hour.toString().padStart(2, '0')}:00`,
      icon: <TrendingUp className="size-6 text-white" aria-hidden="true" />,
      colorClass: 'bg-red-800',
      iconBgClass: 'bg-red-900/50'
    }
  ];

  if (isLoading) {
    return <PriceCardsSkeleton />
  }

  return (
    <section 
      className="space-y-8"
      role="region"
      aria-labelledby="price-cards-heading"
    >
      {/* Current time indicator */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full backdrop-blur-sm">
          <Clock4 className="size-4 text-primary" aria-hidden="true" />
          <span className="text-sm font-medium" id="price-cards-heading">
            Datos actualizados: {new Date(processedData.lastUpdated).toLocaleTimeString('es-ES', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
      </div>

      {/* Main price cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cardsData.map((card) => (
          <PriceCard key={card.id} {...card} />
        ))}
      </div>
    </section>
  )
})

// Componente individual de card optimizado
const PriceCard = memo(function PriceCard({
  id,
  title,
  price,
  subtitle,
  icon,
  colorClass,
  iconBgClass
}: PriceCardData) {
  return (
    <Card 
      className={`
        relative overflow-hidden transition-all duration-300 
        hover:scale-[1.02] hover:shadow-xl
        ${colorClass} text-white border-0
        focus-within:ring-2 focus-within:ring-white focus-within:ring-offset-2
      `}
      role="article"
      aria-labelledby={`price-card-${id}-title`}
    >
      <CardContent className="p-6 space-y-4">
        {/* Icon */}
        <div className={`
          size-12 rounded-full ${iconBgClass}
          flex items-center justify-center
          transition-transform duration-300 hover:scale-110
        `}>
          {icon}
        </div>
        
        {/* Title */}
        <div>
          <h3 
            id={`price-card-${id}-title`} 
            className="text-sm font-semibold tracking-wide uppercase text-white/90 mb-2"
          >
            {title}
          </h3>
        </div>
        
        {/* Main Price - prominente */}
        <div className="text-3xl font-bold text-white">
          {price}
        </div>
        
        {/* Hour info */}
        <div className="text-sm text-white/80">
          {subtitle}
        </div>
      </CardContent>
    </Card>
  )
})

const PriceCardsSkeleton = memo(function PriceCardsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <div className="h-8 w-48 bg-muted/50 rounded-full animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-6 space-y-4 bg-muted/20">
            <div className="size-12 bg-muted/50 rounded-full animate-pulse" />
            <div className="h-4 w-32 bg-muted/50 rounded animate-pulse" />
            <div className="h-8 w-28 bg-muted/50 rounded animate-pulse" />
            <div className="h-3 w-20 bg-muted/50 rounded animate-pulse" />
          </Card>
        ))}
      </div>
    </div>
  )
})