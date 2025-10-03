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
      {/* Mobile: Selector horizontal compacto */}
      <div className="flex sm:hidden">
        <div className="flex w-full bg-slate-800/50 rounded-lg p-1 space-x-1">
          {chartTypes.map(({ type, label, icon: Icon, emoji }) => (
            <button
              key={type}
              onClick={() => onTypeChange(type)}
              className={`
                flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-md transition-all duration-200
                ${activeType === type
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/50'
                }
              `}
            >
              <span className="text-lg mb-1">{emoji}</span>
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Desktop: Selector horizontal mejorado */}
      <div className="hidden sm:flex">
        <div className="flex bg-slate-800/40 backdrop-blur-md rounded-xl p-1 border border-slate-600/30 shadow-lg">
          {chartTypes.map(({ type, label, icon: Icon, emoji }) => (
            <button
              key={type}
              onClick={() => onTypeChange(type)}
              className={`
                flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300
                ${activeType === type
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/40'
                }
              `}
            >
              <span className="text-base">{emoji}</span>
              <Icon className="w-4 h-4" />
              <span className="hidden md:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}