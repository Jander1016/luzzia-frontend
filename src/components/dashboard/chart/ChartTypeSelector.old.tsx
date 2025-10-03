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
      {/* Móvil: Selector deslizable horizontal */}
      <div className="md:hidden">
        <div className="flex space-x-3 overflow-x-auto scrollbar-hide pb-2">
          {chartTypes.map(({ type, label, icon: Icon, emoji }) => (
            <button
              key={type}
              onClick={() => onTypeChange(type)}
              className={`
                flex-shrink-0 flex flex-col items-center justify-center space-y-2 px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-300 min-w-[80px] relative
                ${activeType === type
                  ? 'bg-gradient-to-b from-purple-500 to-purple-600 text-white shadow-lg scale-105'
                  : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700/80 hover:text-white hover:scale-102'
                }
              `}
            >
              {/* Indicador de selección */}
              {activeType === type && (
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
              )}
              
              {/* Emoji e icono */}
              <div className="flex flex-col items-center space-y-1">
                <span className="text-lg">{emoji}</span>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
        
        {/* Indicadores de scroll */}
        <div className="flex justify-center mt-2 space-x-1">
          {chartTypes.map((_, index) => (
            <div 
              key={index} 
              className={`w-2 h-2 rounded-full transition-colors ${
                index === chartTypes.findIndex(ct => ct.type === activeType) ? 'bg-purple-500' : 'bg-slate-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Desktop: Segmented control moderno */}
      <div className="hidden md:flex bg-slate-800/40 backdrop-blur-md rounded-2xl p-1 border border-slate-600/30 shadow-xl">
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