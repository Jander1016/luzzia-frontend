/**
 * Servicio para obtener precios de electricidad del backend
 * Optimizado para las 3 cards específicas requeridas
 */

import { DashboardStats, ElectricityPrice, ApiResponse } from '@/types/api'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

/**
 * Obtiene los datos del dashboard desde el backend
 */
export async function getDashboardStats(): Promise<DashboardStats | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
      headers: {
        'Content-Type': 'application/json',
      },
      // Cache por 5 minutos
      next: { revalidate: 300 }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: ApiResponse<DashboardStats> = await response.json()
    return data.data
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return null
  }
}

/**
 * Obtiene los precios del día actual para encontrar el más alto y más bajo
 */
export async function getDailyPrices(): Promise<ElectricityPrice[]> {
  try {
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
    const response = await fetch(`${API_BASE_URL}/prices/daily?date=${today}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      // Cache por 1 hora
      next: { revalidate: 3600 }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: ApiResponse<ElectricityPrice[]> = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching daily prices:', error)
    return []
  }
}

/**
 * Obtiene el precio actual de la electricidad
 */
export async function getCurrentPrice(): Promise<number> {
  try {
    const response = await fetch(`${API_BASE_URL}/prices/current`, {
      headers: {
        'Content-Type': 'application/json',
      },
      // Cache por 15 minutos
      next: { revalidate: 900 }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: ApiResponse<{ price: number }> = await response.json()
    return data.data.price
  } catch (error) {
    console.error('Error fetching current price:', error)
    return 0
  }
}

/**
 * Hook para usar en componentes React Server Components
 * Obtiene todos los datos necesarios para las 3 cards
 */
export async function getPriceCardsData() {
  try {
    // Ejecutar peticiones en paralelo para mejor performance
    const [statsResult, dailyPricesResult] = await Promise.allSettled([
      getDashboardStats(),
      getDailyPrices()
    ])

    const stats = statsResult.status === 'fulfilled' ? statsResult.value : null
    const dailyPrices = dailyPricesResult.status === 'fulfilled' ? dailyPricesResult.value : []

    return {
      stats,
      dailyPrices,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error fetching price cards data:', error)
    return {
      stats: null,
      dailyPrices: [],
      timestamp: new Date().toISOString()
    }
  }
}

/**
 * Versión para cliente (con React Query o SWR)
 */
export const priceCardsApiUrls = {
  dashboard: `${API_BASE_URL}/dashboard/stats`,
  dailyPrices: (date?: string) => {
    const targetDate = date || new Date().toISOString().split('T')[0]
    return `${API_BASE_URL}/prices/daily?date=${targetDate}`
  },
  currentPrice: `${API_BASE_URL}/prices/current`
}