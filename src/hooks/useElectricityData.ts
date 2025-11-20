"use client";

import { useState, useEffect, useCallback } from 'react'
import { electricityService } from '@/services/electricityService'
import { ElectricityPrice, PriceLevel } from '@/types/api'

// Tipo para promedio diario
export interface DailyPriceAvg {
  price: number;
  date: string;
}

/**
 * Hook para obtener solo los precios de hoy
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
 * Hook para análisis de precios
 */
export function usePriceAnalysis() {
  const { data: prices, isLoading, error, refetch } = useTodayPrices()

  if (!prices || prices.length === 0) {
    return { data: { prices: [] }, isLoading, error, refetch }
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
  const bestHours = sortedByPrice.slice(0, 6)
  const worstHours = sortedByPrice.slice(-6).reverse()

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

/**
 * Hook para obtener promedios semanales del año actual
 */
export function useWeeklyAverages() {
  const [data, setData] = useState<{ week: number; avgPrice: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await electricityService.getWeeklyAverages();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData
  };
}

/**
 * Hook para obtener promedios mensuales del año actual
 */
export function useMonthlyAverages() {
  const [data, setData] = useState<{ month: number; avgPrice: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await electricityService.getMonthlyAverages();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData
  };
}
