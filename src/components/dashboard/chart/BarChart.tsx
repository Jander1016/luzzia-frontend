import { PriceData, PeriodType } from './types'
import { classifyPrice, getBarColor, formatHour, formatPrice } from './types'
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
  // const minPrice = Math.min(...prices.map(p => p.price))
  const currentHour = new Date().getHours()
  
  // Configurar eje Y con mejor escalado
  const yAxisMax = Math.ceil(maxPrice * 10) / 10
  const yAxisStep = Math.max(0.05, yAxisMax / 8) // Más flexible
  const yAxisLabels = []
  for (let i = 0; i <= yAxisMax; i += yAxisStep) {
    if (yAxisLabels.length <= 6) yAxisLabels.push(i)
  }

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
    const position = index + 1
    const total = prices.length
    
    const statusText = isCurrentHour ? ' (Actual)' : ''
    const levelText = level === 'bajo' ? '🟢 Precio Bajo' : 
                     level === 'medio' ? '🟡 Precio Medio' : 
                     level === 'alto' ? '🟠 Precio Alto' : '🔴 Precio Muy Alto'
    
    switch (period) {
      case 'hoy': 
        return `${formatHour(data.hour)}:00h${statusText}\n${formatPrice(data.price)}\n${levelText}`
      case 'semana': 
        return `${data.label}\n${formatPrice(data.price)}\n${levelText}\nPosición: ${position}/${total}`
      case 'mes': 
        return `${data.label}\n${formatPrice(data.price)}\n${levelText}\nPosición: ${position}/${total}`
      default: 
        return `${formatPrice(data.price)}\n${levelText}`
    }
  }

  // Función mejorada para obtener colores con gradientes
  const getEnhancedBarColor = (level: string, isHovered: boolean, isSelected: boolean, isCurrentHour: boolean) => {
    const baseColors = {
      bajo: isCurrentHour ? 'from-emerald-400 to-green-600' : 'from-emerald-500 to-green-700',
      medio: isCurrentHour ? 'from-amber-200 to-yellow-300' : 'from-amber-300 to-yellow-400', 
      alto: isCurrentHour ? 'from-orange-400 to-orange-600' : 'from-orange-500 to-orange-700',
      'muy-alto': isCurrentHour ? 'from-red-400 to-red-600' : 'from-red-500 to-red-700'
    }
    
    const gradientBase = `bg-gradient-to-t ${baseColors[level as keyof typeof baseColors] || baseColors.medio}`
    
    let effects = ''
    if (isSelected) effects += ' ring-2 ring-white shadow-lg scale-105'
    if (isHovered && !isSelected) effects += ' shadow-md scale-102'
    if (isCurrentHour) effects += ' ring-1 ring-blue-400 shadow-blue-400/50'
    
    return `${gradientBase}${effects}`
  }

  return (
    <div className="relative">
      {/* Eje Y mejorado con mejor tipografía */}
      <div className="absolute left-0 top-2 bottom-8 w-12 flex flex-col justify-between text-right pr-2">
        {yAxisLabels.reverse().map((value, index) => (
          <div key={index} className="text-xs text-slate-400 font-mono leading-none">
            {value.toFixed(2)}€
          </div>
        ))}
      </div>

      {/* Líneas de grilla horizontal mejoradas */}
      <div className="absolute left-12 top-2 right-4 h-64 sm:h-80 flex flex-col justify-between">
        {yAxisLabels.map((_, index) => (
          <div key={index} className="w-full h-px bg-gradient-to-r from-slate-600/30 to-transparent"></div>
        ))}
      </div>

      {/* Contenedor con scroll mejorado */}
      <div className="ml-12 overflow-x-auto scrollbar-hide">
        {/* Gráfico de barras mejorado */}
        <div className="flex items-end justify-between h-64 sm:h-80 space-x-1 sm:space-x-2 px-2 mt-2 min-w-[600px] sm:min-w-0">
          {prices.map((data, index: number) => {
            const level = classifyPrice(data.price, prices)
            const isCurrentHour = period === 'hoy' && data.hour === currentHour
            const isHovered = hoveredIndex === index
            const isSelected = selectedIndex === index
            
            // Calcular altura con mejor proporción
            const heightRatio = data.price / yAxisMax
            const heightInPixels = Math.max(heightRatio * 256, 6) // Mínimo 6px, max 256px (h-64)
            const heightInPixelsLg = Math.max(heightRatio * 320, 8) // Mínimo 8px, max 320px (h-80)
            
            const label = getLabel(data)
            const tooltip = getTooltip(data, index)
            const barColor = getEnhancedBarColor(level, isHovered, isSelected, isCurrentHour)
            
            return (
              <div 
                key={index} 
                className="flex flex-col items-center flex-1 group relative min-w-[20px] sm:min-w-[16px] cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => setSelectedIndex(selectedIndex === index ? null : index)}
              >
                {/* Barra principal mejorada */}
                <div className="w-full rounded-t-lg transition-all duration-300 ease-out relative overflow-hidden">
                  {/* Barra para móvil */}
                  <div 
                    className={`w-full rounded-t-lg sm:hidden transition-all duration-300 ${barColor}`}
                    style={{ 
                      height: `${heightInPixels}px`,
                      minHeight: '6px',
                      minWidth: '12px'
                    }}
                  />
                  {/* Barra para desktop */}
                  <div 
                    className={`w-full rounded-t-lg hidden sm:block transition-all duration-300 ${barColor}`}
                    style={{ 
                      height: `${heightInPixelsLg}px`,
                      minHeight: '8px',
                      minWidth: '16px'
                    }}
                  />
                  
                  {/* Indicador de hora actual */}
                  {isCurrentHour && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
                
                {/* Etiqueta mejorada */}
                <span className={`text-[10px] sm:text-xs mt-2 truncate w-full text-center transition-colors duration-200 font-medium ${
                  isCurrentHour ? 'text-blue-300' : 
                  isHovered || isSelected ? 'text-white' : 'text-slate-400'
                }`}>
                  {label}
                </span>
                
                {/* Tooltip mejorado */}
                <div className={`absolute -top-16 sm:-top-20 left-1/2 transform -translate-x-1/2 transition-all duration-200 z-20 ${
                  isHovered || isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                }`}>
                  <div className="bg-slate-800/95 backdrop-blur-sm text-white text-xs rounded-lg px-3 py-2 shadow-xl border border-slate-600/50 whitespace-pre-line text-center max-w-40">
                    {tooltip}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-800/95"></div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      
      {/* Indicadores de navegación para móvil */}
      <div className="flex justify-center mt-4 sm:hidden">
        <div className="flex space-x-1">
          {Array.from({ length: Math.ceil(prices.length / 6) }).map((_, i) => (
            <div key={i} className="w-2 h-2 bg-slate-600 rounded-full"></div>
          ))}
        </div>
      </div>
    </div>
  )
}