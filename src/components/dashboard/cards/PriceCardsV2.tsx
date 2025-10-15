'use client'

import { PriceCardsClient } from './PriceCardsClient';
import { processPriceCardsData } from './PriceCardsServer';
import { PriceCardsSkeleton } from './PriceCardsClient';
import { DashboardStats, ElectricityPrice } from '@/types/api';

interface PriceCardsV2Props {
  stats: DashboardStats | null;
  dailyPrices?: ElectricityPrice[];
  isLoading?: boolean;
}

export default function PriceCardsV2({ stats, dailyPrices = [], isLoading = false }: PriceCardsV2Props) {
  if (isLoading) {
    return <PriceCardsSkeleton />;
  }

  const serverData = processPriceCardsData(stats, dailyPrices);
  if (!serverData) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No hay datos disponibles</p>
      </div>
    );
  }

  return <PriceCardsClient serverData={serverData} dailyPrices={dailyPrices} />;
}