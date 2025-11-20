import { PriceData, PeriodType, LegendItem, ChartType } from './types'
import { DailyPriceAvg } from '@/hooks/useElectricityData'
import { formatPrice } from './types'

// Función para generar leyendas dinámicas basadas en los datos reales
export function generateDynamicLegend(
  prices: PriceData[] | DailyPriceAvg[] | { month: number; avgPrice: number }[] | { week: number; avgPrice: number }[],
  period: PeriodType,
  _chartType: ChartType = 'bar'
): LegendItem[] {
  if (!prices.length) return [];

  // Type guards
  const isPriceDataArray = (arr: unknown[]): arr is PriceData[] => arr.length > 0 && 'hour' in (arr[0] as object);
  const isDailyPriceAvgArray = (arr: unknown[]): arr is DailyPriceAvg[] => arr.length > 0 && 'date' in (arr[0] as object);
  const isMonthlyAvgArray = (arr: unknown[]): arr is { month: number; avgPrice: number }[] => arr.length > 0 && 'month' in (arr[0] as object);
  const isWeeklyAvgArray = (arr: unknown[]): arr is { week: number; avgPrice: number }[] => arr.length > 0 && 'week' in (arr[0] as object);

  let priceValues: number[] = [];
  if (isPriceDataArray(prices) || isDailyPriceAvgArray(prices)) {
    priceValues = prices.map(p => p.price).filter(v => typeof v === 'number' && !isNaN(v) && v > 0);
  } else if (isMonthlyAvgArray(prices)) {
    priceValues = prices.map(p => p.avgPrice).filter(v => typeof v === 'number' && !isNaN(v) && v > 0);
  } else if (isWeeklyAvgArray(prices)) {
    priceValues = prices.map(p => p.avgPrice).filter(v => typeof v === 'number' && !isNaN(v) && v > 0);
  }

  if (!priceValues.length) {
    // Si no hay datos válidos, mostrar leyenda vacía o con mensaje
    return [
      {
        level: 'sin-datos',
        color: 'bg-gray-500',
        textColor: 'text-gray-400',
        min: 0,
        max: 0,
        label: 'Sin datos',
        range: 'No disponible',
        description: 'No hay datos válidos para mostrar'
      }
    ];
  }

  const min = Math.min(...priceValues);
  const max = Math.max(...priceValues);
  const range = max - min;
  const quarter = range / 4;

  const ranges = [
    {
      level: 'bajo',
      color: 'bg-emerald-500',
      textColor: 'text-emerald-400',
      min: min,
      max: min + quarter,
      label: 'Bajo'
    },
    {
      level: 'medio',
      color: 'bg-amber-500',
      textColor: 'text-amber-400',
      min: min + quarter,
      max: min + (quarter * 2),
      label: 'Medio'
    },
    {
      level: 'alto',
      color: 'bg-orange-500',
      textColor: 'text-orange-400',
      min: min + (quarter * 2),
      max: min + (quarter * 3),
      label: 'Alto'
    },
    {
      level: 'muy-alto',
      color: 'bg-red-500',
      textColor: 'text-red-400',
      min: min + (quarter * 3),
      max: max,
      label: 'Muy Alto'
    }
  ];

  // Formatear rangos según el período
  return ranges.map(range => ({
    ...range,
    range: `${formatPrice(range.min)}-${formatPrice(range.max)}`,
    description:
      period === 'hoy' ? 'por hora'
      : period === 'semana' ? (isWeeklyAvgArray(prices) ? 'promedio semanal' : 'por día')
      : period === 'mes' ? (isMonthlyAvgArray(prices) ? 'promedio mensual' : 'por día')
      : 'promedio'
  }));
}