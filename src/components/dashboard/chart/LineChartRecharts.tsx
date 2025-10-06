'use client'

import { PriceData, PeriodType } from './types'
import { classifyPrice, formatHour, formatPrice } from './types'
import { useResponsive } from '@/hooks/useResponsive'
import { Line, LineChart as RechartsLineChart, Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer } from '@/components/ui/chart'

interface LineChartProps {
  prices: PriceData[]
  period: PeriodType
  showArea?: boolean
}

export function LineChart({ prices, period, showArea = false }: LineChartProps) {
  const { isMobile, isTablet } = useResponsive()

  if (!prices || !Array.isArray(prices) || prices.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="h-72 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              📈
            </div>
            <p className="text-lg font-medium">No hay datos disponibles</p>
            <p className="text-sm text-muted-foreground mt-1">Intenta actualizar los datos</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Validar datos
  const validPrices = prices.filter(p => p && typeof p.price === 'number' && !isNaN(p.price))
  const currentHour = new Date().getHours()

  // Configuración del chart
  const chartConfig = {
    price: {
      label: "Precio",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig

  // Transformar datos para Recharts
  const chartData = validPrices.map((data, index) => {
    const level = classifyPrice(data.price, prices)
    const isCurrentHour = period === 'hoy' && data.hour === currentHour
    
    return {
      hour: formatHour(data.hour),
      price: data.price,
      level,
      isCurrentHour,
      formattedPrice: formatPrice(data.price),
      originalIndex: index
    }
  })

  // Encontrar valores min/max para referencias
  const minPrice = Math.min(...validPrices.map(p => p.price))
  const maxPrice = Math.max(...validPrices.map(p => p.price))
  const avgPrice = validPrices.reduce((sum, p) => sum + p.price, 0) / validPrices.length

  // Colores por nivel de precio
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'bajo': return 'hsl(142 71% 45%)' // Green
      case 'medio': return 'hsl(43 89% 58%)' // Amber
      case 'alto': return 'hsl(25 95% 58%)' // Orange
      case 'muy-alto': return 'hsl(0 84% 60%)' // Red
      default: return 'hsl(142 71% 45%)'
    }
  }

  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{
      payload: {
        level: string;
        isCurrentHour: boolean;
        formattedPrice: string;
      };
    }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg p-3">
          <p className="font-medium">{label}:00h</p>
          <p className="text-lg font-bold" style={{ color: getLevelColor(data.level) }}>
            {data.formattedPrice}
          </p>
          <p className="text-sm text-muted-foreground">
            Nivel: {data.level === 'bajo' ? '🟢 Bajo' : 
                   data.level === 'medio' ? '🟡 Medio' : 
                   data.level === 'alto' ? '🟠 Alto' : '🔴 Muy Alto'}
          </p>
          {data.isCurrentHour && (
            <p className="text-xs text-blue-600 font-medium">⏰ Hora actual</p>
          )}
          <div className="text-xs text-muted-foreground mt-2 space-y-1">
            <div>📊 Promedio: {formatPrice(avgPrice)}</div>
            <div className="flex justify-between gap-4">
              <span>📉 Mín: {formatPrice(minPrice)}</span>
              <span>📈 Máx: {formatPrice(maxPrice)}</span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  const CustomDot = ({ cx, cy, payload }: {
    cx?: number;
    cy?: number;
    payload?: {
      level: string;
      isCurrentHour: boolean;
    };
  }) => {
    if (!payload) return null
    
    const color = getLevelColor(payload.level)
    const isCurrentHour = payload.isCurrentHour
    
    return (
      <g>
        {/* Punto principal */}
        <circle
          cx={cx}
          cy={cy}
          r={isCurrentHour ? 6 : 4}
          fill={color}
          stroke="white"
          strokeWidth={2}
          className="transition-all duration-200"
        />
        
        {/* Punto de la hora actual con animación */}
        {isCurrentHour && (
          <>
            <circle
              cx={cx}
              cy={cy}
              r={8}
              fill="none"
              stroke={color}
              strokeWidth={2}
              opacity={0.6}
              className="animate-ping"
            />
            <circle
              cx={cx}
              cy={cy}
              r={3}
              fill="white"
            />
          </>
        )}
      </g>
    )
  }

  // Custom dot que solo aparece cada 3 horas
  const CustomDotEvery3Hours = (props: {
    cx?: number;
    cy?: number;
    payload?: {
      level: string;
      isCurrentHour: boolean;
      hour: string;
    };
  }) => {
    const { cx, cy, payload } = props
    if (!payload) return null
    
    // Extraer la hora del label (formato "0h", "3h", etc.)
    const hour = parseInt(payload.hour.replace('h', ''))
    
    // Solo mostrar puntos cada 3 horas (0, 3, 6, 9, 12, 15, 18, 21)
    if (hour % 3 === 0) {
      const color = getLevelColor(payload.level)
      const isCurrentHour = payload.isCurrentHour
      
      return (
        <g>
          <circle
            cx={cx}
            cy={cy}
            r={isCurrentHour ? 8 : 6}
            fill={color}
            stroke="white"
            strokeWidth={2}
            className="transition-all duration-200"
          />
          {isCurrentHour && (
            <circle
              cx={cx}
              cy={cy}
              r={10}
              fill="none"
              stroke={color}
              strokeWidth={2}
              opacity={0.6}
              className="animate-ping"
            />
          )}
        </g>
      )
    }
    return null
  }

  const ChartComponent = showArea ? AreaChart : RechartsLineChart

  return (
    <Card className="w-full bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900 border-slate-700/50 shadow-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          Evolución del Precio
          {showArea && <span className="text-sm text-muted-foreground">(Área)</span>}
        </CardTitle>
        <CardDescription className="text-slate-300">
          {period === 'hoy' ? 'Evolución de precios durante el día' : 
           period === 'semana' ? 'Evolución semanal de precios' : 
           'Evolución mensual de precios'}
        </CardDescription>
      </CardHeader>
      <CardContent className='px-1'>
        <ChartContainer config={chartConfig} className={`${isMobile ? 'h-[50vh] w-full' : isTablet ? 'h-[350px] w-full' : 'h-[400px] w-full'}`}>
          <ResponsiveContainer width="100%" height="100%">
            <ChartComponent 
              data={chartData} 
              margin={{ 
                top: isMobile ? 20 : 20, 
                right: isMobile ? 5 : 30, 
                left: isMobile ? 5 : 20, 
                bottom: isMobile ? 80 : 5 
              }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="hour" 
                tick={{ fontSize: isMobile ? 10 : 12 }}
                stroke="hsl(var(--muted-foreground))"
                angle={isMobile ? -45 : 0}
                textAnchor={isMobile ? 'end' : 'middle'}
                height={isMobile ? 80 : 30}
                interval={isMobile ? 2 : 'preserveStartEnd'}
                tickMargin={isMobile ? 8 : 5}
              />
              <YAxis 
                tick={{ fontSize: isMobile ? 10 : 12 }}
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={(value) => isMobile ? `${value.toFixed(3)}` : `${value.toFixed(3)}€`}
                width={isMobile ? 50 : 60}
                tickCount={isMobile ? 5 : 8}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Líneas de referencia - Solo en desktop */}
              {!isMobile && (
                <ReferenceLine 
                  y={avgPrice} 
                  stroke="hsl(var(--muted-foreground))" 
                  strokeDasharray="5 5" 
                  opacity={0.5}
                  label={{ value: "Promedio", fontSize: 12 }}
                />
              )}
              
              {/* Línea de hora actual - Solo en desktop */}
              {!isMobile && period === 'hoy' && chartData.some(d => d.isCurrentHour) && (
                <ReferenceLine 
                  x={formatHour(currentHour)} 
                  stroke="hsl(217 91% 60%)" 
                  strokeDasharray="3 3"
                  opacity={0.7}
                  label={{ value: "Ahora", fontSize: 11 }}
                />
              )}

              {showArea ? (
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={isMobile ? 4 : 2}
                  fill="hsl(var(--chart-1))"
                  fillOpacity={0.2}
                  dot={isMobile ? <CustomDotEvery3Hours />: <CustomDot />}
                  activeDot={{ r: isMobile ? 8 : 6, stroke: "hsl(var(--chart-1))", strokeWidth: 3 }}
                />
              ) : (
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={isMobile ? 4 : 2}
                  dot={isMobile ? <CustomDotEvery3Hours />: <CustomDot />}
                  activeDot={{ r: isMobile ? 8 : 6, stroke: "hsl(var(--chart-1))", strokeWidth: 3 }}
                />
              )}
            </ChartComponent>
          </ResponsiveContainer>
        </ChartContainer>
        
        {/* Estadísticas adicionales - Ocultas en móvil para más espacio */}
        {!isMobile && (
          <div className={`mt-4 grid ${isMobile ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'} gap-4 text-sm`}>
            <div className="bg-slate-800/60 rounded-lg p-3 text-center border border-slate-700/30">
              <div className="text-xs text-slate-400">Precio Actual</div>
              <div className="font-bold text-blue-400">
                {period === 'hoy' && chartData.find(d => d.isCurrentHour)?.formattedPrice || 'N/A'}
              </div>
            </div>
            <div className="bg-slate-800/60 rounded-lg p-3 text-center border border-slate-700/30">
              <div className="text-xs text-slate-400">Promedio</div>
              <div className="font-bold text-white">{formatPrice(avgPrice)}</div>
            </div>
            <div className="bg-slate-800/60 rounded-lg p-3 text-center border border-slate-700/30">
              <div className="text-xs text-slate-400">Mínimo</div>
              <div className="font-bold text-green-400">{formatPrice(minPrice)}</div>
            </div>
            <div className="bg-slate-800/60 rounded-lg p-3 text-center border border-slate-700/30">
              <div className="text-xs text-slate-400">Máximo</div>
              <div className="font-bold text-red-400">{formatPrice(maxPrice)}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}