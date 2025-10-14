'use client'

import { memo, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Zap, 
  TrendingDown, 
  TrendingUp
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
  percent?: string
}

export const PriceCardsV2 = memo(function PriceCardsV2({ 
  stats, 
  dailyPrices = [], 
  isLoading = false 
}: PriceCardsV2Props) {
  
  // Procesamiento de datos: Precio actual se actualiza cada hora, los otros una vez al día
  const processedData = useMemo(() => {
    if (!stats && dailyPrices.length === 0) {
      return null;
    }

    const now = new Date();
    const currentHour = now.getHours();
    // Precio actual: buscar en dailyPrices por la hora actual
    let currentPrice = 0;
    if (dailyPrices.length > 0) {
      const found = dailyPrices.find(p => p.hour === currentHour);
      currentPrice = found ? found.price : 0;
    } else {
      currentPrice = stats?.currentPrice ?? 0;
    }

    // Precios extremos: solo se actualizan una vez al día (stats)
    const lowestPrice = {
      price: stats?.minPrice ?? 0,
      hour: stats?.minPriceHour ?? 0
    };
    const highestPrice = {
      price: stats?.maxPrice ?? 0,
      hour: stats?.maxPriceHour ?? 0
    };

    return {
      current: {
        price: currentPrice,
        hour: currentHour
      },
      lowest: lowestPrice,
      highest: highestPrice,
      lastUpdated: stats?.lastUpdated ?? now.toISOString()
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

  // Calcular porcentaje de comparación respecto a la siguiente hora
  function getNextHourComparison(price: number, hour: number) {
    const nextHour = hour + 1;
    const nextPrice = dailyPrices.find(p => p.hour === nextHour)?.price;
    if (nextPrice && price > 0) {
      const percent = ((nextPrice - price) / price) * 100;
      return `${percent > 0 ? '+' : ''}${percent.toFixed(1)}% vs siguiente hora`;
    }
    return 'Sin comparación';
  }

  // Configuración de las 3 cards en el orden solicitado
  const cardsData: PriceCardData[] = [
    {
      id: 'current',
      title: 'Precio actual',
      price: `${processedData.current.price.toFixed(4)} €/kWh`,
      subtitle: `Hora actual: ${processedData.current.hour.toString().padStart(2, '0')}:00`,
      icon: <Zap className="size-7 text-cyan-500" aria-hidden="true" />,
      colorClass: 'bg-slate-900/80 shadow-lg',
      iconBgClass: 'bg-slate-800',
      percent: getNextHourComparison(processedData.current.price, processedData.current.hour)
    },
    {
      id: 'lowest',
      title: 'PRECIO MÁS BAJO DEL DÍA',
      price: `${processedData.lowest.price.toFixed(4)} €/kWh`,
      subtitle: `Hora: ${processedData.lowest.hour.toString().padStart(2, '0')}:00`,
      icon: <TrendingDown className="size-7 text-green-500" aria-hidden="true" />,
      colorClass: 'bg-slate-900/80 shadow-lg',
      iconBgClass: 'bg-slate-800',
      percent: getNextHourComparison(processedData.lowest.price, processedData.lowest.hour)
    },
    {
      id: 'highest',
      title: 'PRECIO MÁS ALTO DEL DÍA',
      price: `${processedData.highest.price.toFixed(4)} €/kWh`,
      subtitle: `Hora: ${processedData.highest.hour.toString().padStart(2, '0')}:00`,
      icon: <TrendingUp className="size-7 text-pink-500" aria-hidden="true" />,
      colorClass: 'bg-slate-900/80 shadow-lg',
      iconBgClass: 'bg-slate-800',
      percent: getNextHourComparison(processedData.highest.price, processedData.highest.hour)
    }
  ];

  if (isLoading) {
    return <PriceCardsSkeleton />
  }

  return (
    <section 
      className="space-y-8"
    >
      {/* Current time indicator */}
      {/* <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full backdrop-blur-sm">
          <Clock4 className="size-4 text-primary" aria-hidden="true" />
          <span className="text-sm font-medium" id="price-cards-heading">
            Datos actualizados: {new Date(processedData.lastUpdated).toLocaleTimeString('es-ES', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
      </div> */}

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
  percent
}: PriceCardData & { percent?: string }) {
  const borderColor = "border-[1px] border-violet-200";
  // const bgColor = "bg-[#14003a]";
  const bgColor ="bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900 border-slate-700/50"
  const titleColor = "text-white";
  const priceColor = id === 'lowest' ? "text-green-500" : id === 'highest' ? "text-red-500" : "text-cyan-500";
  return (
    <Card 
      className={`
        relative overflow-hidden transition-all duration-300 
        hover:scale-[1.03] hover:shadow-2xl
        ${bgColor} ${borderColor} rounded-2xl
        focus-within:ring-2 focus-within:ring-white focus-within:ring-offset-2
      `}
      role="article"
      aria-labelledby={`price-card-${id}-title`}
    >
      <CardContent className="p-7 space-y-3 flex flex-col items-center justify-center text-center">
        {/* Icon */}
        <div className={`size-14 rounded-full bg-slate-800 flex items-center justify-center mb-2 transition-transform duration-300 hover:scale-110`}>
          {icon}
        </div>
        {/* Title */}
        <h3 id={`price-card-${id}-title`} className={`text-2xl font-extrabold mb-2 ${titleColor}`}>{id === 'lowest' ? 'Precio más barato' : id === 'highest' ? 'Precio más caro' : title}</h3>
        {/* Main Price - prominente */}
        <div className={`text-2xl font-bold mb-1 ${priceColor}`}>{price}</div>
        {/* Hour info */}
        {subtitle && <div className={`text-base text-white/80 mb-1`}>{subtitle}</div>}
        {/* Percent comparison */}
        {percent && <div className={`text-xs font-semibold text-white/60`}>{percent}</div>}
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