'use client'

import dynamic from 'next/dynamic'
import { Loading } from '@/components/ui/loading'

// Lazy loading más agresivo para componentes pesados
export const LazyPriceChart = dynamic(() => 
  import('./PriceChart').then(mod => ({ default: mod.PriceChart })),
  { 
    loading: () => <Loading size="lg" />,
    ssr: false
  }
)

export const LazySubscribeForm = dynamic(() => 
  import('../../forms/SubscribeForm').then(mod => ({ default: mod.SubscribeForm })),
  { 
    loading: () => <div className="h-96 animate-pulse bg-slate-800/50 rounded-lg" />,
    ssr: false
  }
)