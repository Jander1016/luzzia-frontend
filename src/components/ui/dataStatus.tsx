'use client'

import { RefreshCw, Clock, Wifi, WifiOff } from 'lucide-react'
import { useCurrentHour, useDataFreshness } from '@/hooks/useHourlyUpdate'

interface DataStatusProps {
  lastUpdated: Date | null
  isLoading: boolean
  error: string | null
  onRefresh: () => void
}

export function DataStatus({ lastUpdated, isLoading, error, onRefresh }: DataStatusProps) {
  const currentHour = useCurrentHour()
  const needsUpdate = useDataFreshness(lastUpdated)

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const getStatusColor = () => {
    if (error) return 'text-red-600'
    if (needsUpdate) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getStatusIcon = () => {
    if (error) return <WifiOff className="w-4 h-4" />
    if (needsUpdate) return <Clock className="w-4 h-4" />
    return <Wifi className="w-4 h-4" />
  }

  const getStatusText = () => {
    if (error) return 'Error de conexión'
    if (needsUpdate) return 'Datos desactualizados'
    return 'Datos actualizados'
  }

  return (
    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 mb-6">
      <div className="flex items-center space-x-2">
        <div className={`flex items-center space-x-1 ${getStatusColor()}`}>
          {getStatusIcon()}
          <span className="text-sm font-medium">{getStatusText()}</span>
        </div>
        
        <div className="text-sm text-gray-500">
          • Hora actual: {currentHour}:00
          {lastUpdated && (
            <span> • Última actualización: {formatTime(lastUpdated)}</span>
          )}
        </div>
      </div>

      <button
        onClick={onRefresh}
        disabled={isLoading}
        className={`
          flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium
          ${isLoading 
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
            : 'bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors'
          }
        `}
        title="Actualizar datos manualmente"
      >
        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        <span>{isLoading ? 'Actualizando...' : 'Actualizar'}</span>
      </button>
    </div>
  )
}