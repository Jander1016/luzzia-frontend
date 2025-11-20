// Tipos que coinciden exactamente con los DTOs del backend
export interface ElectricityPrice {
  date: Date
  hour: number
  price: number
  isFallback: boolean
  timestamp: Date
}

export interface PriceRecommendation {
  appliance: string
  type: 'ideal' | 'avoid' | 'schedule'  // Cambiado de 'recommendation' a 'type' para coincidir con el backend
  title: string
  description: string
  timeRange: string
  percentage?: string
  savingsPercentage?: number
}

export interface RecommendationsResponse {
  recommendations: PriceRecommendation[]
  dailyTip: string
}

export interface DashboardStats {
  currentPrice: number;
  minPrice: number;
  minPriceHour: number;
  maxPrice: number;
  maxPriceHour: number;
  lastUpdated: string;
}

// Tipos de respuesta de la API
export interface ApiResponse<T> {
  data: T
  message?: string
  timestamp: string
  version: string
}

export interface ApiError {
  error: string
  message: string
  statusCode: number
  timestamp: string
}

// Tipos adicionales para el frontend
export interface PriceHistory {
  prices: ElectricityPrice[]
  average: number
  min: number
  max: number
}

// Tipos para análisis de precios
export interface PriceLevel {
  level: 'bajo' | 'medio' | 'alto' | 'muy-alto'
  threshold: number
  color: string
  bgColor: string
}

// Tipo para estadísticas de precios del backend
export interface PriceStats {
  average: number
  min: number
  max: number
  count: number
}

// Contactos
export interface Contact {
  name: string
  email: string
}
