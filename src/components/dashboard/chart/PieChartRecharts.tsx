'use client'


import { classifyPrice, PriceData } from './types';
import {  getLevelColor } from '@/lib/utils';
import { formatPrice } from './types';
import { useState } from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import { Pie, PieChart as RechartsPieChart, Cell, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PieChartProps {
  prices: PriceData[];
  period?: string;
}

export function PieChart({ prices, period }: PieChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { isMobile, isTablet } = useResponsive();

  const isDesktopWidth = typeof window !== 'undefined' ? window.innerWidth >= 770 : true;
  if ((!isDesktopWidth || isMobile || isTablet) && period !== 'hoy') {
    return null;
  }

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
    );
  }

  // Clasificar nivel para cada hora
  const chartData = prices.map((data: PriceData) => {
    const price = typeof data.price === 'number' && !isNaN(data.price) ? data.price : 0;
    const level = classifyPrice(data.price, prices as PriceData[]);
    return {
      ...data,
      level,
      formattedPrice: formatPrice(price),
      hourLabel: data.hour !== undefined ? `${String(data.hour).padStart(2, '0')}:00 - ${String(data.hour + 1).padStart(2, '0')}:00` : '',
    };
  });

 
  //   {
  //     color: getLevelColor('bajo'),
  //     label: 'Bajo',
  //     range: `${formatPrice(min)} - ${formatPrice(Number(medioMin))}`,
  //   },
  //   {
  //     color: getLevelColor('medio'),
  //     label: 'Medio',
  //     range: `${formatPrice(Number(medioMin))} - ${formatPrice(Number(altoMin))}`,
  //   },
  //   {
  //     color: getLevelColor('alto'),
  //     label: 'Alto',
  //     range: `${formatPrice(Number(altoMin))} - ${formatPrice(max)}`,
  //   },
  //   {
  //     color: getLevelColor('muy-alto'),
  //     label: 'Muy Alto',
  //     range: `${formatPrice(max)} - ${formatPrice(max * 1.18)}`,
  //   },
  // ];

  // Responsive sizes
  // Mejorar visualmente el tamaño y centrado del gráfico
  const outerRadius = isMobile ? 100 : isTablet ? 140 : 180;
  const innerRadius = isMobile ? 55 : isTablet ? 80 : 110;
  const chartHeight = isMobile ? 320 : isTablet ? 400 : 480;

  // Centro dinámico
  const activeData = activeIndex !== null ? chartData[activeIndex] : null;

  return (
    <Card className="w-full bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900 border-slate-700/50 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-white">Precio de la Electricidad - Hora</CardTitle>
        <CardDescription className="text-slate-300">Precios promedio por hora del día actual</CardDescription>
      </CardHeader>
      <CardContent className="flex w-full h-full p-0">
              <ResponsiveContainer width="100%" height={chartHeight}>
                <RechartsPieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={outerRadius}
                    innerRadius={innerRadius}
                    dataKey="price"
                    paddingAngle={2}
                    onMouseEnter={(_, idx) => setActiveIndex(idx)}
                    onMouseLeave={() => setActiveIndex(null)}
                    isAnimationActive={false}
                  >
                    {chartData.map((entry, idx) => (
                      <Cell
                        key={`cell-${idx}`}
                        fill={getLevelColor(entry.level)}
                        cursor="pointer"
                        stroke={activeIndex === idx ? '#fff' : 'none'}
                        strokeWidth={activeIndex === idx ? 3 : 0}
                        style={activeIndex === idx ? {
                          filter: 'drop-shadow(0 0 8px #fff)',
                          opacity: 1,
                        } : {
                          opacity: 0.85,
                        }}
                      />
                    ))}
                  </Pie>
                  {/* Centro dinámico con efecto de selección */}
                  <g>
                    <foreignObject
                      x="25%"
                      y="38%"
                      width="50%"
                      height="24%"
                      style={{ pointerEvents: 'none' }}
                    >
                      <div className={`flex flex-col items-center justify-center w-full h-full transition-all duration-200`}>
                        <span
                          className="text-base md:text-lg font-semibold text-center"
                          style={{ color: activeData ? getLevelColor(activeData.level) : '#2dd4bf' }}
                        >
                          {activeData ? activeData.hourLabel : 'Elije una hora'}
                        </span>
                        <span
                          className="text-lg md:text-xl font-bold text-center"
                          style={{ color: activeData ? getLevelColor(activeData.level) : '#2dd4bf' }}
                        >
                          {activeData ? activeData.formattedPrice : ''}
                        </span>
                      </div>
                    </foreignObject>
                  </g>
                </RechartsPieChart>
              </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}