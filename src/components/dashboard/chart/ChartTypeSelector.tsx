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
    <div className="w-full mb-4">
      {/* Mobile-first: Selector horizontal compacto */}
      <div className="flex sm:hidden">
        <div className="flex w-full bg-slate-800/50 backdrop-blur-sm rounded-lg p-1 gap-1 shadow-lg border border-slate-700/30">
          {chartTypes.map(({ type, label, emoji }) => (
            <button
              key={type}
              onClick={() => onTypeChange(type)}
              className={`
                flex-1 flex flex-col items-center justify-center py-3 px-2 rounded-md transition-all duration-200 touch-manipulation min-h-[60px]
                ${activeType === type
                  ? 'bg-slate-700 text-white shadow-md transform scale-105' 
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/50 active:scale-95'
                }
              `}
            >
              <span className="text-lg mb-1">{emoji}</span>
              <span className="text-xs font-medium truncate max-w-full">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Desktop: Selector horizontal mejorado */}
      <div className="hidden sm:flex">
        <div className="flex bg-slate-800/40 backdrop-blur-md rounded-xl p-1 border border-slate-600/30 shadow-lg gap-1">
          {chartTypes.map(({ type, label, emoji }) => (
            <button
              key={type}
              onClick={() => onTypeChange(type)}
              className={`
                flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 min-w-[120px]
                ${activeType === type
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/40'
                }
              `}
            >
              <span className="text-base">{emoji}</span>
              <span className="hidden md:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}