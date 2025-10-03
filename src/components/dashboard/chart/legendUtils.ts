import { PriceData, PeriodType, LegendItem, ChartType } from './types'
import { formatPrice } from './types'

// Función para generar leyendas dinámicas basadas en los datos reales
export function generateDynamicLegend(
  prices: PriceData[], 
  period: PeriodType,
  chartType: ChartType = 'bar'
): LegendItem[] {
  if (!prices.length) return []
  
  const priceValues = prices.map(p => p.price)
  const min = Math.min(...priceValues)
  const max = Math.max(...priceValues)
  
  // Calcular rangos dinámicos basados en los datos reales
  const range = max - min
  const quarter = range / 4
  
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
  ]
  
  // Formatear rangos según el período
  return ranges.map(range => ({
    ...range,
    range: `${formatPrice(range.min)}-${formatPrice(range.max)}`,
    description: period === 'hoy' ? 'por hora' : 
                period === 'semana' ? 'promedio semanal' : 'promedio mensual'
  }))
}