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
  
  // Configurar eje Y optimizado para móvil con mejor legibilidad
  const yAxisMax = Math.ceil(maxPrice * 10) / 10
  const yAxisStep = Math.max(0.05, yAxisMax / 3) // Solo 3 líneas para móvil
  const yAxisLabels = []
  for (let i = 0; i <= yAxisMax; i += yAxisStep) {
    if (yAxisLabels.length <= 3) yAxisLabels.push(i)
  }

  // Datos resumidos para tabla más legible en móvil
  const sortedPrices = [...prices].sort((a, b) => a.price - b.price)
  const currentPrice = prices.find(p => p.hour === currentHour)?.price || prices[0]?.price || 0
  const tableData = [
    { label: 'Ahora', price: currentPrice, hour: currentHour, icon: '⚡' },
    { label: 'Mínimo', price: sortedPrices[0]?.price || 0, hour: sortedPrices[0]?.hour || 0, icon: '🟢' },
    { label: 'Máximo', price: sortedPrices[sortedPrices.length - 1]?.price || 0, hour: sortedPrices[sortedPrices.length - 1]?.hour || 0, icon: '🔴' }
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
      {/* Tabla de datos optimizada con Tailwind mobile-first */}
      <div className="block md:hidden mb-6">
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/30 shadow-lg">
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-xl">📊</span>
            <span>Resumen de precios</span>
          </h3>
          <div className="space-y-3">
            {tableData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-700/40 rounded-lg border border-slate-600/20 hover:bg-slate-700/60 transition-colors touch-manipulation">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="text-xl shrink-0">{item.icon}</span>
                  <div className="min-w-0">
                    <div className="text-slate-200 font-medium text-sm truncate">{item.label}</div>
                    {item.label !== 'Ahora' && (
                      <div className="text-xs text-slate-400">{formatHour(item.hour)}:00h</div>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-white font-bold text-lg">{formatPrice(item.price)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gráfico optimizado con Tailwind mobile-first */}
      <div className="relative bg-slate-900/40 backdrop-blur-sm rounded-xl p-4 border border-slate-700/30 shadow-lg">
        {/* Eje Y optimizado para móvil */}
        <div className="absolute left-2 top-6 bottom-16 w-12 flex flex-col justify-between text-right pr-2">
          {yAxisLabels.reverse().map((value, index) => (
            <div key={index} className="text-xs text-slate-300 font-medium bg-slate-800/60 px-1.5 py-0.5 rounded text-center leading-tight">
              {value.toFixed(2)}
            </div>
          ))}
        </div>

        {/* Grilla horizontal sutil */}
        <div className="absolute left-14 top-6 right-4 bottom-16 flex flex-col justify-between pointer-events-none">
          {yAxisLabels.map((_, index) => (
            <div key={index} className="w-full h-px bg-slate-600/20"></div>
          ))}
        </div>

        {/* Contenedor de barras con scroll nativo */}
        <div className="ml-14 mr-4 overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-600/30 hover:scrollbar-thumb-slate-600/50">
          <div className="flex items-end justify-start md:justify-between h-52 md:h-64 gap-1.5 md:gap-2 py-6 min-w-max md:min-w-0">
            {prices.map((data, index) => {
              const level = classifyPrice(data.price, prices)
              const isCurrentHour = period === 'hoy' && data.hour === currentHour
              const isHovered = hoveredIndex === index
              const isSelected = selectedIndex === index
              
              // Altura responsiva con Tailwind
              const heightRatio = data.price / yAxisMax
              const mobileHeight = Math.max(heightRatio * 192, 8) // h-48 = 192px
              const desktopHeight = Math.max(heightRatio * 256, 10) // h-64 = 256px
              
              const label = getLabel(data)
              const tooltip = getTooltip(data, index)
              const barColor = getBarColor(level, isHovered, isSelected, isCurrentHour)
              
              return (
                <div 
                  key={index} 
                  className="flex flex-col items-center group relative cursor-pointer touch-manipulation transform-gpu transition-transform duration-200 active:scale-95 md:active:scale-100 md:hover:scale-105"
                  style={{ minWidth: '28px', maxWidth: '36px', flex: '1 0 auto' }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => setSelectedIndex(selectedIndex === index ? null : index)}
                >
                  {/* Barra principal con sombra mejorada */}
                  <div className="w-full rounded-t-lg relative overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                    {/* Móvil */}
                    <div 
                      className={`w-full rounded-t-lg md:hidden ${barColor} transition-all duration-200`}
                      style={{ height: `${mobileHeight}px` }}
                    />
                    {/* Desktop */}
                    <div 
                      className={`w-full rounded-t-lg hidden md:block ${barColor} transition-all duration-200`}
                      style={{ height: `${desktopHeight}px` }}
                    />
                    
                    {/* Indicador hora actual con animación */}
                    {isCurrentHour && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50"></div>
                        <div className="w-1 h-1 bg-blue-300 rounded-full animate-pulse absolute top-0.5 left-0.5"></div>
                      </div>
                    )}
                  </div>
                  
                  {/* Etiqueta mejorada */}
                  <div className={`mt-3 text-center transition-all duration-200 ${
                    isCurrentHour ? 'text-blue-300 bg-blue-900/30 px-2 py-1 rounded-full text-xs font-semibold' : 
                    isHovered || isSelected ? 'text-white text-xs font-semibold' : 'text-slate-300 text-xs font-medium'
                  }`}>
                    <div className="truncate max-w-full leading-tight">
                      {label}
                    </div>
                  </div>
                  
                  {/* Tooltip responsivo */}
                  <div className={`absolute -top-20 md:-top-24 left-1/2 transform -translate-x-1/2 transition-all duration-200 z-30 ${
                    isHovered || isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                  }`}>
                    <div className="bg-slate-800/95 backdrop-blur-sm text-white rounded-lg px-3 py-2 shadow-xl border border-slate-600/50 whitespace-pre-line text-center max-w-32 md:max-w-40">
                      <div className="text-xs md:text-sm font-medium leading-tight">
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
        
        {/* Indicador de scroll nativo de Tailwind */}
        <div className="flex justify-center mt-3 md:hidden">
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/40 px-3 py-1.5 rounded-full backdrop-blur-sm">
            <span className="animate-pulse">←</span>
            <span>Desliza para ver más</span>
            <span className="animate-pulse">→</span>
          </div>
        </div>
      </div>
    </div>
  )
}

