'use client'


import { PriceData, PeriodType } from './types'
import { classifyPrice, formatPrice } from './types'
import { useState } from 'react'
import { useResponsive } from '@/hooks/useResponsive'
import { Pie, PieChart as RechartsPieChart, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer } from '@/components/ui/chart'
import type { PieLabelRenderProps } from 'recharts';

interface PieChartProps {
  prices: PriceData[]
  period: PeriodType
}

export function PieChart({ prices, period }: PieChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const { isMobile, isTablet } = useResponsive()

  if (!prices || !Array.isArray(prices) || prices.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="h-72 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              🥧
            </div>
            <p className="text-lg font-medium">No hay datos disponibles</p>
            <p className="text-sm text-muted-foreground mt-1">Intenta actualizar los datos</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Validar datos y proteger contra listas vacías
  function isDailyPriceAvgArray(arr: unknown[]): arr is import('@/hooks/useElectricityData.simple').DailyPriceAvg[] {
    return arr.length > 0 && typeof arr[0] === 'object' && arr[0] !== null && 'date' in arr[0] && typeof (arr[0] as { date: string }).date === 'string';
  }
  let filteredPrices: PriceData[] | import('@/hooks/useElectricityData.simple').DailyPriceAvg[] = [];
  if (period === 'hoy' && Array.isArray(prices) && !isDailyPriceAvgArray(prices)) {
    filteredPrices = (prices as PriceData[]).filter(p => p && typeof p.price === 'number' && !isNaN(p.price));
  } else if (Array.isArray(prices) && isDailyPriceAvgArray(prices)) {
    filteredPrices = (prices as import('@/hooks/useElectricityData.simple').DailyPriceAvg[]).filter(p => p && typeof p.price === 'number' && !isNaN(p.price));
  }

  // Clasificar precios por niveles
  const priceDistribution = filteredPrices.reduce((acc, priceData) => {
    const level = classifyPrice(priceData.price, prices);
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Configuración del chart
  const chartConfig = {
    bajo: {
      label: "Precio Bajo",
      color: "hsl(142 71% 45%)",
    },
    medio: {
      label: "Precio Medio",
      color: "hsl(43 89% 58%)",
    },
    alto: {
      label: "Precio Alto",
      color: "hsl(25 95% 58%)",
    },
    "muy-alto": {
      label: "Precio Muy Alto",
      color: "hsl(0 84% 60%)",
    },
  } satisfies ChartConfig;

  // Transformar datos para el gráfico
  const chartData = Object.entries(priceDistribution).map(([level, count]) => {
    const percentage = filteredPrices.length > 0 ? (count / filteredPrices.length) * 100 : 0;
    const levelLabels = {
      'bajo': '🟢 Bajo',
      'medio': '🟡 Medio',
      'alto': '🟠 Alto',
      'muy-alto': '🔴 Muy Alto'
    };
    return {
      level,
      count,
      percentage: Math.round(percentage * 10) / 10,
      label: levelLabels[level as keyof typeof levelLabels] || level,
      color: chartConfig[level as keyof typeof chartConfig]?.color || 'hsl(var(--chart-1))'
    };
  }).sort((a, b) => b.count - a.count); // Ordenar por cantidad descendente

  // Calcular estadísticas adicionales
  const avgPrice = filteredPrices.length > 0 ? filteredPrices.reduce((sum, p) => sum + p.price, 0) / filteredPrices.length : 0;
  const minPrice = filteredPrices.length > 0 ? Math.min(...filteredPrices.map(p => p.price)) : 0;
  const maxPrice = filteredPrices.length > 0 ? Math.max(...filteredPrices.map(p => p.price)) : 0;

  // Encontrar el nivel más común
  const mostCommonLevel = chartData[0];

  const CustomTooltip = ({ active, payload }: {
    active?: boolean;
    payload?: Array<{
      payload: {
        label: string;
        count: number;
        percentage: number;
        color: string;
      };
    }>;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg p-3">
          <p className="font-medium">{data.label}</p>
          <p className="text-lg font-bold" style={{ color: data.color }}>
            {data.count} horas ({data.percentage}%)
          </p>
          <p className="text-sm text-muted-foreground">
            {period === 'hoy' ? 'Horas del día' : 
             period === 'semana' ? 'Días de la semana' : 
             'Días del mes'}
          </p>
        </div>
      )
    }
    return null
  }

  const CustomLabel = (props: PieLabelRenderProps) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
    // Convertir cx/cy a number si vienen como string
    const x = typeof cx === 'string' ? parseFloat(cx) : cx;
    const y = typeof cy === 'string' ? parseFloat(cy) : cy;
    const percentNumber = typeof percent === 'number' ? percent : 0;
    // Convertir radios a número y proteger contra undefined
    const inner = typeof innerRadius === 'string' ? parseFloat(innerRadius) : (typeof innerRadius === 'number' ? innerRadius : 0);
    const outer = typeof outerRadius === 'string' ? parseFloat(outerRadius) : (typeof outerRadius === 'number' ? outerRadius : 0);
    if (x == null || y == null || percentNumber < 0.05 || !midAngle || !inner || !outer) return null;
    const RADIAN = Math.PI / 180;
    const radius = inner + (outer - inner) * 0.5;
    const labelX = x + radius * Math.cos(-midAngle * RADIAN);
    const labelY = y + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={labelX}
        y={labelY}
        fill="white"
        textAnchor={labelX > x ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
        className="drop-shadow-lg"
      >
        {`${(percentNumber * 100).toFixed(0)}%`}
      </text>
    );
  };

  const onPieEnter = (_: unknown, index: number) => {
    setActiveIndex(index)
  }

  const onPieLeave = () => {
    setActiveIndex(null)
  }

  return (
    <Card className="w-full bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900 border-slate-700/50 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-white">Distribución de Precios</CardTitle>
        <CardDescription className="text-slate-300">
          {period === 'hoy' ? 'Distribución por horas del día' : 
           period === 'semana' ? 'Distribución semanal' : 
           'Distribución mensual'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Gráfico principal */}
          <ChartContainer config={chartConfig} className={`${isMobile ? 'h-[280px] w-full' : isTablet ? 'h-[320px] w-full' : 'h-[350px] w-full'}`}>
            <ResponsiveContainer width="100%" height={isMobile ? 200 : isTablet ? 300 : 370} debounce={50}>
              <RechartsPieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={CustomLabel}
                  outerRadius={isMobile ? 80 : isTablet ? 100 : 120}
                  innerRadius={isMobile ? 25 : isTablet ? 30 : 40}
                  fill="#8884d8"
                  dataKey="count"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      stroke={activeIndex === index ? "white" : "none"}
                      strokeWidth={activeIndex === index ? 3 : 0}
                      style={{
                        filter: activeIndex === index ? 'brightness(1.1)' : 'none',
                        transform: activeIndex === index ? 'scale(1.02)' : 'scale(1)',
                        transformOrigin: 'center',
                        transition: 'all 0.2s ease-in-out'
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Leyenda personalizada */}
          <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-3`}>
            {chartData.map((entry, index) => (
              <div 
                key={entry.level}
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 transition-colors cursor-pointer border border-slate-700/30"
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate text-white">{entry.label}</div>
                  <div className="text-xs text-slate-400">
                    {entry.count} {period === 'hoy' ? 'horas' : 'períodos'} ({entry.percentage}%)
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Estadísticas adicionales */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-white">Resumen Estadístico</h4>
            <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'} gap-3 text-sm`}>
              <div className="bg-slate-800/60 rounded-lg p-3 text-center border border-slate-700/30">
                <div className="text-xs text-slate-400">Nivel Predominante</div>
                <div className="font-bold text-white" style={{ color: mostCommonLevel.color }}>
                  {mostCommonLevel.label}
                </div>
              </div>
              <div className="bg-slate-800/60 rounded-lg p-3 text-center border border-slate-700/30">
                <div className="text-xs text-slate-400">Precio Promedio</div>
                <div className="font-bold text-white">{formatPrice(avgPrice)}</div>
              </div>
              <div className="bg-slate-800/60 rounded-lg p-3 text-center border border-slate-700/30">
                <div className="text-xs text-slate-400">Precio Mínimo</div>
                <div className="font-bold text-green-400">{formatPrice(minPrice)}</div>
              </div>
              <div className="bg-slate-800/60 rounded-lg p-3 text-center border border-slate-700/30">
                <div className="text-xs text-slate-400">Precio Máximo</div>
                <div className="font-bold text-red-400">{formatPrice(maxPrice)}</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}