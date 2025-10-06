'use client'

import { PriceData, PeriodType } from './types'
import { classifyPrice, formatHour, formatPrice } from './types'
import { useState } from 'react'
import { useResponsive } from '@/hooks/useResponsive'
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer } from '@/components/ui/chart'

interface BarChartProps {
  prices: PriceData[]
  period: PeriodType
}

export function BarChart({ prices, period }: BarChartProps) {
  const [mobileViewIndex, setMobileViewIndex] = useState(0)
  const { isMobile, isTablet } = useResponsive()

  if (!prices || !Array.isArray(prices) || prices.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="h-72 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              📊
            </div>
            <p className="text-lg font-medium">No hay datos disponibles</p>
            <p className="text-sm text-muted-foreground mt-1">Intenta actualizar los datos</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Validar datos y configurar
  const currentHour = new Date().getHours()
  
  // Configuración móvil con rangos adaptativos
  const MOBILE_HOURS_PER_VIEW = 8
  
  const getTimeRangeLabel = (viewIndex: number) => {
    const startHour = viewIndex * MOBILE_HOURS_PER_VIEW
    const endHour = Math.min(startHour + MOBILE_HOURS_PER_VIEW - 1, 23)
    
    if (startHour === 0) return `🌙 ${startHour}h - ${endHour}h`
    if (startHour === 8) return `☀️ ${startHour}h - ${endHour}h`
    if (startHour === 16) return `🌅 ${startHour}h - ${endHour}h`
    return `⏰ ${startHour}h - ${endHour}h`
  }
  
  const totalMobileViews = Math.max(1, Math.ceil(prices.length / MOBILE_HOURS_PER_VIEW))
  const mobileStartIndex = Math.max(0, mobileViewIndex * MOBILE_HOURS_PER_VIEW)
  const displayPrices = isMobile ? prices.slice(mobileStartIndex, mobileStartIndex + MOBILE_HOURS_PER_VIEW) : prices

  // Configuración del chart
  const chartConfig = {
    price: {
      label: "Precio",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig

  // Transformar datos para Recharts
  const chartData = displayPrices.map((data, index) => {
    const level = classifyPrice(data.price, prices)
    const isCurrentHour = period === 'hoy' && data.hour === currentHour
    
    return {
      hour: formatHour(data.hour),
      price: data.price,
      level,
      isCurrentHour,
      formattedPrice: formatPrice(data.price),
      originalIndex: isMobile ? mobileStartIndex + index : index
    }
  })

  // Colores por nivel de precio
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'bajo': return 'hsl(142 71% 45%)' // Green
      case 'medio': return 'hsl(43 89% 58%)' // Amber
      case 'alto': return 'hsl(25 95% 58%)' // Orange
      case 'muy-alto': return 'hsl(0 84% 60%)' // Red
      default: return 'hsl(43 89% 58%)' // Default to amber
    }
  }

  // Navegación móvil
  const goToPreviousView = () => setMobileViewIndex(Math.max(0, mobileViewIndex - 1))
  const goToNextView = () => setMobileViewIndex(Math.min(totalMobileViews - 1, mobileViewIndex + 1))
  
  const goToCurrentHour = () => {
    if (!Array.isArray(prices) || prices.length === 0) return
    const currentIndex = prices.findIndex(p => p && typeof p.hour === 'number' && p.hour === currentHour)
    if (currentIndex !== -1) {
      const targetView = Math.floor(currentIndex / MOBILE_HOURS_PER_VIEW)
      setMobileViewIndex(Math.min(Math.max(0, targetView), totalMobileViews - 1))
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
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full space-y-4">
      {/* Controles de navegación móvil */}
      {isMobile && (
        <Card className="bg-gradient-to-r from-slate-800 to-slate-900 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={goToPreviousView}
                disabled={mobileViewIndex === 0}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-700/60 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600/80 transition-colors border border-slate-600/50"
              >
                <span className="text-lg">←</span>
                <span className="text-xs font-medium">Anterior</span>
              </button>
              
              <div className="text-center flex-1 px-4">
                <div className="font-semibold text-sm text-white">
                  {getTimeRangeLabel(mobileViewIndex)}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Vista {mobileViewIndex + 1} de {totalMobileViews}
                </div>
              </div>
              
              <button
                onClick={goToNextView}
                disabled={mobileViewIndex === totalMobileViews - 1}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-700/60 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600/80 transition-colors border border-slate-600/50"
              >
                <span className="text-xs font-medium">Siguiente</span>
                <span className="text-lg">→</span>
              </button>
            </div>
            
            {/* Botón para ir a la hora actual */}
            {period === 'hoy' && (
              <div className="flex justify-center mb-3">
                <button
                  onClick={goToCurrentHour}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/40 border border-blue-500/50 text-blue-300 text-xs font-medium hover:bg-blue-800/60 transition-colors"
                >
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  <span>Ir a hora actual ({formatHour(currentHour)}:00)</span>
                </button>
              </div>
            )}
            
            {/* Acceso rápido a rangos horarios */}
            <div className="flex justify-center gap-2">
              {[0, 1, 2].map((viewIndex) => (
                <button
                  key={viewIndex}
                  onClick={() => setMobileViewIndex(viewIndex)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                    mobileViewIndex === viewIndex
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'bg-slate-700/60 text-slate-300 border-slate-600/50 hover:bg-slate-600/80'
                  }`}
                >
                  {getTimeRangeLabel(viewIndex)}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gráfico principal */}
      <Card className="bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900 border-slate-700/50 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white">Precio de la Electricidad</CardTitle>
          <CardDescription className="text-slate-300">
            {period === 'hoy' ? 'Precios por hora de hoy' : 
             period === 'semana' ? 'Precios promedio por semana' : 
             'Precios promedio por mes'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className={`${isMobile ? 'h-[300px] w-full' : isTablet ? 'h-[350px] w-full' : 'h-[400px] w-full'} no-bar-selection`}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart 
                data={chartData} 
                margin={{ 
                  top: isMobile ? 10 : 20, 
                  right: isMobile ? 10 : 30, 
                  left: isMobile ? 10 : 20, 
                  bottom: isMobile ? 20 : 5 
                }}
                style={{ cursor: 'default' }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="hour" 
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  stroke="hsl(var(--muted-foreground))"
                  angle={isMobile ? -45 : 0}
                  textAnchor={isMobile ? 'end' : 'middle'}
                  height={isMobile ? 60 : 30}
                />
                <YAxis 
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(value) => isMobile ? `${value.toFixed(2)}€` : `${value.toFixed(3)}€`}
                  width={isMobile ? 50 : 60}
                />
                <Tooltip 
                  content={<CustomTooltip />}
                  cursor={false}
                  wrapperStyle={{ pointerEvents: 'auto' }}
                />
                <Bar 
                  dataKey="price" 
                  radius={[4, 4, 0, 0]}
                  stroke="hsl(var(--border))"
                  strokeWidth={1}
                  isAnimationActive={false}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={getLevelColor(entry.level)}
                      // stroke={entry.isCurrentHour ? 'hsl(217 91% 60%)' : 'hsl(var(--border))'}
                      // strokeWidth={entry.isCurrentHour ? 3 : 1}
                    />
                  ))}
                </Bar>
              </RechartsBarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}