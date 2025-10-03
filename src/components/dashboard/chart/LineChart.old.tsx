import { PriceData, PeriodType } from './types'
import { classifyPrice, getChartColors, formatHour, formatPrice } from './types'
import { useState, useRef, useEffect } from 'react'

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
  
  // Configurar dimensiones responsive
  const chartWidth = 800
  const chartHeight = 300
  const padding = { top: 20, right: 40, bottom: 40, left: 60 }
  
  // Calcular escalas
  const xScale = (index: number) => (index / (prices.length - 1)) * (chartWidth - padding.left - padding.right) + padding.left
  const yScale = (price: number) => chartHeight - padding.bottom - ((price - minPrice) / (maxPrice - minPrice)) * (chartHeight - padding.top - padding.bottom)
  
  // Configurar eje Y con valores fijos desde 0.0
  const yAxisMax = Math.ceil(maxPrice * 10) / 10
  const yAxisStep = 0.1
  const yAxisLabels = []
  for (let i = 0; i <= yAxisMax; i += yAxisStep) {
    yAxisLabels.push(i)
  }

  const getLabel = (data: PriceData) => {
    switch (period) {
      case 'hoy': return `${formatHour(data.hour)}h`
      case 'semana': return `S${data.hour}`
      case 'mes': return `${data.hour}`
      default: return data.hour.toString()
    }
  }

  const getTooltip = (data: PriceData) => {
    switch (period) {
      case 'hoy': return `${formatHour(data.hour)}:00h - ${formatPrice(data.price)}`
      case 'semana': return `${data.label} - ${formatPrice(data.price)}`
      case 'mes': return `${data.label} - ${formatPrice(data.price)}`
      default: return `${formatPrice(data.price)}`
    }
  }

  return (
    <div className="relative">
      {/* Líneas de grilla horizontal sutiles */}
      <div className="absolute left-2 sm:left-4 top-2 right-2 sm:right-4 h-56 sm:h-72 flex flex-col justify-between">
        {yAxisLabels.map((_, index) => (
          <div key={index} className="w-full h-px bg-slate-700/20"></div>
        ))}
      </div>

      {/* Gráfico de líneas con estructura responsiva */}
      <div className="relative h-56 sm:h-72 px-2 sm:px-4 mt-2">
        {/* Móvil: contenedor con scroll */}
        <div className="sm:hidden overflow-x-auto">
          <div className="relative h-56 min-w-[800px]">
            {/* SVG para las líneas en móvil */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {/* Líneas conectoras entre puntos */}
              {prices.map((data, index) => {
                if (index === prices.length - 1) return null
                
                const currentData = prices[index]
                const nextData = prices[index + 1]
                const classification = classifyPrice(currentData.price, prices)
                const colors = getChartColors(classification)
                
                const totalItems = prices.length
                const currentX = ((index + 0.5) / totalItems) * 100
                const nextX = ((index + 1.5) / totalItems) * 100
                const currentY = 100 - ((currentData.price / yAxisMax) * 100)
                const nextY = 100 - ((nextData.price / yAxisMax) * 100)
                
                return (
                  <line
                    key={index}
                    x1={`${currentX}%`}
                    y1={`${currentY}%`}
                    x2={`${nextX}%`}
                    y2={`${nextY}%`}
                    stroke={colors.bg}
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="drop-shadow-sm"
                  />
                )
              })}
            </svg>

            {/* Puntos en móvil */}
            <div className="flex items-end justify-between h-56 space-x-1 min-w-[800px]">
              {prices.map((data, index) => {
                const level = classifyPrice(data.price, prices)
                const colors = getChartColors(level)
                const heightInPixels = (data.price / yAxisMax) * 224
                const label = getLabel(data)
                const tooltip = getTooltip(data)
                
                return (
                  <div key={index} className="flex flex-col items-center flex-1 group relative min-w-[16px]">
                    <div className="relative w-full flex justify-center">
                      <div style={{ height: `${heightInPixels}px` }}>
                        <div 
                          className="w-2 h-2 rounded-full border-2 cursor-pointer transition-all hover:w-3 hover:h-3 shadow-lg"
                          style={{ 
                            backgroundColor: colors.bg,
                            borderColor: colors.border,
                            position: 'absolute',
                            bottom: '0px'
                          }}
                          title={tooltip}
                        />
                      </div>
                    </div>
                    
                    <span className="text-[10px] text-slate-400 mt-1 truncate w-full text-center">
                      {label}
                    </span>
                    
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-slate-700 text-white text-[10px] rounded px-1 py-1 transition-opacity z-10 whitespace-nowrap left-1/2 transform -translate-x-1/2">
                      {tooltip}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Desktop: sin scroll */}
        <div className="hidden sm:block relative h-72">
          {/* SVG para las líneas en desktop */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Líneas conectoras entre puntos */}
            {prices.map((data, index) => {
              if (index === prices.length - 1) return null
              
              const currentData = prices[index]
              const nextData = prices[index + 1]
              const classification = classifyPrice(currentData.price, prices)
              const colors = getChartColors(classification)
              
              const totalItems = prices.length
              const currentX = ((index + 0.5) / totalItems) * 100
              const nextX = ((index + 1.5) / totalItems) * 100
              const currentY = 100 - ((currentData.price / yAxisMax) * 100)
              const nextY = 100 - ((nextData.price / yAxisMax) * 100)
              
              return (
                <line
                  key={index}
                  x1={`${currentX}%`}
                  y1={`${currentY}%`}
                  x2={`${nextX}%`}
                  y2={`${nextY}%`}
                  stroke={colors.bg}
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="drop-shadow-sm"
                />
              )
            })}
          </svg>

          {/* Puntos en desktop */}
          <div className="flex items-end justify-between h-72 space-x-2">
            {prices.map((data, index) => {
              const level = classifyPrice(data.price, prices)
              const colors = getChartColors(level)
              const heightInPixels = (data.price / yAxisMax) * 288
              const label = getLabel(data)
              const tooltip = getTooltip(data)
              
              return (
                <div key={index} className="flex flex-col items-center flex-1 group relative min-w-[12px]">
                  <div className="relative w-full flex justify-center">
                    <div style={{ height: `${heightInPixels}px` }}>
                      <div 
                        className="w-3 h-3 rounded-full border-2 cursor-pointer transition-all hover:w-4 hover:h-4 shadow-lg"
                        style={{ 
                          backgroundColor: colors.bg,
                          borderColor: colors.border,
                          position: 'absolute',
                          bottom: '0px'
                        }}
                        title={tooltip}
                      />
                    </div>
                  </div>
                  
                  <span className="text-xs text-slate-400 mt-2 truncate w-full text-center">
                    {label}
                  </span>
                  
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-10 bg-slate-700 text-white text-xs rounded px-2 py-1 transition-opacity z-10 whitespace-nowrap left-1/2 transform -translate-x-1/2">
                    {tooltip}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}