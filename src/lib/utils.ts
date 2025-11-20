import { ChartConfig } from "@/components/ui/chart"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getLevelColor = (level: string) => {
  switch (level) {
    case 'bajo': return 'hsl(142 71% 45%)' // Green
    case 'medio': return 'hsl(43 89% 58%)' // Amber
    case 'alto': return 'hsl(25 95% 58%)' // Orange
    case 'muy-alto': return 'hsl(0 84% 60%)' // Red
    default: return 'hsl(142 71% 45%)'
  }
}
// Utilities for image format support detection and optimized loading
export const ImageUtils = {
  // WebP support detection
  supportsWebP(): boolean {
    if (typeof window === 'undefined') return false

    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
  },

  // AVIF support detection
  supportsAVIF(): boolean {
    if (typeof window === 'undefined') return false

    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0
  },

  // Generate optimized image sources
  getOptimizedSrc(baseSrc: string, width?: number, quality = 85): string {
    if (typeof window === 'undefined') return baseSrc

    const params = new URLSearchParams()
    if (width) params.set('w', width.toString())
    params.set('q', quality.toString())

    if (this.supportsAVIF()) {
      params.set('f', 'avif')
    } else if (this.supportsWebP()) {
      params.set('f', 'webp')
    }

    return `${baseSrc}?${params.toString()}`
  }
}

export const chartConfig = {
  price: {
    label: "Precio",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig