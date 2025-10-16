import { generateDynamicLegend } from './legendUtils';
import { ChartLegend } from './ChartLegend';
import { useMonthlyDailyAverages } from '@/hooks/useMonthlyDailyAverages';
import { useResponsive } from '@/hooks/useResponsive';
import { BarChart as RechartsBarChart, Bar, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatPrice } from './types';
import { chartConfig, getLevelColor } from '@/lib/utils';
import { ChartContainer } from '@/components/ui/chart';

export function MonthlyBarChart() {
  const { isMobile } = useResponsive();
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const { data: monthlyAverages, isLoading } = useMonthlyDailyAverages(month, year);

  if (isMobile || isLoading || !monthlyAverages || monthlyAverages.length === 0) {
    return null;
  }


  // Clasificar nivel para cada día usando el mismo criterio que el gráfico diario
  const pricesOnly = monthlyAverages.map(d => d.avgPrice ?? 0);
  const chartData = monthlyAverages.map((data) => {
    // Puedes ajustar la lógica de nivel según tu criterio
    const price = typeof data.avgPrice === 'number' && !isNaN(data.avgPrice) ? data.avgPrice : 0;
    const level = pricesOnly.length > 0 ? price < Math.min(...pricesOnly) * 1.2 ? 'bajo' : price > Math.max(...pricesOnly) * 0.8 ? 'alto' : 'medio' : '';
    return {
      day: data.day,
      price,
      level,
      formattedPrice: formatPrice(price),
      hour: 0, // dummy
      timestamp: new Date(), // dummy
    };
  });

  interface TooltipProps {
    active?: boolean;
    payload?: Array<{ payload: typeof chartData[0] }>;
    label?: string | number;
  }

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg p-3">
          <p className="font-medium">Día {label}</p>
          <p className="text-lg font-bold" style={{ color: getLevelColor(data.level) }}>
            {data.formattedPrice}
          </p>
          <p className="text-sm text-muted-foreground">
            Nivel: {data.level === 'bajo' ? '🟢 Bajo' : data.level === 'medio' ? '🟡 Medio' : '🔴 Alto'}
          </p>
        </div>
      );
    }
    return null;
  };

  // Filtrar datos nulos antes de generar la leyenda
  const validPrices = monthlyAverages
    .filter(d => typeof d.avgPrice === 'number' && !isNaN(d.avgPrice) && d.avgPrice !== null && d.avgPrice > 0)
    .map(d => ({
      day: d.day,
      price: Number(d.avgPrice),
      timestamp: new Date(),
      hour: 0 // Valor dummy, no relevante para leyenda mensual
    }));

  const legend = generateDynamicLegend(
    validPrices,
    'mes',
    'bar'
  );
  

  return (
    <div className="w-full space-y-4">
      <Card className="bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900 border-slate-700/50 shadow-2xl w-full">
        <CardHeader>
          <CardTitle className="text-white">Precio de la Electricidad - Mes</CardTitle>
          <CardDescription className="text-slate-300">Precios promedio por día del mes actual</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="day"
                  stroke="oklch(98.5% 0.001 106.423)"
                  tick={{ fill: 'oklch(98.5% 0.001 106.423)', fontWeight: 100, fontSize: 12 }}
                  axisLine={{ stroke: '#222', strokeWidth: 2 }}
                  tickLine={{ stroke: '#222', strokeWidth: 2 }}
                />
                <YAxis
                  stroke="oklch(98.5% 0.001 106.423)"
                  tick={{ fill: 'oklch(98.5% 0.001 106.423)', fontWeight: 100, fontSize: 12 }}
                  axisLine={{ stroke: '#222', strokeWidth: 2 }}
                  tickLine={{ stroke: '#222', strokeWidth: 2 }}
                />
                <Tooltip content={<CustomTooltip />} cursor={false} wrapperStyle={{ pointerEvents: 'auto' }} />
                <Bar dataKey="price" radius={[4, 4, 0, 0]} stroke="hsl(var(--border))" strokeWidth={1} isAnimationActive={false}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getLevelColor(entry.level)} />
                  ))}
                </Bar>
              </RechartsBarChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Leyenda de niveles */}
          <div className="flex justify-center items-center p-3">
            <ChartLegend legend={legend} prices={chartData} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
