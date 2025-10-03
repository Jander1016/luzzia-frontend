import { PeriodType } from './types'
import { Calendar, Clock, TrendingUp } from 'lucide-react'

interface PeriodFilterProps {
  activePeriod: PeriodType
  onPeriodChange: (period: PeriodType) => void
}

type IconComponent = React.ComponentType<{ className?: string }>

export function PeriodFilter({ activePeriod, onPeriodChange }: PeriodFilterProps) {
  const periods: { key: PeriodType; label: string; icon: IconComponent; shortLabel: string }[] = [
    { key: 'hoy', label: 'Hoy', icon: Clock, shortLabel: 'Hoy' },
    { key: 'semana', label: 'Semana', icon: Calendar, shortLabel: 'Sem' },
    { key: 'mes', label: 'Mes', icon: TrendingUp, shortLabel: 'Mes' }
  ]

  return (
    <div className="w-full">
      {/* Móvil: Botones apilados verticalmente */}
      <div className="md:hidden space-y-2">
        {periods.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onPeriodChange(key)}
            className={`
              w-full flex items-center justify-center space-x-3 px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200
              ${activePeriod === key
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/60 hover:text-white'
              }
            `}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
            {activePeriod === key && (
              <div className="w-2 h-2 bg-white rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Desktop: Botones horizontales compactos */}
      <div className="hidden md:flex space-x-2 bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-md rounded-xl p-1.5 border border-slate-600/30">
        {periods.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onPeriodChange(key)}
            className={`
              flex items-center space-x-2 px-3 py-2 text-sm font-semibold rounded-lg transition-all duration-300 whitespace-nowrap
              ${activePeriod === key
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                : 'text-slate-300 hover:text-white hover:bg-slate-600/50'
              }
            `}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}