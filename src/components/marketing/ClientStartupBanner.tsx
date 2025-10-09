'use client'

import dynamic from 'next/dynamic'

// Lazy load StartupBanner para mejorar rendimiento inicial
const StartupBanner = dynamic(() => 
  import("@/components/marketing/StartupBanner").then(mod => ({ default: mod.StartupBanner })),
  { 
    ssr: false,
    loading: () => null
  }
)

export default function ClientStartupBanner() {
  return <StartupBanner />
}