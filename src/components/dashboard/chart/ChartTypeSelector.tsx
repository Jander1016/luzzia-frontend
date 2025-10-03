import { ChartType } from './types'
import { BarChart3, TrendingUp, PieChart } from 'lucide-react'

interface ChartTypeSelectorProps {
  activeType: ChartType
  onTypeChange: (type: ChartType) => void
}

type IconComponent = React.ComponentType<{ className?: string }>

const chartTypes: { type: ChartType; label: string; icon: IconComponent; shortLabel: string; emoji: string }[] = [
  { type: 'bar' as ChartType, label: 'Barras', icon: BarChart3, shortLabel: 'Bar', emoji: '📊' },
  { type: 'line' as ChartType, label: 'Línea', icon: TrendingUp, shortLabel: 'Lin', emoji: '📈' },
  { type: 'pie' as ChartType, label: 'Circular', icon: PieChart, shortLabel: 'Pie', emoji: '🥧' }
]

export function ChartTypeSelector({ activeType, onTypeChange }: ChartTypeSelectorProps) {
  return (
    <div className="w-full">
      {/* Mobile-first: Botones full width apilados */}
      <div className="flex flex-col space-y-2 sm:hidden">
        {chartTypes.map(({ type, label, icon: Icon, emoji }) => (
          <button
            key={type}
            onClick={() => onTypeChange(type)}
            className={`
              w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 relative
              ${activeType === type
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700/80 hover:text-white border border-slate-600/30'
              }
            `}
          >
            {/* Indicador de selección móvil */}
            {activeType === type && (
              <div className="absolute left-2 w-1 h-6 bg-white rounded-full"></div>
            )}
            
            <span className="text-xl">{emoji}</span>
            <Icon className="w-5 h-5" />
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </div>

      {/* Tablet: Selector horizontal compacto */}
      <div className="hidden sm:flex lg:hidden">
        <div className="flex w-full bg-slate-800/40 backdrop-blur-md rounded-xl p-1 border border-slate-600/30 shadow-lg">
          {chartTypes.map(({ type, label, icon: Icon, emoji }) => (
            <button
              key={type}
              onClick={() => onTypeChange(type)}
              className={`
                flex-1 flex flex-col items-center justify-center space-y-1 px-3 py-3 rounded-lg text-xs font-semibold transition-all duration-300 relative
                ${activeType === type
                  ? 'bg-gradient-to-b from-purple-500 to-purple-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/40'
                }
              `}
            >
              <span className="text-lg">{emoji}</span>
              <Icon className="w-4 h-4" />
              <span className="text-xs">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Desktop: Segmented control completo */}
      <div className="hidden lg:flex bg-slate-800/40 backdrop-blur-md rounded-2xl p-1 border border-slate-600/30 shadow-xl">
        {chartTypes.map(({ type, label, icon: Icon, emoji }) => (
          <button
            key={type}
            onClick={() => onTypeChange(type)}
            className={`
              relative flex items-center justify-center space-x-3 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex-1
              ${activeType === type
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/40'
              }
            `}
          >
            {/* Efecto de glow para activo */}
            {activeType === type && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-purple-600/20 rounded-xl blur-sm"></div>
            )}
            
            <span className="text-lg relative z-10">{emoji}</span>
            <Icon className="w-5 h-5 relative z-10" />
            <span className="relative z-10">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}