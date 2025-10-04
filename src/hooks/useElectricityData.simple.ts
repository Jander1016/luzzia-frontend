'use client'

import { useState, useEffect, useCallback } from 'react'
import { electricityService } from '@/services/electricityService'
import { DashboardStats, PriceRecommendation, ElectricityPrice, PriceLevel } from '@/types/api'
import { useHourlyEffect } from './useHourlyUpdate'

interface UseElectricityDataReturn {
  stats: DashboardStats | null
  recommendations: PriceRecommendation[]
  prices: ElectricityPrice[]
  isLoading: boolean
  error: string | null
  refetch: () => void
  lastUpdated: Date | null
}

/**
 * Hook simplificado para datos de electricidad
 * - Solo carga inicial al montar el componente
 * - Refetch manual cuando el usuario lo solicita
 * - Refetch automático solo al cambiar la hora (ya que la API se actualiza cada hora)
 */
export function useElectricityData(): UseElectricityDataReturn {
  const [data, setData] = useState<{
    stats: DashboardStats | null
    recommendations: PriceRecommendation[]
    prices: ElectricityPrice[]
  }>({
    stats: null,
    recommendations: [],
    prices: []
  })
  
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Hacer todas las llamadas en paralelo
      const [statsResult, pricesResult, recommendationsResult] = await Promise.all([
        electricityService.getDashboardStats().catch(err => {
          console.warn('⚠️ Error obteniendo stats:', err)
          return null
        }),
        electricityService.getTodayPrices().catch(err => {
          console.warn('⚠️ Error obteniendo precios:', err)
          return []
        }),
        electricityService.getRecommendations().catch(err => {
          console.warn('⚠️ Error obteniendo recomendaciones:', err)
          return []
        })
      ])

      setData({
        stats: statsResult,
        prices: pricesResult,
        recommendations: recommendationsResult
      })
      
      setLastUpdated(new Date())
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      console.error('❌ Error obteniendo datos de electricidad:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Efecto para carga inicial
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Actualizar cuando cambia la hora (ya que la API se actualiza cada hora)
  useHourlyEffect(() => {
    fetchData()
  })

  const refetch = useCallback(() => {
    fetchData()
  }, [fetchData])

  return {
    stats: data.stats,
    prices: data.prices,
    recommendations: data.recommendations,
    isLoading,
    error,
    refetch,
    lastUpdated
  }
}

/**
 * Hook simplificado para obtener solo los precios de hoy
 */
export function useTodayPrices() {
  const [prices, setPrices] = useState<ElectricityPrice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPrices = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await electricityService.getTodayPrices()
      setPrices(result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error obteniendo precios'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPrices()
  }, [fetchPrices])

  return {
    data: prices,
    isLoading,
    error,
    refetch: fetchPrices
  }
}

/**
 * Hook simplificado para obtener precios de mañana
 */
export function useTomorrowPrices() {
  const [prices, setPrices] = useState<ElectricityPrice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPrices = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await electricityService.getTomorrowPrices()
      setPrices(result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error obteniendo precios de mañana'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPrices()
  }, [fetchPrices])

  return {
    data: prices,
    isLoading,
    error,
    refetch: fetchPrices
  }
}

/**
 * Hook simplificado para estadísticas del dashboard
 */
export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await electricityService.getDashboardStats()
      setStats(result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error obteniendo estadísticas'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    data: stats,
    isLoading,
    error,
    refetch: fetchStats
  }
}

/**
 * Hook para análisis de precios basado en los precios de hoy
 */
/**
 * Hook para obtener precios de la semana
 */
export function useWeekPrices() {
  const [data, setData] = useState<ElectricityPrice[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const result = await electricityService.getHourlyPrices('week')
      setData(result || [])
    } catch (err) {
      console.error('❌ Error obteniendo precios de la semana:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Refetch automático cada hora
  useHourlyEffect(fetchData)

  return {
    data,
    isLoading,
    error,
    refetch: fetchData
  }
}

/**
 * Hook para obtener precios del mes
 */
export function useMonthPrices() {
  const [data, setData] = useState<ElectricityPrice[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const result = await electricityService.getHourlyPrices('month')
      setData(result || [])
    } catch (err) {
      console.error('❌ Error obteniendo precios del mes:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Refetch automático cada hora
  useHourlyEffect(fetchData)

  return {
    data,
    isLoading,
    error,
    refetch: fetchData
  }
}

export function usePriceAnalysis() {
  const { data: prices, isLoading, error, refetch } = useTodayPrices()

  if (!prices || prices.length === 0) {
    return { data: null, isLoading, error, refetch }
  }

  // Calcular estadísticas
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
  const pricesWithLevels = prices.map(price => {
    const level = levels.find(l => price.price <= l.threshold) || levels[levels.length - 1]
    return { ...price, level: level.level, color: level.color, bgColor: level.bgColor }
  })

  // Encontrar mejores y peores horas
  const sortedByPrice = [...prices].sort((a, b) => a.price - b.price)
  const bestHours = sortedByPrice.slice(0, 6) // 6 mejores horas
  const worstHours = sortedByPrice.slice(-6).reverse() // 6 peores horas

  return {
    data: {
      prices: pricesWithLevels,
      stats: { min, max, avg },
      bestHours,
      worstHours,
      levels
    },
    isLoading,
    error,
    refetch
  }
}