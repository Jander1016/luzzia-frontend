import { DashboardStats, ElectricityPrice } from "@/types/api"

export const isValidElectricityPrice = (data: unknown): data is ElectricityPrice => {
  if (!data || typeof data !== 'object') return false
  const obj = data as Record<string, unknown>
  return (
    typeof obj.timestamp === 'string' &&
    typeof obj.price === 'number' &&
    typeof obj.currency === 'string' &&
    ['low', 'medium', 'high', 'very_high'].includes(obj.period as string)
  )
}

export const isValidDashboardStats = (data: unknown): data is DashboardStats => {
  if (!data || typeof data !== 'object') return false
  const obj = data as Record<string, unknown>
  return (
    typeof obj.currentPrice === 'number' &&
    typeof obj.minPrice === 'number' &&
    typeof obj.minPriceHour === 'number' &&
    typeof obj.maxPrice === 'number' &&
    typeof obj.maxPriceHour === 'number' &&
    typeof obj.lastUpdated === 'string'
  )
}