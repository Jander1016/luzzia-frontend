'use client'

import { Bell } from 'lucide-react'
import { useNotifications } from '@/hooks/useNotifications'
import { cn } from '@/lib/utils'

interface NotificationBellProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showBadge?: boolean
  onClick?: () => void
}

export function NotificationBell({ 
  className,
  size = 'lg',
  showBadge = true,
  onClick
}: NotificationBellProps) {
  const { unreadCount, isOpen, setIsOpen } = useNotifications()

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const badgeSizeClasses = {
    sm: 'w-2 h-2 text-[8px]',
    md: 'w-3 h-3 text-[10px]',
    lg: 'w-4 h-4 text-xs'
  }

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      setIsOpen(!isOpen)
    }
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'relative inline-flex items-center justify-center',
        'transition-all duration-200 hover:scale-110',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800',
        'rounded-full p-1',
        className
      )}
      aria-label={`Notificaciones${unreadCount > 0 ? ` (${unreadCount} sin leer)` : ''}`}
    >
      {/* Icono de campana */}
      <Bell 
        className={cn(
          sizeClasses[size],
          'text-slate-300 hover:text-white transition-colors',
          isOpen && 'text-blue-400'
        )} 
      />
      
      {/* Indicador de notificaciones no leídas */}
      {showBadge && unreadCount > 0 && (
        <div className="absolute -top-1 -right-1 flex items-center justify-center">
          {/* Punto rojo simple para pocos items */}
          {unreadCount <= 9 ? (
            <div
              className={cn(
                'bg-red-500 rounded-full flex items-center justify-center',
                'border-2 border-slate-800',
                'shadow-lg',
                badgeSizeClasses[size],
                unreadCount === 1 && 'w-2 h-2', // Solo punto para 1 notificación
                'animate-pulse'
              )}
            >
              {unreadCount > 1 && (
                <span className="text-white font-bold leading-none">
                  {unreadCount}
                </span>
              )}
            </div>
          ) : (
            /* Badge con "9+" para muchos items */
            <div
              className={cn(
                'bg-red-500 rounded-full flex items-center justify-center',
                'border-2 border-slate-800',
                'shadow-lg min-w-[16px] h-4 px-1',
                'animate-pulse'
              )}
            >
              <span className="text-white font-bold text-[10px] leading-none">
                9+
              </span>
            </div>
          )}
          
          {/* Efecto de ondas para notificaciones nuevas */}
          <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-20" />
        </div>
      )}
      
      {/* Indicador de carga */}
      {/* {isLoading && (
        <div className="absolute inset-0 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      )} */}
    </button>
  )
}