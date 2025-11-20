'use client'

import { PriceData, PeriodType } from './types'
import { classifyPrice, formatHour, formatPrice } from './types'
import { useResponsive } from '@/hooks/useResponsive'
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer } from '@/components/ui/chart'
import { chartConfig, getLevelColor } from '@/lib/utils'

type BarChartDatum = PriceData | import('@/hooks/useElectricityData').DailyPriceAvg | { price: number | null; date: string };
interface BarChartProps {
  prices: BarChartDatum[];
  period: PeriodType;
}

export function BarChart({ prices, period }: BarChartProps) {
  // const [mobileViewIndex, setMobileViewIndex] = useState(0)
  const { isMobile } = useResponsive()

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
    
  const displayPrices = prices


  // Solo gráfico diario
  if (period !== 'hoy') {
    return (
      <Card className="w-full">
        <CardContent className="h-72 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              📊
            </div>
            <p className="text-lg font-medium">Este componente solo muestra el gráfico diario</p>
            <p className="text-sm text-muted-foreground mt-1">Usa otro componente para semanal o mensual</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Transformar datos para Recharts (solo diario)
  const chartData: Array<{ hour: string; price: number | null; level: string; isCurrentHour?: boolean; formattedPrice: string; originalIndex: number }> = (displayPrices as PriceData[]).map((data, index) => {
    const level = classifyPrice(data.price, displayPrices as PriceData[]);
    const isCurrentHour = data.hour === currentHour;
    return {
      hour: formatHour(data.hour),
      price: data.price,
      level,
      isCurrentHour,
      formattedPrice: formatPrice(data.price),
      originalIndex: index
    };
  });

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
            <p className="text-xs text-blue-800 dark:text-blue-300 font-medium">⏰ Hora actual</p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full space-y-4">     
      {/* Gráfico principal */}
      <Card className="bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900 border-slate-700/50 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white">Precio de la Electricidad</CardTitle>
          <CardDescription className="text-slate-300">
            Precios por hora de hoy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart 
                data={chartData} 
                // style={{ cursor: 'default' }}
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