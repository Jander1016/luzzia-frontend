import { LegendItem, PriceData } from './types'
import { formatPrice } from './types'

interface ChartLegendProps {
  legend: LegendItem[]
  prices: PriceData[]
  activePeriod: string
}

export function ChartLegend({ legend, prices, activePeriod }: ChartLegendProps) {
  const getPeriodTitle = () => {
    switch (activePeriod) {
      case 'hoy': return 'Precios por Hora'
      case 'semana': return 'Promedios Semanales'
      case 'mes': return 'Promedios Mensuales'
      default: return 'Precios'
    }
  }

  return (
    <div className="mt-8">
      {/* Información del período actual */}
      <div className="mb-4 p-3 bg-slate-700/30 rounded-lg">
        <div className="text-white text-sm font-medium mb-1">
          {getPeriodTitle()}
        </div>
        <div className="text-slate-400 text-xs">
          {prices.length > 0 && (
            <>
              Rango: {formatPrice(Math.min(...prices.map(p => p.price)))} - {formatPrice(Math.max(...prices.map(p => p.price)))} | 
              Promedio: {formatPrice(prices.reduce((sum, p) => sum + p.price, 0) / prices.length)}
            </>
          )}
        </div>
      </div>
      
      {/* Leyenda de colores */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {legend.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className={`w-4 h-4 rounded-full ${item.color}`} />
            <div>
              <div className={`${item.textColor} font-medium text-sm`}>{item.label}</div>
              <div className={`${item.textColor} text-xs`}>
                {item.range}
              </div>
              <div className="text-slate-500 text-xs">
                {item.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}