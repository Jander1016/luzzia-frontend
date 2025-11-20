import { useState, useEffect, useCallback } from 'react';
import { getMonthlyDailyAverages } from '@/services/electricityService';

export interface MonthlyDailyAverage {
  day: number;
  month: number;
  year: number;
  avgPrice: number | null;
}

export function useMonthlyDailyAverages(month: number, year: number) {
  const [data, setData] = useState<MonthlyDailyAverage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await getMonthlyDailyAverages(month, year);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData
  };
}
