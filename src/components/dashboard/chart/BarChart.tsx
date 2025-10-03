import { PriceData, PeriodType } from './types'
import { classifyPrice, formatHour, formatPrice } from './types'
import { useState } from 'react'

interface BarChartProps {
  prices: PriceData[]
  period: PeriodType
}

export function BarChart({ prices, period }: BarChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  if (!prices.length) {
    return (
      <div className="h-72 flex items-center justify-center text-slate-400">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-800 rounded-full flex items-center justify-center">
            📊
          </div>
          <p className="text-lg font-medium">No hay datos disponibles</p>
          <p className="text-sm text-slate-500 mt-1">Intenta actualizar los datos</p>
        </div>
      </div>
    )
  }

  const maxPrice = Math.max(...prices.map(p => p.price))
  const currentHour = new Date().getHours()
  
  // Configurar eje Y optimizado para móvil
  const yAxisMax = Math.ceil(maxPrice * 10) / 10
  const yAxisStep = Math.max(0.05, yAxisMax / 4) // Menos líneas en móvil
  const yAxisLabels = []
  for (let i = 0; i <= yAxisMax; i += yAxisStep) {
    if (yAxisLabels.length <= 4) yAxisLabels.push(i)
  }

  // Datos resumidos para tabla (solo mejores y peores precios)
  const sortedPrices = [...prices].sort((a, b) => a.price - b.price)
  const tableData = [
    { label: 'Más bajo', price: sortedPrices[0]?.price || 0, hour: sortedPrices[0]?.hour || 0 },
    { label: 'Más alto', price: sortedPrices[sortedPrices.length - 1]?.price || 0, hour: sortedPrices[sortedPrices.length - 1]?.hour || 0 },
    { label: 'Promedio', price: prices.reduce((sum, p) => sum + p.price, 0) / prices.length, hour: 12 }
  ]

  const getLabel = (data: PriceData) => {
    switch (period) {
      case 'hoy': return `${formatHour(data.hour)}h`
      case 'semana': return `S${data.hour}`
      case 'mes': return `${data.hour}`
      default: return data.hour.toString()
    }
  }

  const getTooltip = (data: PriceData, index: number) => {
    const isCurrentHour = period === 'hoy' && data.hour === currentHour
    const level = classifyPrice(data.price, prices)
    
    const statusText = isCurrentHour ? ' (Actual)' : ''
    const levelText = level === 'bajo' ? '🟢 Bajo' : 
                     level === 'medio' ? '🟡 Medio' : 
                     level === 'alto' ? '🟠 Alto' : '🔴 Muy Alto'
    
    return `${formatHour(data.hour)}:00h${statusText}\n${formatPrice(data.price)}\n${levelText}`
  }

  // Colores optimizados para móvil
  const getBarColor = (level: string, isHovered: boolean, isSelected: boolean, isCurrentHour: boolean) => {
    const colors = {
      bajo: 'bg-green-500',
      medio: 'bg-yellow-500', 
      alto: 'bg-orange-500',
      'muy-alto': 'bg-red-500'
    }
    
    let baseColor = colors[level as keyof typeof colors] || colors.medio
    
    if (isCurrentHour) baseColor += ' ring-2 ring-blue-400'
    if (isSelected) baseColor += ' brightness-110 scale-105'
    if (isHovered && !isSelected) baseColor += ' brightness-105'
    
    return baseColor + ' transition-all duration-200'
  }

  return (
    <div className="w-full">
      {/* Tabla de datos para móvil */}
      <div className="block md:hidden mb-6">
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3">Resumen de precios</h3>
          <div className="space-y-2">
            {tableData.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-slate-700/50 last:border-b-0">
                <span className="text-slate-300 text-sm">{item.label}</span>
                <div className="text-right">
                  <span className="text-white font-medium">{formatPrice(item.price)}</span>
                  {item.label !== 'Promedio' && (
                    <div className="text-xs text-slate-400">{formatHour(item.hour)}:00h</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gráfico optimizado para móvil */}
      <div className="relative bg-slate-900/30 rounded-lg p-4">
        {/* Eje Y simplificado para móvil */}
        <div className="absolute left-2 top-4 bottom-12 w-10 flex flex-col justify-between text-right pr-2">
          {yAxisLabels.reverse().map((value, index) => (
            <div key={index} className="text-xs text-slate-400 font-mono">
              {value.toFixed(2)}
            </div>
          ))}
        </div>

        {/* Líneas de grilla horizontales */}
        <div className="absolute left-12 top-4 right-4 bottom-12 flex flex-col justify-between">
          {yAxisLabels.map((_, index) => (
            <div key={index} className="w-full h-px bg-slate-700/30"></div>
          ))}
        </div>

        {/* Contenedor de barras con scroll horizontal para móvil */}
        <div className="ml-12 mr-4 overflow-x-auto scrollbar-hide">
          <div className="flex items-end justify-start md:justify-between h-48 md:h-64 space-x-1 md:space-x-2 py-4 min-w-[300px] md:min-w-0">
            {prices.map((data, index) => {
              const level = classifyPrice(data.price, prices)
              const isCurrentHour = period === 'hoy' && data.hour === currentHour
              const isHovered = hoveredIndex === index
              const isSelected = selectedIndex === index
              
              // Altura responsiva
              const heightRatio = data.price / yAxisMax
              const mobileHeight = Math.max(heightRatio * 176, 4) // 176px = h-44
              const desktopHeight = Math.max(heightRatio * 240, 6) // 240px = h-60
              
              const label = getLabel(data)
              const tooltip = getTooltip(data, index)
              const barColor = getBarColor(level, isHovered, isSelected, isCurrentHour)
              
              return (
                <div 
                  key={index} 
                  className="flex flex-col items-center group relative cursor-pointer"
                  style={{ minWidth: '24px', maxWidth: '32px', flex: '1' }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => setSelectedIndex(selectedIndex === index ? null : index)}
                >
                  {/* Barra */}
                  <div className="w-full rounded-t-md relative overflow-hidden">
                    {/* Móvil */}
                    <div 
                      className={`w-full rounded-t-md md:hidden ${barColor}`}
                      style={{ height: `${mobileHeight}px` }}
                    />
                    {/* Desktop */}
                    <div 
                      className={`w-full rounded-t-md hidden md:block ${barColor}`}
                      style={{ height: `${desktopHeight}px` }}
                    />
                    
                    {/* Indicador hora actual */}
                    {isCurrentHour && (
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                  
                  {/* Etiqueta */}
                  <span className={`text-xs mt-2 text-center font-medium transition-colors duration-200 ${
                    isCurrentHour ? 'text-blue-300' : 
                    isHovered || isSelected ? 'text-white' : 'text-slate-400'
                  }`} style={{ 
                    fontSize: '10px',
                    lineHeight: '12px',
                    maxWidth: '32px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {label}
                  </span>
                  
                  {/* Tooltip para móvil y desktop */}
                  <div className={`absolute -top-16 md:-top-20 left-1/2 transform -translate-x-1/2 transition-all duration-200 z-20 ${
                    isHovered || isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                  }`}>
                    <div className="bg-slate-800/95 backdrop-blur-sm text-white text-xs rounded-lg px-2 py-1.5 md:px-3 md:py-2 shadow-xl border border-slate-600/50 whitespace-pre-line text-center">
                      <div style={{ fontSize: '10px', lineHeight: '12px' }} className="md:text-xs md:leading-normal">
                        {tooltip}
                      </div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-800/95"></div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        
        {/* Indicador de scroll para móvil */}
        <div className="flex justify-center mt-2 md:hidden">
          <div className="text-xs text-slate-500">← Desliza para ver más →</div>
        </div>
      </div>
    </div>
  )
}

