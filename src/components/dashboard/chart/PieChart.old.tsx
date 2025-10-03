import { PriceData, PeriodType } from './types'
import { classifyPrice, getChartColors, formatPrice } from './types'

interface PieChartProps {
  prices: PriceData[]
  period: PeriodType
}

export function PieChart({ prices, period }: PieChartProps) {
  if (!prices.length) {
    return (
      <div className="h-72 flex items-center justify-center text-slate-400">
        No hay datos disponibles
      </div>
    )
  }

  // Agrupar datos por clasificación de precio
  const groupedData = prices.reduce((acc, price) => {
    const classification = classifyPrice(price.price, prices)
    if (!acc[classification]) {
      acc[classification] = { count: 0, totalPrice: 0, label: classification }
    }
    acc[classification].count++
    acc[classification].totalPrice += price.price
    return acc
  }, {} as Record<string, { count: number; totalPrice: number; label: string }>)

  const pieData = Object.values(groupedData).map(group => ({
    ...group,
    percentage: (group.count / prices.length) * 100,
    avgPrice: group.totalPrice / group.count
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

  // Configuración responsive para diferentes tamaños
  const mobileConfig = {
    radius: 80,
    centerX: 110,
    centerY: 110,
    svgSize: 220,
    centerRadius: 30,
    labelRadius: 0.75
  }
  
  const desktopConfig = {
    radius: 110,
    centerX: 160,
    centerY: 160,
    svgSize: 320,
    centerRadius: 45,
    labelRadius: 0.75
  }

  // Función para crear el path de un segmento (ahora recibe config)
  const createArcPath = (startAngle: number, endAngle: number, config: typeof mobileConfig) => {
    const start = polarToCartesian(config.centerX, config.centerY, config.radius, endAngle)
    const end = polarToCartesian(config.centerX, config.centerY, config.radius, startAngle)
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"
    
    return [
      "M", config.centerX, config.centerY,
      "L", start.x, start.y,
      "A", config.radius, config.radius, 0, largeArcFlag, 0, end.x, end.y,
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

  const getLabelPosition = (startAngle: number, endAngle: number, config: typeof mobileConfig) => {
    const middleAngle = (startAngle + endAngle) / 2
    const labelRadius = config.radius * config.labelRadius
    return polarToCartesian(config.centerX, config.centerY, labelRadius, middleAngle)
  }

  const getTitle = () => {
    switch (period) {
      case 'hoy': return 'Distribución de Precios - Hoy'
      case 'semana': return 'Distribución de Precios - Semanas'
      case 'mes': return 'Distribución de Precios - Meses'
      default: return 'Distribución de Precios'
    }
  }

  return (
    <div className="relative">
      {/* Título del gráfico responsive */}
      <div className="text-center mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-1">{getTitle()}</h3>
        <p className="text-sm sm:text-base text-slate-300">
          Porcentaje de tiempo en cada rango de precio
        </p>
      </div>

      {/* Layout responsivo: vertical en móvil, horizontal en desktop */}
      <div className="flex flex-col lg:flex-row items-center justify-center space-y-6 lg:space-y-0 lg:space-x-8">
        
        {/* Gráfico circular móvil */}
        <div className="sm:hidden">
          <svg width={mobileConfig.svgSize} height={mobileConfig.svgSize} className="drop-shadow-lg">
            {segments.map((segment, index) => {
              const colors = getChartColors(segment.label)
              const labelPos = getLabelPosition(segment.startAngle, segment.endAngle, mobileConfig)
              
              return (
                <g key={index}>
                  {/* Segmento del pie */}
                  <path
                    d={createArcPath(segment.startAngle, segment.endAngle, mobileConfig)}
                    fill={colors.bg}
                    stroke="rgba(15, 23, 42, 0.9)"
                    strokeWidth="2"
                    className="hover:opacity-90 hover:brightness-110 transition-all duration-200 cursor-pointer drop-shadow-sm"
                  >
                    <title>
                      {`${segment.label}: ${segment.percentage.toFixed(1)}% (${formatPrice(segment.avgPrice)} promedio)`}
                    </title>
                  </path>
                  
                  {/* Etiqueta de porcentaje */}
                  {segment.percentage > 8 && (
                    <text
                      x={labelPos.x}
                      y={labelPos.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="text-xs font-bold fill-white drop-shadow-lg"
                      style={{ filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.8))' }}
                    >
                      {segment.percentage.toFixed(0)}%
                    </text>
                  )}
                </g>
              )
            })}
            
            {/* Círculo central móvil */}
            <circle
              cx={mobileConfig.centerX}
              cy={mobileConfig.centerY}
              r={mobileConfig.centerRadius}
              fill="rgba(15, 23, 42, 0.95)"
              stroke="rgba(148, 163, 184, 0.4)"
              strokeWidth="2"
              className="drop-shadow-lg"
            />
            
            {/* Texto central móvil */}
            <text
              x={mobileConfig.centerX}
              y={mobileConfig.centerY - 6}
              textAnchor="middle"
              className="text-sm font-bold fill-white"
              style={{ filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.5))' }}
            >
              {prices.length}
            </text>
            <text
              x={mobileConfig.centerX}
              y={mobileConfig.centerY + 10}
              textAnchor="middle"
              className="text-xs fill-slate-200 font-medium"
            >
              {period === 'hoy' ? 'horas' : period === 'semana' ? 'semanas' : 'meses'}
            </text>
          </svg>
        </div>

        {/* Gráfico circular desktop */}
        <div className="hidden sm:block">
          <svg width={desktopConfig.svgSize} height={desktopConfig.svgSize} className="drop-shadow-lg">
            {segments.map((segment, index) => {
              const colors = getChartColors(segment.label)
              const labelPos = getLabelPosition(segment.startAngle, segment.endAngle, desktopConfig)
              
              return (
                <g key={index}>
                  {/* Segmento del pie */}
                  <path
                    d={createArcPath(segment.startAngle, segment.endAngle, desktopConfig)}
                    fill={colors.bg}
                    stroke="rgba(15, 23, 42, 0.9)"
                    strokeWidth="3"
                    className="hover:opacity-90 hover:brightness-110 transition-all duration-200 cursor-pointer drop-shadow-md"
                  >
                    <title>
                      {`${segment.label}: ${segment.percentage.toFixed(1)}% (${formatPrice(segment.avgPrice)} promedio)`}
                    </title>
                  </path>
                  
                  {/* Etiqueta de porcentaje */}
                  {segment.percentage > 5 && (
                    <text
                      x={labelPos.x}
                      y={labelPos.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="text-sm font-bold fill-white drop-shadow-lg"
                      style={{ filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.8))' }}
                    >
                      {segment.percentage.toFixed(0)}%
                    </text>
                  )}
                </g>
              )
            })}
            
            {/* Círculo central desktop */}
            <circle
              cx={desktopConfig.centerX}
              cy={desktopConfig.centerY}
              r={desktopConfig.centerRadius}
              fill="rgba(15, 23, 42, 0.95)"
              stroke="rgba(148, 163, 184, 0.4)"
              strokeWidth="3"
              className="drop-shadow-xl"
            />
            
            {/* Texto central desktop */}
            <text
              x={desktopConfig.centerX}
              y={desktopConfig.centerY - 10}
              textAnchor="middle"
              className="text-lg font-bold fill-white"
              style={{ filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.5))' }}
            >
              {prices.length}
            </text>
            <text
              x={desktopConfig.centerX}
              y={desktopConfig.centerY + 12}
              textAnchor="middle"
              className="text-sm fill-slate-200 font-medium"
            >
              {period === 'hoy' ? 'horas' : period === 'semana' ? 'semanas' : 'meses'}
            </text>
          </svg>
        </div>

        {/* Leyenda responsive */}
        <div className="w-full lg:w-auto lg:ml-10">
          {/* Leyenda móvil: grid horizontal */}
          <div className="lg:hidden grid grid-cols-2 gap-4 max-w-md mx-auto bg-slate-800/50 rounded-xl p-4 backdrop-blur-sm">
            {segments.map((segment, index) => {
              const colors = getChartColors(segment.label)
              return (
                <div key={index} className="flex items-center space-x-3 bg-slate-700/30 rounded-lg p-2">
                  <div
                    className="w-4 h-4 rounded-full border-2 flex-shrink-0 shadow-sm"
                    style={{ 
                      backgroundColor: colors.bg,
                      borderColor: colors.border
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white capitalize truncate">
                      {segment.label}
                    </div>
                    <div className="text-xs text-slate-300 font-medium">
                      {segment.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Leyenda desktop: vertical */}
          <div className="hidden lg:block space-y-4 bg-slate-800/60 rounded-xl p-6 backdrop-blur-sm min-w-[220px]">
            {segments.map((segment, index) => {
              const colors = getChartColors(segment.label)
              return (
                <div key={index} className="flex items-center space-x-4 bg-slate-700/40 rounded-lg p-3 hover:bg-slate-700/60 transition-colors duration-200">
                  <div
                    className="w-5 h-5 rounded-full border-2 flex-shrink-0 shadow-md"
                    style={{ 
                      backgroundColor: colors.bg,
                      borderColor: colors.border
                    }}
                  />
                  <div className="flex-1">
                    <div className="text-base font-semibold text-white capitalize">
                      {segment.label}
                    </div>
                    <div className="text-sm text-slate-300 font-medium">
                      {segment.percentage.toFixed(1)}% • {formatPrice(segment.avgPrice)}
                    </div>
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