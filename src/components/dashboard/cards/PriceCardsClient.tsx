"use client";
import { useEffect, useState } from 'react';
import { PriceCardServerData } from './PriceCardsServer';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, TrendingDown, TrendingUp } from 'lucide-react';
import { ElectricityPrice } from '@/types/api';
// import { color } from 'framer-motion';

interface PriceCardsClientProps {
  serverData: PriceCardServerData;
  dailyPrices: ElectricityPrice[];
}

export function PriceCardsClient({ serverData, dailyPrices }: PriceCardsClientProps) {
  // Estado para el precio actual que se actualiza cada hora
  const [currentPrice, setCurrentPrice] = useState(serverData.current.price);
  const [currentHour, setCurrentHour] = useState(serverData.current.hour);

  useEffect(() => {
    const updatePrice = () => {
      const now = new Date();
      const hour = now.getHours();
      const found = dailyPrices.find(p => p.hour === hour);
      setCurrentHour(hour);
      setCurrentPrice(found ? found.price : 0);
    };
    updatePrice();
    const interval = setInterval(updatePrice, 60 * 60 * 1000); // Actualiza cada hora
    return () => clearInterval(interval);
  }, [dailyPrices]);

  const cardsData = [
    {
      id: 'current',
      title: 'Precio en directo',
      price: `${currentPrice.toFixed(4)} €/kWh`,
      subtitle: `Hora actual: ${currentHour.toString().padStart(2, '0')}:00`,
      icon: <Zap className="size-7 text-sky-400" aria-hidden="true" />,
      percent: serverData.nextHourPercent
    },
    {
      id: 'lowest',
      title: 'Precio más barato',
      price: `${serverData.lowest.price.toFixed(4)} €/kWh`,
      subtitle: `Hora: ${serverData.lowest.hour.toString().padStart(2, '0')}:00`,
      icon: <TrendingDown className="size-7 text-green-500" aria-hidden="true" />,
      percent: serverData.lowestHighestPercent
    },
    {
      id: 'highest',
      title: 'Precio más caro',
      price: `${serverData.highest.price.toFixed(4)} €/kWh`,
      subtitle: `Hora: ${serverData.highest.hour.toString().padStart(2, '0')}:00`,
      icon: <TrendingUp className="size-7 text-red-500" aria-hidden="true" />,
      percent: serverData.highestCurrentPercent
    }
  ];

  // Card optimizada
  const borderColor = "border-[1px] border-violet-200";
  const bgColor = "bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900 border-slate-700/50";
  const titleColor = "text-white";
  return (
    <section className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cardsData.map((card) => {
          const priceColor = card.id === 'lowest' ? "text-emerald-500" : card.id === 'highest' ? "text-red-500" : "text-sky-400";
          return (
            <Card 
              key={card.id}
              className={`
                relative overflow-hidden transition-all duration-300 
                hover:scale-[1.03] hover:shadow-2xl
                ${bgColor} ${borderColor} rounded-2xl
                focus-within:ring-2 focus-within:ring-white focus-within:ring-offset-2
              `}
              role="article"
              aria-labelledby={`price-card-${card.id}-title`}
            >
              <CardContent className="p-7 space-y-3 flex flex-col items-center justify-center text-center">
                <div className={`size-14 rounded-full bg-slate-800 flex items-center justify-center mb-2 transition-transform duration-300 hover:scale-110`}>
                  {card.icon}
                </div>
                <h3 id={`price-card-${card.id}-title`} className={`text-2xl font-extrabold mb-2 ${titleColor}`}>{card.title}</h3>
                <div className={`text-2xl font-bold mb-1 ${priceColor}`}>{card.price}</div>
                {card.subtitle && <div className={`text-base text-white/80 mb-1`}>{card.subtitle}</div>}
                {card.percent && <div className={`text-xs font-semibold text-white/60`}>{card.percent}</div>}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

export function PriceCardsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <div className="h-8 w-48 bg-muted/50 rounded-full" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-6 space-y-4 bg-muted/20">
            <div className="size-12 bg-muted/50 rounded-full" />
            <div className="h-4 w-32 bg-muted/50 rounded" />
            <div className="h-8 w-28 bg-muted/50 rounded" />
            <div className="h-3 w-20 bg-muted/50 rounded " />
          </Card>
        ))}
      </div>
    </div>
  );
}
