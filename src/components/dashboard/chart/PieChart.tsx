import { PriceData, PeriodType } from './types'
import { classifyPrice, getChartColors, formatPrice } from './types'
import { useState } from 'react'

interface PieChartProps {
  prices: PriceData[]
  period: PeriodType
}

export function PieChart({ prices, period }: PieChartProps) {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null)
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null)

  if (!prices.length) {
    return (
      <div className="h-72 flex items-center justify-center text-slate-400">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-800 rounded-full flex items-center justify-center">
            🥧
          </div>
          <p className="text-lg font-medium">No hay datos disponibles</p>
          <p className="text-sm text-slate-500 mt-1">Intenta actualizar los datos</p>
        </div>
      </div>
    )
  }

  // Agrupar datos por clasificación de precio con mejores estadísticas
  const groupedData = prices.reduce((acc, price) => {
    const classification = classifyPrice(price.price, prices)
    if (!acc[classification]) {
      acc[classification] = { 
        count: 0, 
        totalPrice: 0, 
        label: classification,
        prices: []
      }
    }
    acc[classification].count++
    acc[classification].totalPrice += price.price
    acc[classification].prices.push(price.price)
    return acc
  }, {} as Record<string, { 
    count: number
    totalPrice: number
    label: string
    prices: number[]
  }>)

  const pieData = Object.values(groupedData).map(group => ({
    ...group,
    percentage: (group.count / prices.length) * 100,
    avgPrice: group.totalPrice / group.count,
    minPrice: Math.min(...group.prices),
    maxPrice: Math.max(...group.prices)
  }))

  // Calcular ángulos para cada segmento
  let currentAngle = 0
  const segments = pieData.map(data => {
    const angle = (data.percentage / 100) * 360
    const segment = {
      ...data,
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
      angle
    }
    currentAngle += angle
    return segment
  })

  // Configuración moderna con mejor diseño
  const config = {
    centerX: 180,
    centerY: 180,
    outerRadius: 120,
    innerRadius: 45, // Para donut chart
    svgSize: 360,
    hoverRadius: 130
  }

  // Función para crear el path de un donut segment
  const createDonutPath = (startAngle: number, endAngle: number, isHovered: boolean = false) => {
    const outerRadius = isHovered ? config.hoverRadius : config.outerRadius
    const startOuter = polarToCartesian(config.centerX, config.centerY, outerRadius, endAngle)
    const endOuter = polarToCartesian(config.centerX, config.centerY, outerRadius, startAngle)
    const startInner = polarToCartesian(config.centerX, config.centerY, config.innerRadius, endAngle)
    const endInner = polarToCartesian(config.centerX, config.centerY, config.innerRadius, startAngle)
    
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"
    
    return [
      "M", startOuter.x, startOuter.y, 
      "A", outerRadius, outerRadius, 0, largeArcFlag, 0, endOuter.x, endOuter.y,
      "L", endInner.x, endInner.y,
      "A", config.innerRadius, config.innerRadius, 0, largeArcFlag, 1, startInner.x, startInner.y,
      "Z"
    ].join(" ")
  }

  function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    }
  }

  // Obtener colores modernos con gradientes
  const getSegmentColor = (label: string, isHovered: boolean, isSelected: boolean) => {
    const baseGradients = {
      'bajo': 'url(#gradientGreen)',
      'medio': 'url(#gradientYellow)', 
      'alto': 'url(#gradientRed)'
    }
    
    return baseGradients[label as keyof typeof baseGradients] || baseGradients.medio
  }

  const getTitle = () => {
    switch (period) {
      case 'hoy': return 'Distribución de Precios - Hoy'
      case 'semana': return 'Distribución de Precios - Semanas'
      case 'mes': return 'Distribución de Precios - Meses'
      default: return 'Distribución de Precios'
    }
  }

  const getLabelPosition = (startAngle: number, endAngle: number) => {
    const middleAngle = (startAngle + endAngle) / 2
    const labelRadius = (config.outerRadius + config.innerRadius) / 2
    return polarToCartesian(config.centerX, config.centerY, labelRadius, middleAngle)
  }

  const getDetailedTooltip = (segment: typeof segments[0]) => {
    const levelEmoji = segment.label === 'bajo' ? '🟢' : 
                     segment.label === 'medio' ? '🟡' : '🔴'
    const levelText = segment.label === 'bajo' ? 'Precio Bajo' : 
                     segment.label === 'medio' ? 'Precio Medio' : 'Precio Alto'
    
    return `${levelEmoji} ${levelText}
${segment.percentage.toFixed(1)}% del tiempo
${segment.count} de ${prices.length} períodos
Promedio: ${formatPrice(segment.avgPrice)}
Rango: ${formatPrice(segment.minPrice)} - ${formatPrice(segment.maxPrice)}`
  }

  return (
    <div className="relative w-full">
      {/* Título del gráfico compacto */}
      <div className="text-center mb-4 lg:mb-6">
        <h3 className="text-lg lg:text-xl font-bold text-white mb-1">{getTitle()}</h3>
        <p className="text-sm text-slate-300">
          Distribución del tiempo por rango de precios
        </p>
      </div>

      {/* Layout responsive optimizado */}
      <div className="flex flex-col lg:flex-row items-start justify-center space-y-4 lg:space-y-0 lg:space-x-8">
        
        {/* Gráfico de donut responsive */}
        <div className="relative flex-shrink-0">
          <svg 
            className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] lg:w-[360px] lg:h-[360px] drop-shadow-xl"
            viewBox={`0 0 ${config.svgSize} ${config.svgSize}`}
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Definiciones de gradientes modernos */}
            <defs>
              <linearGradient id="gradientGreen" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgb(34, 197, 94)" />
                <stop offset="100%" stopColor="rgb(21, 128, 61)" />
              </linearGradient>
              <linearGradient id="gradientYellow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgb(251, 191, 36)" />
                <stop offset="100%" stopColor="rgb(217, 119, 6)" />
              </linearGradient>
              <linearGradient id="gradientRed" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgb(239, 68, 68)" />
                <stop offset="100%" stopColor="rgb(185, 28, 28)" />
              </linearGradient>
              <filter id="shadow">
                <feDropShadow dx="2" dy="4" stdDeviation="4" floodOpacity="0.3"/>
              </filter>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Segmentos del donut */}
            {segments.map((segment, index) => {
              const isHovered = hoveredSegment === segment.label
              const isSelected = selectedSegment === segment.label
              const segmentColor = getSegmentColor(segment.label, isHovered, isSelected)
              
              return (
                <g key={segment.label}>
                  {/* Segmento principal */}
                  <path
                    d={createDonutPath(segment.startAngle, segment.endAngle, isHovered)}
                    fill={segmentColor}
                    stroke="white"
                    strokeWidth={isSelected ? "3" : isHovered ? "2" : "1"}
                    className="cursor-pointer transition-all duration-300"
                    onMouseEnter={() => setHoveredSegment(segment.label)}
                    onMouseLeave={() => setHoveredSegment(null)}
                    onClick={() => setSelectedSegment(selectedSegment === segment.label ? null : segment.label)}
                    filter={isHovered || isSelected ? "url(#glow)" : "url(#shadow)"}
                  />

                  {/* Etiquetas de porcentaje en el segmento */}
                  {segment.percentage > 8 && ( // Solo mostrar si el segmento es suficientemente grande
                    <text
                      x={getLabelPosition(segment.startAngle, segment.endAngle).x}
                      y={getLabelPosition(segment.startAngle, segment.endAngle).y}
                      fill="white"
                      fontSize="14"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="pointer-events-none drop-shadow-sm"
                    >
                      {segment.percentage.toFixed(0)}%
                    </text>
                  )}
                </g>
              )
            })}

            {/* Centro del donut con estadísticas */}
            <circle
              cx={config.centerX}
              cy={config.centerY}
              r={config.innerRadius - 2}
              fill="rgb(30, 41, 59)"
              stroke="rgb(71, 85, 105)"
              strokeWidth="2"
            />
            
            {/* Texto central */}
            <text
              x={config.centerX}
              y={config.centerY - 10}
              fill="white"
              fontSize="16"
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="central"
            >
              {prices.length}
            </text>
            <text
              x={config.centerX}
              y={config.centerY + 10}
              fill="rgb(148, 163, 184)"
              fontSize="12"
              textAnchor="middle"
              dominantBaseline="central"
            >
              períodos
            </text>
          </svg>
        </div>

        {/* Leyenda moderna optimizada */}
        <div className="flex-1 lg:max-w-sm">
          <h4 className="text-lg font-semibold text-white mb-4 text-center lg:text-left">Desglose Detallado</h4>
          {segments.map((segment, index) => {
            const isHovered = hoveredSegment === segment.label
            const isSelected = selectedSegment === segment.label
            const levelEmoji = segment.label === 'bajo' ? '🟢' : 
                             segment.label === 'medio' ? '🟡' : '🔴'
            const levelText = segment.label === 'bajo' ? 'Precio Bajo' : 
                             segment.label === 'medio' ? 'Precio Medio' : 'Precio Alto'
            
            return (
              <div 
                key={segment.label}
                className={`
                  p-4 rounded-xl mb-3 cursor-pointer transition-all duration-300 border
                  ${isHovered || isSelected 
                    ? 'bg-slate-700/80 border-purple-400/50 scale-105' 
                    : 'bg-slate-800/40 border-slate-600/30 hover:bg-slate-700/60'
                  }
                `}
                onMouseEnter={() => setHoveredSegment(segment.label)}
                onMouseLeave={() => setHoveredSegment(null)}
                onClick={() => setSelectedSegment(selectedSegment === segment.label ? null : segment.label)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{levelEmoji}</span>
                    <span className="text-white font-medium text-sm">{levelText}</span>
                  </div>
                  <span className="text-white font-bold text-lg">{segment.percentage.toFixed(0)}%</span>
                </div>
                
                <div className="text-xs text-slate-300 space-y-1 mb-3">
                  <div className="flex justify-between">
                    <span>Períodos:</span>
                    <span className="font-mono">{segment.count}/{prices.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Promedio:</span>
                    <span className="font-mono">{formatPrice(segment.avgPrice)}</span>
                  </div>
                </div>
                
                <div className="space-y-1 text-sm text-slate-300">
                  <div className="flex justify-between">
                    <span>Períodos:</span>
                    <span className="font-mono">{segment.count}/{prices.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Promedio:</span>
                    <span className="font-mono">{formatPrice(segment.avgPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rango:</span>
                    <span className="font-mono text-xs">
                      {formatPrice(segment.minPrice)} - {formatPrice(segment.maxPrice)}
                    </span>
                  </div>
                </div>
                
                {/* Barra de progreso */}
                <div className="mt-3 w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      segment.label === 'bajo' ? 'bg-green-500' :
                      segment.label === 'medio' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${segment.percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Tooltip flotante para información detallada */}
      {(hoveredSegment || selectedSegment) && (
        <div className="absolute top-4 right-4 z-20">
          <div className="bg-slate-800/95 backdrop-blur-sm text-white text-sm rounded-lg px-4 py-3 shadow-xl border border-slate-600/50 max-w-64">
            <div className="whitespace-pre-line">
              {getDetailedTooltip(segments.find(s => s.label === (hoveredSegment || selectedSegment))!)}
            </div>
          </div>
        </div>
      )}

      {/* Estadísticas resumidas compactas */}
      <div className="mt-6 lg:mt-4">
        <div className="grid grid-cols-3 gap-3 lg:gap-4">
          <div className="bg-slate-800/40 rounded-lg p-3 text-center border border-slate-600/20">
            <div className="text-slate-400 text-xs mb-1">Promedio</div>
            <div className="text-white font-bold text-sm">
              {formatPrice(prices.reduce((sum, p) => sum + p.price, 0) / prices.length)}
            </div>
          </div>
          <div className="bg-slate-800/40 rounded-lg p-3 text-center border border-slate-600/20">
            <div className="text-slate-400 text-xs mb-1">Volatilidad</div>
            <div className="text-white font-bold text-sm">
              {segments.length > 1 ? 'Alta' : 'Baja'}
            </div>
          </div>
          <div className="bg-slate-800/40 rounded-lg p-3 text-center border border-slate-600/20">
            <div className="text-slate-400 text-xs mb-1">Dominante</div>
            <div className="text-white font-bold text-sm">
              {segments.reduce((max, seg) => seg.percentage > max.percentage ? seg : max).label === 'bajo' ? '🟢' :
               segments.reduce((max, seg) => seg.percentage > max.percentage ? seg : max).label === 'medio' ? '🟡' : '🔴'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}