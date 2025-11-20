import { useMemo } from 'react';
import { classifyPrice, formatPrice } from '@/components/dashboard/chart/types';
import { PeriodType } from '@/components/dashboard/chart/types';

export interface ChartDatum {
  xLabel: string;
  price: number;
  level: string;
  formattedPrice: string;
  originalIndex: number;
  hour?: string;
  isCurrentHour?: boolean;
}

// El tipo de prices puede ser PriceData | { price: number | null; date?: string; hour?: number }
export function useLineChartData(
  prices: Array<{ price: number | null; date?: string; hour?: number }> | Array<{ price: number; hour: number; date?: string }>,
  period: PeriodType,
  currentHour?: number,
  isMobile?: boolean
): ChartDatum[] {
  return useMemo(() => {
    if (!prices || prices.length === 0) return [];
    if (period === 'semana') {
      const weekDays = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'];
      return prices.map((data, index, arr) => {
        const dateObj = data.date ? new Date(data.date) : new Date();
        const dayIdx = dateObj.getDay();
        const weekDay = weekDays[(dayIdx + 6) % 7];
        const arrForLevel = arr.map(d => ({ price: d.price ?? 0, hour: 0, timestamp: d.date ? new Date(d.date) : new Date() }));
        const level = classifyPrice(data.price ?? 0, arrForLevel);
        return {
          xLabel: weekDay,
          price: data.price ?? 0,
          level,
          formattedPrice: formatPrice(data.price ?? 0),
          originalIndex: index
        };
      });
    }
    if (period === 'mes') {
      function getDayFromDate(date?: string | Date): number {
        if (!date) return NaN;
        if (typeof date === 'string') {
          const parts = date.split('-');
          if (parts.length === 3) return parseInt(parts[2], 10);
          return new Date(date).getDate();
        } else if (date instanceof Date) {
          return date.getDate();
        }
        return NaN;
      }
      return prices.map((data, index, arr) => {
        const day = getDayFromDate(data.date);
        const arrForLevel = arr.map(d => ({ price: d.price ?? 0, hour: 0, timestamp: d.date ? new Date(d.date) : new Date() }));
        const level = classifyPrice(data.price ?? 0, arrForLevel);
        const showDot = (isMobile && day % 3 === 1) || !isMobile;
        return {
          xLabel: isNaN(day) ? '' : day.toString(),
          price: data.price ?? 0,
          level,
          formattedPrice: formatPrice(data.price ?? 0),
          originalIndex: index,
          hour: isNaN(day) ? '' : day.toString(),
          isCurrentHour: showDot
        };
      });
    }
    if (period === 'hoy') {
      return prices.map((data, index, arr) => {
        const hourStr = String(data.hour ?? '');
        const level = classifyPrice(data.price ?? 0, arr.map(d => ({ price: d.price ?? 0, hour: d.hour ?? 0, timestamp: d.date ? new Date(d.date) : new Date() })));
        const isCurrentHour = currentHour !== null && data.hour === currentHour;
        return {
          xLabel: hourStr,
          hour: hourStr,
          price: data.price ?? 0,
          level,
          isCurrentHour,
          formattedPrice: formatPrice(data.price ?? 0),
          originalIndex: index
        };
      });
    }
    return [];
  }, [prices, period, currentHour, isMobile]);
}
