'use client'

import { useState } from 'react'
import { useNotifications } from '@/hooks/useNotifications'
import { NotificationConfig, NotificationType } from '@/types/notifications'
import { 
  Settings, 
  Clock, 
  Bell, 
  BellOff, 
  Trash2,
  Save,
  RotateCcw 
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NotificationSettingsProps {
  isOpen: boolean
  onClose: () => void
  onBack?: () => void // Nueva prop para regresar al panel
}

const notificationTypeLabels: Record<NotificationType, string> = {
  optimal_time: 'Momentos ideales',
  avoid_usage: 'Evitar uso alto',
  schedule_device: 'Programar dispositivos',
  tip_of_day: 'Consejos del día',
  price_alert: 'Alertas de precio'
}

export function NotificationSettings({ isOpen, onClose, onBack }: NotificationSettingsProps) {
  const { config, updateConfig, clearAllNotifications } = useNotifications()
  const [localConfig, setLocalConfig] = useState<NotificationConfig>(config)
  const [hasChanges, setHasChanges] = useState(false)

  const handleConfigChange = <K extends keyof NotificationConfig>(
    key: K, 
    value: NotificationConfig[K]
  ) => {
    setLocalConfig(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleTypeToggle = (type: NotificationType) => {
    const newTypes = localConfig.enabledTypes.includes(type)
      ? localConfig.enabledTypes.filter(t => t !== type)
      : [...localConfig.enabledTypes, type]
    
    handleConfigChange('enabledTypes', newTypes)
  }

  const handleSave = () => {
    updateConfig(localConfig)
    setHasChanges(false)
    onClose()
  }

  const handleReset = () => {
    const defaultConfig: NotificationConfig = {
      intervalMinutes: 60*24,
      maxNotifications: 4,
      enabledTypes: ['optimal_time', 'avoid_usage', 'schedule_device', 'tip_of_day'],
      autoExpireHours: 24,
      quietHours: {
        start: '23:00',
        end: '07:00'
      }
    }
    setLocalConfig(defaultConfig)
    setHasChanges(true)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800/95 backdrop-blur-md border border-slate-700/50 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
          <div className="flex items-center space-x-3">
            {/* Botón back si viene del panel */}
            {onBack && (
              <button
                onClick={onBack}
                className="p-1 text-slate-400 hover:text-white transition-colors rounded"
                title="Volver a notificaciones"
              >
                ←
              </button>
            )}
            
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Settings className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Configuración</h3>
              <p className="text-xs text-slate-400">Personaliza las notificaciones</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white transition-colors rounded"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Intervalo de generación */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              <Clock className="w-4 h-4 inline mr-2" />
              Frecuencia de notificaciones
            </label>
            <select
              value={localConfig.intervalMinutes}
              onChange={(e) => handleConfigChange('intervalMinutes', parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={30}>Cada 30 minutos</option>
              <option value={60}>Cada hora</option>
              <option value={120}>Cada 2 horas</option>
              <option value={180}>Cada 3 horas</option>
              <option value={360}>Cada 6 horas</option>
            </select>
          </div>

          {/* Tipos de notificaciones */}
          <div>
            <label className="block text-sm font-medium text-white mb-3">
              <Bell className="w-4 h-4 inline mr-2" />
              Tipos de notificaciones
            </label>
            <div className="space-y-2">
              {Object.entries(notificationTypeLabels).map(([type, label]) => (
                <label key={type} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localConfig.enabledTypes.includes(type as NotificationType)}
                    onChange={() => handleTypeToggle(type as NotificationType)}
                    className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm text-slate-300">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Horario silencioso */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              <BellOff className="w-4 h-4 inline mr-2" />
              Horario silencioso
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Desde</label>
                <input
                  type="time"
                  value={localConfig.quietHours?.start || '23:00'}
                  onChange={(e) => handleConfigChange('quietHours', {
                    start: e.target.value,
                    end: localConfig.quietHours?.end || '22:00'
                  })}
                  className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Hasta</label>
                <input
                  type="time"
                  value={localConfig.quietHours?.end || '07:00'}
                  onChange={(e) => handleConfigChange('quietHours', {
                    start: localConfig.quietHours?.start || '22:00',
                    end: e.target.value
                  })}
                  className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Límite de notificaciones */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Máximo de notificaciones: {localConfig.maxNotifications}
            </label>
            <input
              type="range"
              min="5"
              max="20"
              value={localConfig.maxNotifications}
              onChange={(e) => handleConfigChange('maxNotifications', parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>5</span>
              <span>20</span>
            </div>
          </div>

          {/* Expiración automática */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Auto-eliminar después de: {localConfig.autoExpireHours || 24} horas
            </label>
            <input
              type="range"
              min="6"
              max="72"
              step="6"
              value={localConfig.autoExpireHours || 24}
              onChange={(e) => handleConfigChange('autoExpireHours', parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>6h</span>
              <span>72h</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-slate-700/50 space-y-3">
          <div className="flex space-x-3">
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={cn(
                'flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                hasChanges
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              )}
            >
              <Save className="w-4 h-4" />
              <span>Guardar</span>
            </button>
            
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm font-medium transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={clearAllNotifications}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-sm font-medium transition-colors border border-red-500/30"
          >
            <Trash2 className="w-4 h-4" />
            <span>Eliminar todas las notificaciones</span>
          </button>
        </div>
      </div>
    </div>
  )
}