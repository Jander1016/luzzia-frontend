import { PriceData, PeriodType } from './types'
import { classifyPrice, formatHour, formatPrice } from './types'
import { useState } from 'react'

interface LineChartProps {
  prices: PriceData[]
  period: PeriodType
}

export function LineChart({ prices, period }: LineChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)
  
  if (!prices.length) {
    return (
      <div className="h-72 flex items-center justify-center text-slate-400">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-800 rounded-full flex items-center justify-center">
            📈
          </div>
          <p className="text-lg font-medium">No hay datos disponibles</p>
          <p className="text-sm text-slate-500 mt-1">Intenta actualizar los datos</p>
        </div>
      </div>
    )
  }

  const maxPrice = Math.max(...prices.map(p => p.price))
  const minPrice = Math.min(...prices.map(p => p.price))
  const currentHour = new Date().getHours()
  
  // Configuración responsive
  const chartHeight = 192 // h-48
  const chartWidth = 300 // Mínimo para móvil
  const padding = { top: 20, right: 20, bottom: 40, left: 20 }
  
  const getLabel = (data: PriceData) => {
    switch (period) {
      case 'hoy': return `${formatHour(data.hour)}h`
      case 'semana': return `S${data.hour}`
      case 'mes': return `${data.hour}`
      default: return data.hour.toString()
    }
  }

  // Datos resumidos para tabla móvil
  const tableData = [
    { label: 'Actual', price: prices.find(p => p.hour === currentHour)?.price || prices[0]?.price || 0 },
    { label: 'Mínimo', price: minPrice },
    { label: 'Máximo', price: maxPrice },
    { label: 'Promedio', price: prices.reduce((sum, p) => sum + p.price, 0) / prices.length }
  ]

  // Generar puntos SVG
  const points = prices.map((data, index) => {
    const x = (index / (prices.length - 1)) * (chartWidth - padding.left - padding.right) + padding.left
    const y = chartHeight - padding.bottom - ((data.price - minPrice) / (maxPrice - minPrice)) * (chartHeight - padding.top - padding.bottom)
    return { x, y, data, index }
  })

  // Generar path de línea
  const linePath = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ')

  // Generar path de área
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight - padding.bottom} L ${points[0].x} ${chartHeight - padding.bottom} Z`

  return (
    <div className="w-full">
      {/* Tabla de datos para móvil */}
      <div className="block md:hidden mb-6">
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3">Resumen de precios</h3>
          <div className="grid grid-cols-2 gap-3">
            {tableData.map((item, index) => (
              <div key={index} className="bg-slate-700/30 rounded-lg p-3">
                <div className="text-xs text-slate-400">{item.label}</div>
                <div className="text-sm font-medium text-white">{formatPrice(item.price)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gráfico de línea responsivo */}
      <div className="relative bg-slate-900/30 rounded-lg p-4 overflow-x-auto scrollbar-hide">
        <svg 
          width="100%" 
          height={chartHeight}
          viewBox={`0 0 ${Math.max(chartWidth, prices.length * 30)} ${chartHeight}`}
          className="min-w-[300px]"
        >
          {/* Grilla horizontal */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
            const y = chartHeight - padding.bottom - ratio * (chartHeight - padding.top - padding.bottom)
            return (
              <g key={index}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={chartWidth - padding.right}
                  y2={y}
                  stroke="rgb(51, 65, 85)"
                  strokeWidth="1"
                  opacity="0.3"
                />
                <text
                  x={padding.left - 5}
                  y={y + 4}
                  fill="rgb(148, 163, 184)"
                  fontSize="10"
                  textAnchor="end"
                  className="font-mono"
                >
                  {(minPrice + ratio * (maxPrice - minPrice)).toFixed(2)}
                </text>
              </g>
            )
          })}

          {/* Área bajo la curva */}
          <path
            d={areaPath}
            fill="url(#gradient)"
            opacity="0.2"
          />

          {/* Línea principal */}
          <path
            d={linePath}
            fill="none"
            stroke="rgb(34, 197, 94)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Puntos de datos */}
          {points.map((point, index) => {
            const level = classifyPrice(point.data.price, prices)
            const isCurrentHour = period === 'hoy' && point.data.hour === currentHour
            const isHovered = hoveredPoint === index
            
            const colors = {
              bajo: 'rgb(34, 197, 94)',
              medio: 'rgb(251, 191, 36)',
              alto: 'rgb(239, 68, 68)',
              'muy-alto': 'rgb(220, 38, 38)'
            }
            
            return (
              <g key={index}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={isHovered ? 8 : isCurrentHour ? 6 : 4}
                  fill={colors[level as keyof typeof colors] || colors.medio}
                  stroke="white"
                  strokeWidth={isCurrentHour ? 3 : 2}
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredPoint(index)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
                
                {/* Tooltip */}
                {isHovered && (
                  <g>
                    <rect
                      x={point.x - 40}
                      y={point.y - 35}
                      width="80"
                      height="25"
                      fill="rgb(30, 41, 59)"
                      stroke="rgb(71, 85, 105)"
                      strokeWidth="1"
                      rx="4"
                      opacity="0.95"
                    />
                    <text
                      x={point.x}
                      y={point.y - 20}
                      fill="white"
                      fontSize="10"
                      textAnchor="middle"
                      className="font-medium"
                    >
                      {getLabel(point.data)}
                    </text>
                    <text
                      x={point.x}
                      y={point.y - 10}
                      fill="white"
                      fontSize="10"
                      textAnchor="middle"
                    >
                      {formatPrice(point.data.price)}
                    </text>
                  </g>
                )}
              </g>
            )
          })}

          {/* Etiquetas del eje X (solo algunas en móvil) */}
          {points.map((point, index) => {
            const showLabel = window.innerWidth > 768 || index % Math.ceil(prices.length / 6) === 0
            if (!showLabel) return null
            
            return (
              <text
                key={index}
                x={point.x}
                y={chartHeight - 10}
                fill="rgb(148, 163, 184)"
                fontSize="10"
                textAnchor="middle"
              >
                {getLabel(point.data)}
              </text>
            )
          })}

          {/* Gradiente para el área */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(34, 197, 94)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(34, 197, 94)" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Indicador de scroll para móvil */}
        <div className="flex justify-center mt-2 md:hidden">
          <div className="text-xs text-slate-500">← Desliza para ver más →</div>
        </div>
      </div>
    </div>
  )
}