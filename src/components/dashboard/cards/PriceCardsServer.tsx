import { DashboardStats, ElectricityPrice } from '@/types/api';

export interface PriceCardServerData {
  current: { price: number; hour: number };
  lowest: { price: number; hour: number };
  highest: { price: number; hour: number };
  lastUpdated: string;
  nextHourPercent: string;
  lowestHighestPercent: string;
  highestCurrentPercent: string;
}

export function processPriceCardsData(stats: DashboardStats | null, dailyPrices: ElectricityPrice[]): PriceCardServerData | null {
  if (!stats) return null;
  const now = new Date();
  const currentHour = now.getHours();
  // Buscar el precio de la siguiente hora en dailyPrices
  const nextHour = currentHour + 1;
  const nextPrice = dailyPrices.find(p => p.hour === nextHour)?.price;
  const currentPrice = dailyPrices.find(p => p.hour === currentHour)?.price ?? stats.currentPrice;
  const minPrice = Math.min(...dailyPrices.map(p => p.price));
  const maxPrice = Math.max(...dailyPrices.map(p => p.price));
  const minPriceHour = stats.minPriceHour ?? dailyPrices.find(p => p.price === minPrice)?.hour ?? 0;
  const maxPriceHour = stats.maxPriceHour ?? dailyPrices.find(p => p.price === maxPrice)?.hour ?? 0;

  // Calcular porcentajes
  const nextHourPercent = (nextPrice && currentPrice > 0)
    ? `${Math.abs(((nextPrice - currentPrice) / currentPrice) * 100).toFixed(1)}% ${nextPrice > currentPrice ? 'más caro' : 'más barato'} que la siguiente hora`
    : 'Sin comparación';
  const lowestHighestPercent = (minPrice > 0)
    ? `El precio más alto es ${Math.abs(((maxPrice - minPrice) / minPrice) * 100).toFixed(1)}% ${maxPrice > minPrice ? 'más caro' : 'más barato'} que el más bajo`
    : 'Sin comparación';
  const highestCurrentPercent = (currentPrice > 0)
    ? `El precio más alto es ${Math.abs(((maxPrice - currentPrice) / currentPrice) * 100).toFixed(1)}% ${maxPrice > currentPrice ? 'más caro' : 'más barato'} que el actual`
    : 'Sin comparación';
  return {
    current: { price: currentPrice, hour: currentHour },
    lowest: { price: minPrice, hour: minPriceHour },
    highest: { price: maxPrice, hour: maxPriceHour },
    lastUpdated: stats.lastUpdated,
    nextHourPercent,
    lowestHighestPercent,
    highestCurrentPercent
  };
}

// Este componente solo renderiza las cards, no hace cálculos
