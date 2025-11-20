import { apiClient } from '@/lib/api/client'
import { 
  ElectricityPrice, 
  DashboardStats, 
  PriceRecommendation, 
  RecommendationsResponse,
  PriceStats,
  Contact,
} from '@/types/api'

import { isValidElectricityPrice, isValidDashboardStats } from '@/lib/api/validators'

class ElectricityService {
  // Precios promedio por mes del año actual
  async getMonthlyAverages(): Promise<{ month: number; avgPrice: number }[]> {
    try {
      const result = await apiClient.get<{ month: number; avgPrice: number }[]>(
        '/prices/monthly-averages'
      );
      if (!Array.isArray(result)) {
        throw new Error('Formato de datos mensual inválido');
      }
      return result;
    } catch (error) {
      console.error('Error obteniendo promedios mensuales:', error);
      throw error;
    }
  }

  // Precios promedio por semana del año actual
  async getWeeklyAverages(): Promise<{ week: number; avgPrice: number }[]> {
    try {
      const result = await apiClient.get<{ week: number; avgPrice: number }[]>(
        '/prices/weekly-averages'
      );
      if (!Array.isArray(result)) {
        throw new Error('Formato de datos semanal inválido');
      }
      return result;
    } catch (error) {
      console.error('Error obteniendo promedios semanales:', error);
      throw error;
    }
  }
  private endpoints = {
    pricesHistory: '/prices/history',
    pricesStats: '/prices/dashboard-stats', 
    pricesToday: '/prices/today',
    pricesTomorrow: '/prices/tomorrow',
    pricesHourly: '/prices/hourly',
    priceFetch: '/prices/fetch',
    recommendations: '/prices/recommendations', // If exists
    contacts: '/contacts'
  } as const

  // Today's prices (real backend endpoint)
  async getTodayPrices(): Promise<ElectricityPrice[]> {
    try {
      const prices = await apiClient.get<ElectricityPrice[]>(this.endpoints.pricesToday)
      
      if (!Array.isArray(prices)) {
        throw new Error('Formato de datos de precios inválido')
      }

      // Validate each array element
      prices.forEach((price, index) => {
        if (!isValidElectricityPrice(price)) {
          if (process.env.NODE_ENV === 'development') {
            console.warn(`Precio de electricidad inválido en índice ${index}:`, price)
          }
        }
      })

      return prices
    } catch (error) {
      console.error('Error obteniendo precios de hoy:', error)
      throw error
    }
  }

  // Tomorrow's prices (real backend endpoint)
  async getTomorrowPrices(): Promise<ElectricityPrice[]> {
    try {
      const prices = await apiClient.get<ElectricityPrice[]>(this.endpoints.pricesTomorrow)
      
      if (!Array.isArray(prices)) {
        throw new Error('Invalid prices data format')
      }

      return prices
    } catch (error) {
      console.error('Error obteniendo precios de mañana:', error)
      throw error
    }
  }

  // Dashboard statistics (real backend endpoint)
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const stats = await apiClient.get<DashboardStats>(this.endpoints.pricesStats)

      if (!isValidDashboardStats(stats)) {
        throw new Error('Estructura de datos de estadísticas del dashboard inválida')
      }

      return stats
    } catch (error) {
      console.error('Error obteniendo estadísticas del dashboard:', error)
      throw error
    }
  }

  // Precios agregados por semana y mes (usando /prices/history)
  async getAggregatedPrices(period: 'week' | 'month'): Promise<ElectricityPrice[]> {
    try {
      const days = period === 'week' ? 7 : 30;
      const prices = await apiClient.get<ElectricityPrice[]>(`${this.endpoints.pricesHistory}?days=${days}`);
      if (!Array.isArray(prices)) {
        throw new Error('Formato de datos de precios inválido');
      }
      prices.forEach((price, index) => {
        if (!isValidElectricityPrice(price)) {
          console.warn(`Precio de electricidad inválido en índice ${index}:`, price);
        }
      });
      return prices;
    } catch (error) {
      console.error(`Error obteniendo precios agregados (${period}):`, error);
      throw error;
    }
  }

  // Price history (real backend endpoint)
  async getPriceHistory(days: number = 7): Promise<ElectricityPrice[]> {
    try {
      if (days < 1 || days > 365) {
        throw new Error('El parámetro days debe estar entre 1 y 365')
      }

      const prices = await apiClient.get<ElectricityPrice[]>(
        `${this.endpoints.pricesHistory}?days=${days}`
      )
      
      if (!Array.isArray(prices)) {
        throw new Error('Formato de datos de historial inválido')
      }

      return prices
    } catch (error) {
      console.error('Error obteniendo historial de precios:', error)
      throw error
    }
  }

  // Price statistics (real backend endpoint)
  async getPriceStats(days: number = 30): Promise<PriceStats> {
    try {
      if (days < 1 || days > 365) {
        throw new Error('El parámetro days debe estar entre 1 y 365')
      }

      const stats = await apiClient.get<PriceStats>(
        `${this.endpoints.pricesStats}?days=${days}`
      )
      
      if (!stats || typeof stats !== 'object') {
        throw new Error('Formato de datos de estadísticas inválido')
      }

      return stats
    } catch (error) {
      console.error('Error obteniendo estadísticas de precios:', error)
      throw error
    }
  }

  // Manual price fetching (triggers backend fetch)
  async fetchPrices(): Promise<{ message: string; success: boolean }> {
    try {
      const result = await apiClient.post<{ message: string; success: boolean }>(
        this.endpoints.priceFetch,
        {}
      )
      return result
    } catch (error) {
      console.error('Error ejecutando fetch de precios:', error)
      throw error
    }
  }

  // Price recommendations (if backend supports it)
  async getRecommendations(): Promise<PriceRecommendation[]> {
    try {
      const response = await apiClient.get<RecommendationsResponse>(
        this.endpoints.recommendations
      )
      
      // El backend devuelve un objeto con recommendations y dailyTip
      const recommendations = response?.recommendations
      
      if (!Array.isArray(recommendations)) {
        console.warn('Formato de respuesta inesperado:', response)
        return []
      }

      return recommendations
    } catch (error: unknown) {
      console.error('Error obteniendo recomendaciones:', error)
      
      // Manejo específico para errores de throttling
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number } }
        if (axiosError.response?.status === 429) {
          console.warn('Límite de tasa excedido - esperando antes de reintentar')
          return []
        }
      }
      
      // Return empty array instead of throwing for non-critical features
      return []
    }
  }

  // Contact management
  async getContacts(): Promise<Contact[]> {
    try {
      const contacts = await apiClient.get<Contact[]>(this.endpoints.contacts)
      
      if (!Array.isArray(contacts)) {
        throw new Error('Formato de datos de contactos inválido')
      }

      return contacts
    } catch (error) {
      console.error('Error obteniendo contactos:', error)
      throw error
    }
  }

  async createContact(contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contact> {
    try {
      const newContact = await apiClient.post<Contact>(this.endpoints.contacts, contact)
      return newContact
    } catch (error) {
      console.error('Error creando contacto:', error)
      throw error
    }
  }

  async updateContact(id: string, contact: Partial<Contact>): Promise<Contact> {
    try {
      const updatedContact = await apiClient.put<Contact>(
        `${this.endpoints.contacts}/${id}`,
        contact
      )
      return updatedContact
    } catch (error) {
      console.error('Error actualizando contacto:', error)
      throw error
    }
  }

  async deleteContact(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.endpoints.contacts}/${id}`)
    } catch (error) {
      console.error('Error eliminando contacto:', error)
      throw error
    }
  }
}

// Export singleton instance
export const electricityService = new ElectricityService()
export default electricityService

export async function getMonthlyDailyAverages(month: number, year: number) {
  const response = await apiClient.get<{ day: number; month: number; year: number; avgPrice: number | null }[]>(
    `/prices/daily-averages?month=${month}&year=${year}`
  );
  return response;
}