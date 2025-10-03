'use client'

import { DashboardStats, PriceRecommendation, ElectricityPrice } from '@/types/api'

// Importar la versión simplificada que no usa polling
export { 
  useElectricityData,
  useTodayPrices,
  useDashboardStats
} from './useElectricityData.simple'

// Mantener tipos exportados para compatibilidad
export interface UseElectricityDataReturn {
  stats: DashboardStats | null
  recommendations: PriceRecommendation[]
  prices: ElectricityPrice[]
  isLoading: boolean
  error: string | null
  refetch: () => void
  lastUpdated: Date | null
}