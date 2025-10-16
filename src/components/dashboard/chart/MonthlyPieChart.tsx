'use client';

import { useMonthlyDailyAverages } from '@/hooks/useMonthlyDailyAverages';
import { useResponsive } from '@/hooks/useResponsive';
import { Pie, PieChart as RechartsPieChart, Cell, ResponsiveContainer, Tooltip, PieLabelRenderProps } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getLevelColor } from '@/lib/utils';

import { useState, useMemo } from 'react';

export function MonthlyPieChart() {
  const { isMobile } = useResponsive();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const { data: monthlyAverages, isLoading } = useMonthlyDailyAverages(month, year);

  // Agrupar por nivel y memoizar datos derivados (antes del return)
  const { pieData, max, altoMin } = useMemo(() => {
    const pricesOnly = (monthlyAverages ?? []).map(d => d.avgPrice ?? 0);
    const min = pricesOnly.length > 0 ? Math.min(...pricesOnly) : 0;
    const max = pricesOnly.length > 0 ? Math.max(...pricesOnly) : 0;
    const medioMin = min * 1.2;
    const altoMin = max * 0.8;
    function getLevel(price: number) {
      if (price < medioMin || price === 0) return 'bajo';
      if (price < altoMin) return 'medio';
      if (price < max) return 'alto';
      return 'muy-alto';
    }
    const levelCounts: Record<string, { count: number; days: number[] }> = {};
    (monthlyAverages ?? []).forEach(d => {
      const level = getLevel(d.avgPrice ?? 0);
      if (!levelCounts[level]) levelCounts[level] = { count: 0, days: [] };
      levelCounts[level].count++;
      levelCounts[level].days.push(d.day);
    });
    const totalDays = (monthlyAverages ?? []).length;
    const pieData = Object.entries(levelCounts).map(([level, obj]) => ({
      level,
      count: obj.count,
      percentage: totalDays > 0 ? Math.round((obj.count / totalDays) * 1000) / 10 : 0,
      days: obj.days,
    })).sort((a, b) => b.count - a.count);
    return { pieData, max, altoMin };
  }, [monthlyAverages]);

  if (isMobile || isLoading || !monthlyAverages || monthlyAverages.length === 0) {
    return null;
  }

  // Custom label (porcentaje en el centro de cada segmento)
  const CustomLabel = (props: PieLabelRenderProps) => {
    const cx = Number(props.cx ?? 0);
    const cy = Number(props.cy ?? 0);
    const midAngle = Number(props.midAngle ?? 0);
    const innerRadius = Number(props.innerRadius ?? 0);
    const outerRadius = Number(props.outerRadius ?? 0);
    const percent = Number(props.percent ?? 0);
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    if (percent < 0.05) return null;
    return (
      <text
        x={x}
        y={y}
        fill="#fff"
        fontSize={18}
        fontWeight="bold"
        textAnchor="middle"
        dominantBaseline="central"
        className="drop-shadow-lg"
      >
        {`${Math.round(percent * 100)}%`}
      </text>
    );
  };

  // Custom tooltip igual a la imagen, con fondo y contraste mejorado
  interface TooltipPayload {
    payload: {
      level: string;
      count: number;
      percentage: number;
      days: number[];
    };
  }
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-4 min-w-[180px] flex flex-col items-start" >
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full" style={{ background: getLevelColor(data.level) }}></span>
            <span className={`font-semibold text-base ${data.level === 'bajo' ? 'text-teal-300' : data.level === 'medio' ? 'text-yellow-400' : data.level === 'alto' ? 'text-orange-400' : 'text-red-400'}`}>{data.level === 'bajo' ? 'Bajo' : data.level === 'medio' ? 'Medio' : data.level === 'alto' ? 'Alto' : 'Muy Alto'}</span>
          </div>
          <div className={`font-bold text-xl ${data.level === 'bajo' ? 'text-teal-300' : data.level === 'medio' ? 'text-yellow-400' : data.level === 'alto' ? 'text-orange-400' : 'text-red-400'}`}>{data.count} días <span className="font-normal">({data.percentage}%)</span></div>
          <div className="text-xs text-slate-400 mt-1">Días del mes</div>
        </div>
      );
    }
    return null;
  };

  // Responsive sizes
  const outerRadius = isMobile ? 80 : 120;
  const innerRadius = isMobile ? 40 : 65;
  const chartHeight = isMobile ? 260 : 340;

  // Leyenda de colores y rangos memoizada
  const legendItems =  [
    {
      color: getLevelColor('bajo'),
      label: 'Bajo',
      range: `0.0000 €/kWh`,
    },
    {
      color: getLevelColor('medio'),
      label: 'Medio',
      range: `> 0.0000 - ${(altoMin).toFixed(4)} €/kWh`,
    },
    {
      color: getLevelColor('alto'),
      label: 'Alto',
      range: `${(altoMin).toFixed(4)} - ${max.toFixed(4)} €/kWh`,
    },
    {
      color: getLevelColor('muy-alto'),
      label: 'Muy Alto',
      range: `${max.toFixed(4)} - ${(max * 1.18).toFixed(4)} €/kWh`,
    },
  ];

  return (
    <Card className="bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900 border-slate-700/50 shadow-2xl w-full">
      <CardHeader>
        <CardTitle className="text-white">Precio de la Electricidad - Mes</CardTitle>
        <CardDescription className="text-slate-300">Distribución de niveles por días del mes actual</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center w-full h-full p-0 md:p-4 lg:p-8">
        <div className="flex flex-col items-center justify-center w-full h-full min-h-[260px] md:min-h-[340px]">
          <div className="flex items-center justify-center w-full h-full max-w-[600px] mx-auto">
            <ResponsiveContainer width="100%" height="100%" minHeight={chartHeight}>
              <RechartsPieChart>
                <Pie
                  data={pieData}
                  dataKey="count"
                  nameKey="level"
                  cx="50%"
                  cy="50%"
                  outerRadius={outerRadius}
                  innerRadius={innerRadius}
                  label={CustomLabel}
                  labelLine={false}
                  isAnimationActive={false}
                  onMouseEnter={(_, idx) => setActiveIndex(idx)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getLevelColor(entry.level)}
                      stroke={activeIndex === index ? '#fff' : 'none'}
                      strokeWidth={activeIndex === index ? 2 : 1}
                      cursor="pointer"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} position={undefined} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          {/* Leyenda debajo del gráfico */}
          <div className="flex flex-row flex-wrap justify-center items-center gap-8 mt-8 w-full">
            {legendItems.map(item => (
              <div key={item.label} className="flex flex-col items-center min-w-[120px]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-3 h-3 rounded-full" style={{ background: item.color }}></span>
                  <span className={`font-semibold text-base`} style={{ color: item.color }}>{item.label}</span>
                </div>
                <span className="text-xs font-medium" style={{ color: item.color }}>{item.range}</span>
                <span className="text-xs text-slate-400">por día</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
