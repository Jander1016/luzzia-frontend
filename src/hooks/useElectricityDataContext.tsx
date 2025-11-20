'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { DashboardStats, ElectricityPrice } from '@/types/api'
import { electricityService } from '@/services/electricityService'

interface ElectricityDataState {
  // Critical data (loaded immediately)
  critical: {
    stats: DashboardStats | null
    isLoading: boolean
    error: string | null
    lastUpdated: Date | null
  }
  
  // Non-critical data (loaded on demand)
  charts: {
    todayPrices: ElectricityPrice[]
    weekPrices: ElectricityPrice[]
    monthPrices: ElectricityPrice[]
    isLoading: boolean
    error: string | null
    lastUpdated: Date | null
  }
  
  // recommendations: {
  //   data: PriceRecommendation[]
  //   isLoading: boolean
  //   error: string | null
  //   lastUpdated: Date | null
  // }
}

interface ElectricityDataActions {
  // Critical data actions
  loadCriticalData: () => Promise<void>
  
  // Chart data actions  
  loadChartData: () => Promise<void>
  loadWeekData: () => Promise<void>
  loadMonthData: () => Promise<void>
  
  // Recommendations
  // loadRecommendations: () => Promise<void>
  
  // Utils
  refetchAll: () => Promise<void>
}

type ElectricityDataContextType = ElectricityDataState & ElectricityDataActions

const ElectricityDataContext = createContext<ElectricityDataContextType | null>(null)

const initialState: ElectricityDataState = {
  critical: {
    stats: null,
    isLoading: false,
    error: null,
    lastUpdated: null
  },
  charts: {
    todayPrices: [],
    weekPrices: [],
    monthPrices: [],
    isLoading: false,
    error: null,
    lastUpdated: null
  },
  // recommendations: {
  //   data: [],
  //   isLoading: false,
  //   error: null,
  //   lastUpdated: null
  // }
}

export function ElectricityDataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ElectricityDataState>(initialState)

  // Critical data - Carga inmediata para Hero/PriceCards
  const loadCriticalData = useCallback(async () => {
    setState(prev => ({
      ...prev,
      critical: { ...prev.critical, isLoading: true, error: null }
    }))

    try {
      const stats = await Promise.race([
        electricityService.getDashboardStats(),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 3000)
        )
      ])

      setState(prev => ({
        ...prev,
        critical: {
          stats,
          isLoading: false,
          error: null,
          lastUpdated: new Date()
        }
      }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setState(prev => ({
        ...prev,
        critical: {
          ...prev.critical,
          isLoading: false,
          error: errorMessage
        }
      }))
    }
  }, [])

  // Chart data - Carga lazy
  const loadChartData = useCallback(async () => {
    setState(prev => ({
      ...prev,
      charts: { ...prev.charts, isLoading: true, error: null }
    }))

    try {
      const todayPrices = await Promise.race([
        electricityService.getTodayPrices(),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 5000)
        )
      ])

      setState(prev => ({
        ...prev,
        charts: {
          ...prev.charts,
          todayPrices,
          isLoading: false,
          error: null,
          lastUpdated: new Date()
        }
      }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error en gráficos'
      setState(prev => ({
        ...prev,
        charts: {
          ...prev.charts,
          isLoading: false,
          error: errorMessage
        }
      }))
    }
  }, [])

  const loadWeekData = useCallback(async () => {
    try {
      const weekPrices = await electricityService.getTodayPrices() // Ajustar endpoint
      setState(prev => ({
        ...prev,
        charts: {
          ...prev.charts,
          weekPrices,
          lastUpdated: new Date()
        }
      }))
    } catch (error) {
      console.warn('Error loading week data:', error)
    }
  }, [])

  const loadMonthData = useCallback(async () => {
    try {
      const monthPrices = await electricityService.getTodayPrices() // Ajustar endpoint
      setState(prev => ({
        ...prev,
        charts: {
          ...prev.charts,
          monthPrices,
          lastUpdated: new Date()
        }
      }))
    } catch (error) {
      console.warn('Error loading month data:', error)
    }
  }, [])

  // Recommendations - Carga lazy
  // const loadRecommendations = useCallback(async () => {
  //   setState(prev => ({
  //     ...prev,
  //     recommendations: { ...prev.recommendations, isLoading: true, error: null }
  //   }))

  //   try {
  //     const data = await Promise.race([
  //       electricityService.getRecommendations(),
  //       new Promise<never>((_, reject) => 
  //         setTimeout(() => reject(new Error('Timeout')), 5000)
  //       )
  //     ])

  //     setState(prev => ({
  //       ...prev,
  //       recommendations: {
  //         data,
  //         isLoading: false,
  //         error: null,
  //         lastUpdated: new Date()
  //       }
  //     }))
  //   } catch (error) {
  //     const errorMessage = error instanceof Error ? error.message : 'Error en recomendaciones'
  //     setState(prev => ({
  //       ...prev,
  //       recommendations: {
  //         ...prev.recommendations,
  //         isLoading: false,
  //         error: errorMessage
  //       }
  //     }))
  //   }
  // }, [])

  const refetchAll = useCallback(async () => {
    await Promise.all([
      loadCriticalData(),
      loadChartData(),
      // loadRecommendations()
    ])
  }, [loadCriticalData, loadChartData])

  const value: ElectricityDataContextType = {
    ...state,
    loadCriticalData,
    loadChartData,
    loadWeekData,
    loadMonthData,
    refetchAll
  }

  return (
    <ElectricityDataContext.Provider value={value}>
      {children}
    </ElectricityDataContext.Provider>
  )
}

export function useElectricityDataContext() {
  const context = useContext(ElectricityDataContext)
  if (!context) {
    throw new Error('useElectricityDataContext must be used within ElectricityDataProvider')
  }
  return context
}

// Hook específico para datos críticos (Hero/PriceCards)
export function useCriticalData() {
  const { critical, loadCriticalData } = useElectricityDataContext()
  return {
    stats: critical.stats,
    isLoading: critical.isLoading,
    error: critical.error,
    lastUpdated: critical.lastUpdated,
    refetch: loadCriticalData
  }
}

// Hook específico para datos de gráficos
export function useChartData() {
  const { charts, loadChartData, loadWeekData, loadMonthData } = useElectricityDataContext()
  return {
    todayPrices: charts.todayPrices,
    weekPrices: charts.weekPrices,
    monthPrices: charts.monthPrices,
    isLoading: charts.isLoading,
    error: charts.error,
    lastUpdated: charts.lastUpdated,
    loadToday: loadChartData,
    loadWeek: loadWeekData,
    loadMonth: loadMonthData
  }
}

// Hook específico para recomendaciones
// export function useRecommendations() {
//   const { recommendations, loadRecommendations } = useElectricityDataContext()
//   return {
//     data: recommendations.data,
//     isLoading: recommendations.isLoading,
//     error: recommendations.error,
//     lastUpdated: recommendations.lastUpdated,
//     load: loadRecommendations
//   }
// }