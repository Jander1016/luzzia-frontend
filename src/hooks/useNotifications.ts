'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { 
  Notification, 
  NotificationState, 
  NotificationConfig, 
  CreateNotificationPayload
} from '@/types/notifications'
import { notificationService } from '@/services/notificationService'
import { usePriceAnalysis } from './useElectricityData.simple'

const DEFAULT_CONFIG: NotificationConfig = {
  intervalMinutes: 60, // 1 hora por defecto
  maxNotifications: 10,
  enabledTypes: ['optimal_time', 'avoid_usage', 'schedule_device', 'tip_of_day'],
  autoExpireHours: 24,
  quietHours: {
    start: '23:00',
    end: '07:00'
  }
}

const STORAGE_KEYS = {
  NOTIFICATIONS: 'luzzia_notifications',
  CONFIG: 'luzzia_notification_config',
  LAST_GENERATED: 'luzzia_last_generated'
} as const

export function useNotifications() {
  // State
  const [state, setState] = useState<NotificationState>({
    notifications: [],
    unreadCount: 0,
    config: DEFAULT_CONFIG,
    isLoading: false,
    lastGenerated: null
  })

  const [isOpen, setIsOpen] = useState(false)
  
  // Refs para timers
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const { data: priceData, isLoading: isPriceLoading } = usePriceAnalysis()

  /**
   * Carga datos del localStorage
   */
  const loadFromStorage = useCallback(() => {
    try {
      const notifications = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]'
      ).map((n: Notification & { timestamp: string; expiresAt?: string }) => ({
        ...n,
        timestamp: new Date(n.timestamp),
        expiresAt: n.expiresAt ? new Date(n.expiresAt) : undefined
      }))

      const config = {
        ...DEFAULT_CONFIG,
        ...JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG) || '{}')
      }

      const lastGenerated = localStorage.getItem(STORAGE_KEYS.LAST_GENERATED)
        ? new Date(localStorage.getItem(STORAGE_KEYS.LAST_GENERATED)!)
        : null

      setState(prev => ({
        ...prev,
        notifications,
        config,
        lastGenerated,
        unreadCount: notifications.filter((n: Notification) => !n.isRead).length
      }))
    } catch (error) {
      console.error('Error loading notifications from storage:', error)
    }
  }, [])

  /**
   * Guarda datos en localStorage
   */
  const saveToStorage = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(state.notifications))
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(state.config))
      if (state.lastGenerated) {
        localStorage.setItem(STORAGE_KEYS.LAST_GENERATED, state.lastGenerated.toISOString())
      }
    } catch (error) {
      console.error('Error saving notifications to storage:', error)
    }
  }, [state.notifications, state.config, state.lastGenerated])

  /**
   * Limpia notificaciones expiradas
   */
  const cleanupExpiredNotifications = useCallback(() => {
    const now = new Date()
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.filter(notification => 
        !notification.expiresAt || notification.expiresAt > now
      )
    }))
  }, [])

  /**
   * Verifica si estamos en horario silencioso
   */
  const isInQuietHours = useCallback((): boolean => {
    if (!state.config.quietHours) return false

    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentTime = currentHour * 60 + currentMinute

    const startParts = state.config.quietHours.start.split(':')
    const endParts = state.config.quietHours.end.split(':')
    
    const startTime = parseInt(startParts[0]) * 60 + parseInt(startParts[1])
    const endTime = parseInt(endParts[0]) * 60 + parseInt(endParts[1])

    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime <= endTime
    } else {
      return currentTime >= startTime || currentTime <= endTime
    }
  }, [state.config.quietHours])

  /**
   * Genera recomendaciones de precios
   */
  const generateRecommendations = useCallback(async () => {
    if (!priceData?.prices || priceData.prices.length === 0) {
      console.warn('No hay datos de precios disponibles para generar recomendaciones')
      return
    }

    if (isInQuietHours()) {
      console.log('En horario silencioso, omitiendo generación de notificaciones')
      return
    }

    setState(prev => ({ ...prev, isLoading: true }))

    try {
      const recommendations = await notificationService.generateRecommendations(priceData.prices)
      
      const newNotifications: Notification[] = recommendations
        .slice(0, state.config.maxNotifications)
        .map((rec: CreateNotificationPayload) => {
          // Mapear tipo de notificación a icono
          const getIconForType = (type: string) => {
            switch (type) {
              case 'optimal_time': return 'check-circle'
              case 'avoid_usage': return 'alert-triangle'
              case 'schedule_device': return 'clock'
              case 'tip_of_day': return 'lightbulb'
              case 'price_alert': return 'trending-up'
              default: return 'lightbulb'
            }
          }
          
          return {
            id: generateNotificationId(),
            title: rec.title,
            message: rec.message,
            type: rec.type,
            icon: getIconForType(rec.type),
            priority: rec.priority,
            timestamp: new Date(),
            isRead: false,
            expiresAt: new Date(Date.now() + (state.config.autoExpireHours || 24) * 60 * 60 * 1000),
            actionData: rec.actionData
          }
        })

      if (newNotifications.length > 0) {
        setState(prev => ({
          ...prev,
          notifications: [...newNotifications, ...prev.notifications]
            .slice(0, state.config.maxNotifications),
          unreadCount: prev.unreadCount + newNotifications.length,
          lastGenerated: new Date(),
          isLoading: false
        }))
      } else {
        setState(prev => ({ ...prev, isLoading: false }))
      }
    } catch (error) {
      console.error('Error generando recomendaciones:', error)
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [priceData, isInQuietHours, state.config.maxNotifications, state.config.autoExpireHours])

  /**
   * Configura la generación automática de notificaciones
   */
  const setupAutoGeneration = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    const intervalMs = state.config.intervalMinutes * 60 * 1000
    
    intervalRef.current = setInterval(() => {
      if (!isInQuietHours() && priceData?.prices) {
        generateRecommendations()
      }
    }, intervalMs)
  }, [state.config.intervalMinutes, isInQuietHours, generateRecommendations, priceData])

  /**
   * Marca una notificación como leída
   */
  const markAsRead = useCallback((id: string) => {
    setState(prev => {
      const notifications = prev.notifications.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      )
      return {
        ...prev,
        notifications,
        unreadCount: notifications.filter(n => !n.isRead).length
      }
    })
  }, [])

  /**
   * Marca todas las notificaciones como leídas
   */
  const markAllAsRead = useCallback(() => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => ({ ...n, isRead: true })),
      unreadCount: 0
    }))
  }, [])

  /**
   * Remueve una notificación específica
   */
  const removeNotification = useCallback((id: string) => {
    setState(prev => {
      const notifications = prev.notifications.filter(n => n.id !== id)
      return {
        ...prev,
        notifications,
        unreadCount: notifications.filter(n => !n.isRead).length
      }
    })
  }, [])

  /**
   * Limpia todas las notificaciones
   */
  const clearAllNotifications = useCallback(() => {
    setState(prev => ({
      ...prev,
      notifications: [],
      unreadCount: 0
    }))
  }, [])

  /**
   * Actualiza la configuración
   */
  const updateConfig = useCallback((newConfig: Partial<NotificationConfig>) => {
    setState(prev => ({
      ...prev,
      config: { ...prev.config, ...newConfig }
    }))
  }, [])

  /**
   * Genera un ID único para notificaciones
   */
  const generateNotificationId = (): string => {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Cargar datos del localStorage al inicializar
  useEffect(() => {
    loadFromStorage()
  }, [loadFromStorage])

  // Generar recomendaciones iniciales si no hay notificaciones
  useEffect(() => {
    const shouldGenerateInitial = 
      !state.isLoading && 
      state.notifications.length === 0 && 
      priceData?.prices && 
      priceData.prices.length > 0 && 
      !isPriceLoading

    if (shouldGenerateInitial) {
      generateRecommendations()
    }
  }, [priceData?.prices, isPriceLoading, state.notifications.length, state.isLoading, generateRecommendations])

  // Configurar intervalo de generación automática
  useEffect(() => {
    if (state.config.intervalMinutes > 0) {
      setupAutoGeneration()
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [state.config.intervalMinutes, setupAutoGeneration])

  // Guardar en localStorage cuando cambie el estado
  useEffect(() => {
    saveToStorage()
  }, [saveToStorage])

  // Limpiar notificaciones expiradas
  useEffect(() => {
    cleanupExpiredNotifications()
  }, [cleanupExpiredNotifications])

  return {
    // State
    notifications: state.notifications,
    unreadCount: state.unreadCount,
    config: state.config,
    isLoading: state.isLoading,
    lastGenerated: state.lastGenerated,
    
    // UI State
    isOpen,
    setIsOpen,
    
    // Actions
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    updateConfig,
    generateRecommendations
  }
}