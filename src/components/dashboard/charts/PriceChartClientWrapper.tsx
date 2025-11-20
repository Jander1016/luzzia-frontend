'use client';
import dynamic from 'next/dynamic';
import { Loading } from '@/components/ui/loading';

const LazyPriceChart = dynamic(() => import('./LazyPriceChart'), {
  loading: () => <Loading />,
  ssr: false,
});

export default function PriceChartClientWrapper() {
  return <LazyPriceChart />;
}
