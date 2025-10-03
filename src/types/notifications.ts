export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  icon: NotificationIcon
  timestamp: Date
  isRead: boolean
  priority: NotificationPriority
  actionData?: NotificationActionData
  expiresAt?: Date
  metadata?: NotificationMetadata
}

export interface NotificationMetadata {
  priceLevel?: 'low' | 'medium' | 'high'
  currentHour?: number
  hoursUntil?: number
  nextOptimalHour?: number
  optimalHour?: number
  device?: string
  tipType?: 'time_optimization' | 'general_knowledge' | 'automation'
  [key: string]: string | number | boolean | undefined
}

export type NotificationType = 
  | 'optimal_time'      // Momento ideal - verde
  | 'avoid_usage'       // Evita usar ahora - naranja/rojo
  | 'schedule_device'   // Programa para - azul
  | 'tip_of_day'        // Consejo del día - púrpura
  | 'price_alert'       // Alerta de precio - amarillo

export type NotificationIcon = 
  | 'check-circle'      // Para optimal_time
  | 'alert-triangle'    // Para avoid_usage
  | 'clock'            // Para schedule_device
  | 'lightbulb'        // Para tip_of_day
  | 'trending-up'      // Para price_alert

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface NotificationActionData {
  timeRange?: {
    start: string  // HH:mm format
    end: string    // HH:mm format
  }
  savings?: number  // Percentage savings
  deviceType?: string
  currentPrice?: number
  optimalPrice?: number
}

export interface NotificationConfig {
  intervalMinutes: number
  maxNotifications: number
  enabledTypes: NotificationType[]
  quietHours?: {
    start: string  // HH:mm format
    end: string    // HH:mm format
  }
  autoExpireHours?: number
}

export interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  config: NotificationConfig
  isLoading: boolean
  lastGenerated: Date | null
}

export interface NotificationContextType extends NotificationState {
  // Actions
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAllNotifications: () => void
  updateConfig: (config: Partial<NotificationConfig>) => void
  generateRecommendations: () => Promise<void>
  
  // UI State
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export interface PriceRecommendationData {
  currentHour: number
  currentPrice: number
  averagePrice: number
  minPrice: number
  maxPrice: number
  priceClassification: 'bajo' | 'medio' | 'alto'
  nextOptimalHours: number[]
  nextAvoidHours: number[]
  savingsOpportunity: number
}

// Utility types for better type safety
export type CreateNotificationPayload = Omit<Notification, 'id' | 'timestamp' | 'isRead'>
export type NotificationUpdate = Partial<Pick<Notification, 'isRead' | 'expiresAt'>>