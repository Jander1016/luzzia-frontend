import { PriceData, PeriodType } from './types'
import { classifyPrice, formatHour, formatPrice } from './types'
import { useState, useRef } from 'react'

interface LineChartProps {
  prices: PriceData[]
  period: PeriodType
}

export function LineChart({ prices, period }: LineChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null)
  const [showArea, setShowArea] = useState(true)
  const svgRef = useRef<SVGSVGElement>(null)
  const currentHour = new Date().getHours()

  // Función para obtener colores según el nivel
  const _getChartColors = () => ({
    green: 'rgb(34, 197, 94)',
    yellow: 'rgb(251, 191, 36)', 
    red: 'rgb(239, 68, 68)'
  })

  // Función para obtener etiquetas (debe estar antes de ser usada)
  const getLabel = (data: PriceData) => {
    switch (period) {
      case 'hoy': return `${formatHour(data.hour)}h`
      case 'semana': return `S${data.hour}`
      case 'mes': return `${data.hour}`
      default: return data.hour.toString()
    }
  }

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
  const currentPrice = prices.find(p => p.hour === currentHour)?.price
  
  // Verificar que tenemos datos válidos y calcular rango de precios
  const priceRange = (maxPrice === minPrice) ? 1 : (maxPrice - minPrice)
  
  // Configurar dimensiones responsive
  const chartWidth = 800
  const chartHeight = 300
  const padding = { top: 20, right: 40, bottom: 40, left: 60 }
  
  // Calcular escalas con protección contra división por cero
  const xScale = (index: number) => {
    if (prices.length <= 1) return padding.left
    return (index / (prices.length - 1)) * (chartWidth - padding.left - padding.right) + padding.left
  }
  
  const yScale = (price: number) => {
    const normalizedPrice = priceRange === 0 ? 0.5 : (price - minPrice) / priceRange
    return chartHeight - padding.bottom - (normalizedPrice * (chartHeight - padding.top - padding.bottom))
  }

  // Generar path de la línea principal
  const linePath = prices.map((price, index) => {
    const x = xScale(index)
    const y = yScale(price.price)
    return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
  }).join(' ')

  // Generar path del área (gradient fill)
  const areaPath = showArea ? 
    `${linePath} L ${xScale(prices.length - 1)} ${chartHeight - padding.bottom} L ${padding.left} ${chartHeight - padding.bottom} Z` 
    : ''

  // Generar líneas de grilla
  const gridLines = {
    horizontal: Array.from({ length: 6 }, (_, i) => {
      const y = padding.top + (i * (chartHeight - padding.top - padding.bottom) / 5)
      const price = maxPrice - (i * (maxPrice - minPrice) / 5)
      return { y, price }
    }),
    vertical: prices.filter((_, i) => {
      const step = Math.max(1, Math.ceil(prices.length / 8))
      return i % step === 0
    }).map((price, _index, _filtered) => {
      const originalIndex = prices.indexOf(price)
      return { x: xScale(originalIndex), label: getLabel(price) }
    })
  }

  const getTooltip = (data: PriceData, index: number) => {
    const isCurrentHour = period === 'hoy' && data.hour === currentHour
    const level = classifyPrice(data.price, prices)
    const trend = index > 0 ? 
      (data.price > prices[index - 1].price ? '📈 Subiendo' : 
       data.price < prices[index - 1].price ? '📉 Bajando' : '➡️ Estable') : '➡️ Inicial'
    
    const statusText = isCurrentHour ? ' (Actual)' : ''
    const levelText = level === 'bajo' ? '🟢 Precio Bajo' : 
                     level === 'medio' ? '🟡 Precio Medio' : '🔴 Precio Alto'
    
    switch (period) {
      case 'hoy': 
        return `${formatHour(data.hour)}:00h${statusText}\n${formatPrice(data.price)}\n${levelText}\n${trend}`
      case 'semana': 
        return `${data.label}\n${formatPrice(data.price)}\n${levelText}\n${trend}`
      case 'mes': 
        return `${data.label}\n${formatPrice(data.price)}\n${levelText}\n${trend}`
      default: 
        return `${formatPrice(data.price)}\n${levelText}\n${trend}`
    }
  }

  return (
    <div className="relative">
      {/* Controles del gráfico */}
      <div className="absolute top-2 right-2 z-10 flex space-x-2">
        <button
          onClick={() => setShowArea(!showArea)}
          className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
            showArea ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          Área
        </button>
      </div>

      {/* SVG Chart */}
      <div className="overflow-x-auto">
        <svg 
          ref={svgRef}
          width={chartWidth} 
          height={chartHeight} 
          className="min-w-[600px] bg-slate-900/20 rounded-lg"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        >
          {/* Definiciones de gradientes */}
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgb(34, 197, 94)" />
              <stop offset="50%" stopColor="rgb(59, 130, 246)" />
              <stop offset="100%" stopColor="rgb(239, 68, 68)" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Líneas de grilla horizontal */}
          {gridLines.horizontal.map((line, index) => (
            <g key={`h-grid-${index}`}>
              <line
                x1={padding.left}
                y1={line.y}
                x2={chartWidth - padding.right}
                y2={line.y}
                stroke="rgb(148, 163, 184)"
                strokeOpacity="0.2"
                strokeDasharray="2,2"
              />
              <text
                x={padding.left - 10}
                y={line.y + 4}
                fill="rgb(148, 163, 184)"
                fontSize="11"
                textAnchor="end"
                className="font-mono"
              >
                {line.price.toFixed(2)}€
              </text>
            </g>
          ))}

          {/* Líneas de grilla vertical */}
          {gridLines.vertical.map((line, index) => (
            <g key={`v-grid-${index}`}>
              <line
                x1={line.x}
                y1={padding.top}
                x2={line.x}
                y2={chartHeight - padding.bottom}
                stroke="rgb(148, 163, 184)"
                strokeOpacity="0.1"
                strokeDasharray="1,3"
              />
              <text
                x={line.x}
                y={chartHeight - padding.bottom + 20}
                fill="rgb(148, 163, 184)"
                fontSize="11"
                textAnchor="middle"
                className="font-medium"
              >
                {line.label}
              </text>
            </g>
          ))}

          {/* Área bajo la curva */}
          {showArea && (
            <path
              d={areaPath}
              fill="url(#areaGradient)"
              className="transition-all duration-500"
            />
          )}

          {/* Línea principal */}
          <path
            d={linePath}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3"
            className="transition-all duration-300"
            filter={hoveredPoint !== null ? "url(#glow)" : ""}
          />

          {/* Puntos de datos */}
          {prices.map((price, index) => {
            const x = xScale(index)
            const y = yScale(price.price)
            const isCurrentHour = period === 'hoy' && price.hour === currentHour
            const level = classifyPrice(price.price, prices)
            const isHovered = hoveredPoint === index
            const isSelected = selectedPoint === index
            
            const pointColor = level === 'bajo' ? 'rgb(34, 197, 94)' : 
                              level === 'medio' ? 'rgb(251, 191, 36)' : 'rgb(239, 68, 68)'
            
            return (
              <g key={index}>
                {/* Punto base */}
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered || isSelected ? 8 : isCurrentHour ? 6 : 4}
                  fill={pointColor}
                  stroke="white"
                  strokeWidth={isCurrentHour ? 3 : 2}
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredPoint(index)}
                  onMouseLeave={() => setHoveredPoint(null)}
                  onClick={() => setSelectedPoint(selectedPoint === index ? null : index)}
                  filter={isCurrentHour ? "url(#glow)" : ""}
                />
                
                {/* Anillo de hover */}
                {(isHovered || isSelected) && (
                  <circle
                    cx={x}
                    cy={y}
                    r="12"
                    fill="none"
                    stroke={pointColor}
                    strokeWidth="2"
                    strokeOpacity="0.5"
                    className="animate-pulse"
                  />
                )}
                
                {/* Indicador de hora actual */}
                {isCurrentHour && (
                  <circle
                    cx={x}
                    cy={y}
                    r="15"
                    fill="none"
                    stroke="rgb(59, 130, 246)"
                    strokeWidth="2"
                    strokeOpacity="0.6"
                    strokeDasharray="5,5"
                    className="animate-spin"
                    style={{ animationDuration: '3s' }}
                  />
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {/* Tooltip mejorado */}
      {(hoveredPoint !== null || selectedPoint !== null) && (
        <div className="absolute top-4 left-4 z-20">
          <div className="bg-slate-800/95 backdrop-blur-sm text-white text-sm rounded-lg px-4 py-3 shadow-xl border border-slate-600/50 min-w-48">
            <div className="whitespace-pre-line">
              {getTooltip(prices[hoveredPoint ?? selectedPoint!], hoveredPoint ?? selectedPoint!)}
            </div>
          </div>
        </div>
      )}

      {/* Leyenda de estadísticas */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="text-center">
          <div className="text-slate-400">Máximo</div>
          <div className="text-red-400 font-mono font-bold">{formatPrice(maxPrice)}</div>
        </div>
        <div className="text-center">
          <div className="text-slate-400">Mínimo</div>
          <div className="text-green-400 font-mono font-bold">{formatPrice(minPrice)}</div>
        </div>
        <div className="text-center">
          <div className="text-slate-400">Promedio</div>
          <div className="text-blue-400 font-mono font-bold">
            {formatPrice(prices.reduce((sum, p) => sum + p.price, 0) / prices.length)}
          </div>
        </div>
        {currentPrice && (
          <div className="text-center">
            <div className="text-slate-400">Actual</div>
            <div className="text-yellow-400 font-mono font-bold">{formatPrice(currentPrice)}</div>
          </div>
        )}
      </div>
    </div>
  )
}