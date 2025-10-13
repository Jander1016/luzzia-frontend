import { DashboardStats, ElectricityPrice } from "@/types/api"

export const isValidElectricityPrice = (data: unknown): data is ElectricityPrice => {
  if (!data || typeof data !== 'object') return false
  const obj = data as Record<string, unknown>
  return (
    typeof obj.date === 'string' &&
    typeof obj.hour === 'number' &&
    typeof obj.price === 'number' &&
    typeof obj.isFallback === 'boolean' &&
    typeof obj.timestamp === 'string'
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