import { useMonthlyDailyAverages } from '@/hooks/useMonthlyDailyAverages';
import { useResponsive } from '@/hooks/useResponsive';
import { Pie, PieChart as RechartsPieChart, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getLevelColor } from '@/lib/utils';

export function MonthlyPieChart() {
  const { isMobile } = useResponsive();
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const { data: monthlyAverages, isLoading } = useMonthlyDailyAverages(month, year);

  if (isMobile || isLoading || !monthlyAverages || monthlyAverages.length === 0) {
    return null;
  }

  // Adaptar datos para el PieChart: mostrar día como label
  const pricesOnly = monthlyAverages.map(d => d.avgPrice ?? 0);
  const pieData = monthlyAverages.map((d) => {
    const level = pricesOnly.length > 0 ? (d.avgPrice ?? 0) < Math.min(...pricesOnly) * 1.2 ? 'bajo' : (d.avgPrice ?? 0) > Math.max(...pricesOnly) * 0.8 ? 'alto' : 'medio' : '';
    return {
      name: `Día ${d.day}`,
      value: d.avgPrice ?? 0,
      level,
      formattedPrice: d.avgPrice ? `${d.avgPrice.toFixed(4)} €/kWh` : 'N/A',
    };
  });

  interface TooltipProps {
    active?: boolean;
    payload?: Array<{ payload: typeof pieData[0] }>;
  }
  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg p-3">
          <p className="font-medium">{data.name}</p>
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

  return (
    <Card className="bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900 border-slate-700/50 shadow-2xl w-full">
      <CardHeader>
        <CardTitle className="text-white">Precio de la Electricidad - Mes</CardTitle>
        <CardDescription className="text-slate-300">Precios promedio por día del mes actual</CardDescription>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getLevelColor(entry.level)} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </RechartsPieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
