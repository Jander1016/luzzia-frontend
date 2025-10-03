'use client'

import { useEffect, useRef, useState } from 'react'
import {
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Lightbulb, 
  TrendingUp,
  X,
  Settings
} from 'lucide-react'
import { useNotifications } from '@/hooks/useNotifications'
import { Notification, NotificationIcon } from '@/types/notifications'
import { NotificationSettings } from './NotificationSettings'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

interface NotificationPanelProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

type IconComponent = React.ComponentType<{ className?: string }>

const iconMap: Record<NotificationIcon, IconComponent> = {
  'check-circle': CheckCircle,
  'alert-triangle': AlertTriangle,
  'clock': Clock,
  'lightbulb': Lightbulb,
  'trending-up': TrendingUp
}

const typeColorMap = {
  optimal_time: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    icon: 'text-green-400',
    accent: 'bg-green-500'
  },
  avoid_usage: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20', 
    icon: 'text-orange-400',
    accent: 'bg-orange-500'
  },
  schedule_device: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    icon: 'text-blue-400',
    accent: 'bg-blue-500'
  },
  tip_of_day: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    icon: 'text-purple-400',
    accent: 'bg-purple-500'
  },
  price_alert: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    icon: 'text-yellow-400',
    accent: 'bg-yellow-500'
  }
}

export function NotificationPanel({ isOpen, onClose, className }: NotificationPanelProps) {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    isLoading,
    generateRecommendations
  } = useNotifications()
  
  const panelRef = useRef<HTMLDivElement>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [hasInitialized, setHasInitialized] = useState(false)

  // Generar notificaciones automaticamente al abrir el panel por primera vez
  useEffect(() => {
    if (isOpen && !hasInitialized && notifications.length === 0) {
      generateRecommendations()
      setHasInitialized(true)
    }
  }, [isOpen, hasInitialized, notifications.length, generateRecommendations])

  // Cerrar al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  // Cerrar con Escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id)
    }
  }

  const formatTimeAgo = (date: Date) => {
    try {
      return formatDistanceToNow(date, { addSuffix: true, locale: es })
    } catch {
      return 'hace un momento'
    }
  }

  const getSavingsDisplay = (notification: Notification) => {
    if (notification.actionData?.savings) {
      return `-${notification.actionData.savings}%`
    }
    return null
  }

  const getTimeRangeDisplay = (notification: Notification) => {
    if (notification.actionData?.timeRange) {
      const { start, end } = notification.actionData.timeRange
      return `${start} - ${end}`
    }
    return null
  }

  return (
    <>
      {/* Overlay para móvil */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden" />
      
      {/* Panel de notificaciones */}
      <div
        ref={panelRef}
        className={cn(
          'fixed right-4 top-16 w-full max-w-sm bg-slate-800/95 backdrop-blur-md',
          'border border-slate-700/50 rounded-xl shadow-2xl z-50',
          'max-h-[calc(100vh-5rem)] flex flex-col',
          'md:w-96',
          'animate-in slide-in-from-top-2 duration-200',
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Recomendaciones</h3>
              <p className="text-xs text-slate-400">Inteligencia energética</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Contador de no leídas */}
            {unreadCount > 0 && (
              <span className="text-xs text-slate-400">
                {unreadCount} nuevas
              </span>
            )}
            
            {/* Botón cerrar */}
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white transition-colors rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Acciones rápidas */}
        {notifications.length > 0 && (
          <div className="flex items-center justify-between p-3 bg-slate-900/30 border-b border-slate-700/30">
            <button
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className={cn(
                'text-xs px-3 py-1 rounded-md transition-colors',
                unreadCount > 0
                  ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-500/10'
                  : 'text-slate-500 cursor-not-allowed'
              )}
            >
              Marcar todas como leídas
            </button>
            
            <button
              onClick={clearAllNotifications}
              className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-1 rounded-md transition-colors"
            >
              Limpiar todo
            </button>
          </div>
        )}

        {/* Lista de notificaciones */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
              <span className="ml-2 text-sm text-slate-400">Generando recomendaciones...</span>
            </div>
          )}

          {notifications.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <Lightbulb className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No hay recomendaciones</p>
              <p className="text-slate-500 text-xs mt-1">
                Las recomendaciones se generan automáticamente cada hora
              </p>
            </div>
          )}

          {notifications.map((notification) => {
            const IconComponent = iconMap[notification.icon]
            const colors = typeColorMap[notification.type]
            const timeAgo = formatTimeAgo(notification.timestamp)
            const savings = getSavingsDisplay(notification)
            const timeRange = getTimeRangeDisplay(notification)

            return (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={cn(
                  'relative p-3 rounded-lg border cursor-pointer transition-all duration-200',
                  'hover:bg-slate-700/30',
                  colors.bg,
                  colors.border,
                  !notification.isRead && 'ring-1 ring-blue-500/20'
                )}
              >
                {/* Indicador de no leída */}
                {!notification.isRead && (
                  <div className={cn('absolute top-2 right-2 w-2 h-2 rounded-full', colors.accent)} />
                )}

                <div className="flex items-start space-x-3">
                  {/* Icono */}
                  <div className={cn('p-2 rounded-lg flex-shrink-0', colors.bg)}>
                    <IconComponent className={cn('w-4 h-4', colors.icon)} />
                  </div>

                  {/* Contenido */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-white text-sm truncate">
                        {notification.title}
                      </h4>
                      {savings && (
                        <span className="text-xs font-semibold text-green-400 ml-2">
                          {savings}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-slate-300 mb-2 leading-relaxed">
                      {notification.message}
                    </p>

                    {/* Información adicional */}
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{timeAgo}</span>
                      {timeRange && (
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{timeRange}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Botón eliminar */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeNotification(notification.id)
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-400 transition-all rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer con configuración */}
        <div className="p-3 border-t border-slate-700/50 bg-slate-900/30">
          <button 
            onClick={() => setShowSettings(true)}
            className="w-full flex items-center justify-center space-x-2 text-xs text-slate-400 hover:text-slate-300 transition-colors py-2"
          >
            <Settings className="w-3 h-3" />
            <span>Configurar notificaciones</span>
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      <NotificationSettings 
        isOpen={showSettings}
        onClose={() => {
          setShowSettings(false)
          onClose() // Cerrar todo el panel
        }}
        onBack={() => setShowSettings(false)} // Solo cerrar configuración, volver al panel
      />
    </>
  )
}