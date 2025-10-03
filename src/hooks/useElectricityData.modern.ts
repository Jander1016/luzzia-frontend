'use client'

import { useAsyncData, useRealtimeData } from './useAsyncData.optimized'
import { electricityService } from '@/services/electricityService'
import { 
  DashboardStats,
  PriceLevel 
} from '@/types/api'

/**
 * Hook to get today's prices with automatic updates
 * Optimized for React Compiler
 */
export function useTodayPrices() {
  return useRealtimeData(
    () => electricityService.getTodayPrices(),
    0 // Disabled polling - only manual refresh
  )
}

/**
 * Hook to get tomorrow's prices
 */
export function useTomorrowPrices() {
  return useAsyncData(
    () => electricityService.getTomorrowPrices(),
    {
      refetchInterval: 0 // Disabled polling - only manual refresh
    }
  )
}

/**
 * Hook para estadísticas del dashboard con actualización frecuente
 */
export function useDashboardStats() {
  return useRealtimeData(
    () => electricityService.getDashboardStats(),
    0 // Disabled polling - only manual refresh
  )
}

/**
 * Hook para recomendaciones
 */
export function usePriceRecommendations() {
  return useAsyncData(
    () => electricityService.getRecommendations(),
    {
      refetchInterval: 0, // Disabled polling - only manual refresh
      retryCount: 2 // Intentar hasta 2 veces en caso de error
    }
  )
}

/**
 * Hook para historial de precios
 */
export function usePriceHistory(days: number = 7) {
  return useAsyncData(
    () => electricityService.getPriceHistory(days),
    {
      refetchInterval: 0 // Disabled polling - only manual refresh
    }
  )
}

/**
 * Hook que combina todos los datos del dashboard
 * Optimizado para React Compiler - no necesita useMemo manual
 */
export function useElectricityDashboard() {
  const stats = useDashboardStats()
  const todayPrices = useTodayPrices()
  const recommendations = usePriceRecommendations()

  // React Compiler optimizará automáticamente este cálculo
  const isLoading = stats.isLoading || todayPrices.isLoading || recommendations.isLoading
  const hasError = Boolean(stats.error || todayPrices.error || recommendations.error)
  const errors = [stats.error, todayPrices.error, recommendations.error].filter(Boolean)
  
  const lastUpdated = new Date(Math.max(
    stats.lastUpdated?.getTime() || 0,
    todayPrices.lastUpdated?.getTime() || 0,
    recommendations.lastUpdated?.getTime() || 0
  ))

  const refetch = () => {
    stats.refetch()
    todayPrices.refetch()
    recommendations.refetch()
  }

  return {
    stats: stats.data,
    prices: todayPrices.data || [],
    recommendations: recommendations.data || [],
    isLoading,
    error: hasError ? errors.join(', ') : null,
    lastUpdated,
    refetch
  }
}

/**
 * Hook para análisis de precios con niveles
 * React Compiler optimiza automáticamente los cálculos
 */
export function usePriceAnalysis() {
  const { data: prices, ...rest } = useTodayPrices()

  if (!prices || prices.length === 0) {
    return { ...rest, data: null }
  }

  // React Compiler optimizará estos cálculos automáticamente
  const priceValues = prices.map(p => p.price)
  const min = Math.min(...priceValues)
  const max = Math.max(...priceValues)
  const avg = priceValues.reduce((sum, p) => sum + p, 0) / priceValues.length

  // Definir niveles de precios
  const levels: PriceLevel[] = [
    { level: 'bajo', threshold: avg * 0.7, color: 'text-green-600', bgColor: 'bg-green-500' },
    { level: 'medio', threshold: avg * 1.1, color: 'text-yellow-600', bgColor: 'bg-yellow-500' },
    { level: 'alto', threshold: avg * 1.3, color: 'text-orange-600', bgColor: 'bg-orange-500' },
    { level: 'muy-alto', threshold: Infinity, color: 'text-red-600', bgColor: 'bg-red-500' }
  ]

  // Clasificar precios por niveles
  const pricesWithLevels = prices.map(price => ({
    ...price,
    level: levels.find(level => price.price <= level.threshold)?.level || 'muy-alto'
  }))

  // Encontrar mejores y peores horas
  const sortedPrices = [...prices].sort((a, b) => a.price - b.price)
  const bestHours = sortedPrices.slice(0, 3)
  const worstHours = sortedPrices.slice(-3)
  const currentHour = new Date().getHours()

  const analysis = {
    prices: pricesWithLevels,
    stats: { min, max, avg },
    levels,
    bestHours,
    worstHours,
    currentHour
  }

  return {
    ...rest,
    data: analysis
  }
}

/**
 * Hook para forzar actualización de precios
 */
export function useForcePriceUpdate() {
  return useAsyncData(
    () => electricityService.fetchPrices(),
    { enabled: false } // Solo manual
  )
}