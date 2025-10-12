// Tipos y utilidades para PriceChart
export type PeriodType = 'hoy' | 'semana' | 'mes'
export type ChartType = 'bar' | 'line' | 'pie'

export interface PriceData {
  hour: number
  price: number
  timestamp: Date
  label?: string
  weekday?: number // 0=lun, 1=mar, ... 6=dom (para semana)
  day?: number     // 1-31 (para mes)
}

export interface LegendItem {
  level: string
  color: string
  textColor: string
  min: number
  max: number
  label: string
  range: string
  description: string
}

// Funciones de utilidad
export function formatPrice(price: number): string {
  return `${price.toFixed(4)} €/kWh`
}

export function formatHour(hour: number): string {
  return hour.toString().padStart(2, '0')
}

export function getBarColor(level: string): string {
  switch (level) {
    case 'bajo': return 'bg-emerald-500'
    case 'medio': return 'bg-amber-500'
    case 'alto': return 'bg-orange-500'
    case 'muy-alto': return 'bg-red-500'
    default: return 'bg-gray-400'
  }
}

export function getChartColors(level: string): { bg: string; border: string; fill: string } {
  switch (level) {
    case 'bajo': return { bg: '#10b981', border: '#059669', fill: '#d1fae5' }
    case 'medio': return { bg: '#f59e0b', border: '#d97706', fill: '#fef3c7' }
    case 'alto': return { bg: '#f97316', border: '#ea580c', fill: '#fed7aa' }
    case 'muy-alto': return { bg: '#ef4444', border: '#dc2626', fill: '#fecaca' }
    default: return { bg: '#6b7280', border: '#4b5563', fill: '#f3f4f6' }
  }
}

export function classifyPrice(price: number, allPrices: PriceData[]): string {
  if (!allPrices.length) return 'medio'
  
  const priceValues = allPrices.map(p => p.price)
  const min = Math.min(...priceValues)
  const max = Math.max(...priceValues)
  const range = max - min
  const quarter = range / 4
  
  // Usar el mismo sistema de cuartiles que la leyenda
  if (price <= min + quarter) return 'bajo'
  if (price <= min + (quarter * 2)) return 'medio'
  if (price <= min + (quarter * 3)) return 'alto'
  return 'muy-alto'
}