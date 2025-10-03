import { PriceData } from './types'

// Funciones de agregación de datos
export function aggregateDataByWeeks(prices: PriceData[]): PriceData[] {
  if (!prices.length) return []
  
  // Agrupar por semanas del mes actual
  const weeks: { [key: number]: PriceData[] } = {}
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  
  prices.forEach(price => {
    const date = new Date(price.timestamp || price.timestamp)
    if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
      const weekOfMonth = Math.ceil(date.getDate() / 7)
      if (!weeks[weekOfMonth]) weeks[weekOfMonth] = []
      weeks[weekOfMonth].push(price)
    }
  })
  
  // Convertir a array de promedios semanales
  return Object.keys(weeks).map(weekNum => {
    const weekPrices = weeks[parseInt(weekNum)]
    const avgPrice = weekPrices.reduce((sum, p) => sum + p.price, 0) / weekPrices.length
    return {
      hour: parseInt(weekNum),
      price: avgPrice,
      timestamp: new Date(),
      label: `Semana ${weekNum}`
    }
  }).sort((a, b) => a.hour - b.hour)
}

export function aggregateDataByMonths(prices: PriceData[]): PriceData[] {
  if (!prices.length) return []
  
  // Agrupar por meses del año actual
  const months: { [key: number]: PriceData[] } = {}
  const currentYear = new Date().getFullYear()
  
  prices.forEach(price => {
    const date = new Date(price.timestamp || price.timestamp)
    if (date.getFullYear() === currentYear) {
      const month = date.getMonth()
      if (!months[month]) months[month] = []
      months[month].push(price)
    }
  })
  
  // Convertir a array de promedios mensuales
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]
  
  return Object.keys(months).map(monthNum => {
    const monthPrices = months[parseInt(monthNum)]
    const avgPrice = monthPrices.reduce((sum, p) => sum + p.price, 0) / monthPrices.length
    return {
      hour: parseInt(monthNum) + 1,
      price: avgPrice,
      timestamp: new Date(),
      label: monthNames[parseInt(monthNum)]
    }
  }).sort((a, b) => a.hour - b.hour)
}