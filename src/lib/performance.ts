/**
 * Performance Optimization Utilities
 * Advanced performance patterns for production-ready React applications
 */

import { useEffect, useRef, useState, useCallback } from 'react'

// Performance API types
interface LayoutShift extends PerformanceEntry {
  value: number
  hadRecentInput: boolean
}

interface FirstInputTiming extends PerformanceEntry {
  processingStart: number
}

// Intersection Observer Hook for lazy loading
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasBeenVisible, setHasBeenVisible] = useState(false)
  const elementRef = useRef<HTMLElement>(null)

  const setRef = useCallback((node: HTMLElement | null) => {
    elementRef.current = node
  }, [])

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting
        setIsVisible(visible)
        if (visible && !hasBeenVisible) {
          setHasBeenVisible(true)
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [hasBeenVisible, options])

  return { ref: setRef, isVisible, hasBeenVisible }
}

// Performance monitoring utilities
export class PerformanceMonitor {
  private static marks: Map<string, number> = new Map()
  
  static mark(name: string) {
    if (typeof window !== 'undefined' && 'performance' in window) {
      this.marks.set(name, performance.now())
      performance.mark(name)
    }
  }
  
  static measure(name: string, startMark: string, endMark?: string) {
    if (typeof window !== 'undefined' && 'performance' in window) {
      try {
        if (endMark) {
          performance.measure(name, startMark, endMark)
        } else {
          performance.measure(name, startMark)
        }
        
        const entries = performance.getEntriesByName(name, 'measure')
        const latest = entries[entries.length - 1]
        console.log(`🚀 Performance: ${name} took ${latest?.duration?.toFixed(2)}ms`)
        
        return latest?.duration
      } catch (error) {
        console.warn('Performance measurement failed:', error)
      }
    }
  }
  
  static getMetrics() {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      
      return {
        // Core Web Vitals
        fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
        lcp: this.getLCP(),
        cls: this.getCLS(),
        fid: this.getFID(),
        
        // Navigation timing
        domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart,
        loadComplete: navigation?.loadEventEnd - navigation?.loadEventStart,
        
        // Resource timing
        jsSize: this.getResourceSize('script'),
        cssSize: this.getResourceSize('css'),
        imageSize: this.getResourceSize('image'),
      }
    }
  }
  
  private static getLCP() {
    return new Promise((resolve) => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        resolve(lastEntry.startTime)
      }).observe({ entryTypes: ['largest-contentful-paint'] })
    })
  }
  
  private static getCLS() {
    let clsValue = 0
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as LayoutShift).hadRecentInput) {
          clsValue += (entry as LayoutShift).value
        }
      }
    }).observe({ entryTypes: ['layout-shift'] })
    return clsValue
  }
  
  private static getFID() {
    return new Promise((resolve) => {
      new PerformanceObserver((list) => {
        const firstInput = list.getEntries()[0]
        resolve((firstInput as FirstInputTiming).processingStart - firstInput.startTime)
      }).observe({ entryTypes: ['first-input'] })
    })
  }
  
  private static getResourceSize(type: string) {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
    return resources
      .filter(r => r.initiatorType === type)
      .reduce((total, r) => total + (r.transferSize || 0), 0)
  }
}

// Image optimization utilities
export const ImageOptimizer = {
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

// Resource prefetching utilities
export const ResourceManager = {
  // Prefetch critical resources
  prefetchCritical(urls: string[]) {
    if (typeof window === 'undefined') return
    
    urls.forEach(url => {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = url
      document.head.appendChild(link)
    })
  },
  
  // Preload fonts
  preloadFonts(fonts: Array<{ src: string; format: string }>) {
    if (typeof window === 'undefined') return
    
    fonts.forEach(font => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = font.src
      link.as = 'font'
      link.type = `font/${font.format}`
      link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
    })
  },
  
  // DNS prefetch for external domains
  dnsPrefetch(domains: string[]) {
    if (typeof window === 'undefined') return
    
    domains.forEach(domain => {
      const link = document.createElement('link')
      link.rel = 'dns-prefetch'
      link.href = domain
      document.head.appendChild(link)
    })
  }
}

// Bundle size monitoring (development only)
export function reportBundleSize() {
  if (process.env.NODE_ENV !== 'development') return
  
  const scripts = Array.from(document.querySelectorAll('script[src]'))
  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
  
  console.group('📦 Bundle Analysis')
  console.log('JavaScript files:', scripts.length)
  console.log('CSS files:', styles.length)
  
  // Estimate total size (this is approximate)
  Promise.all([
    ...scripts.map(s => fetch((s as HTMLScriptElement).src).then(r => r.blob())),
    ...styles.map(s => fetch((s as HTMLLinkElement).href).then(r => r.blob()))
  ]).then(blobs => {
    const totalSize = blobs.reduce((acc, blob) => acc + blob.size, 0)
    console.log(`📊 Estimated total size: ${(totalSize / 1024).toFixed(2)} KB`)
  }).catch(() => {
    console.log('Could not estimate bundle size')
  })
  
  console.groupEnd()
}

// Enhanced debounce for performance
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }
    
    const callNow = immediate && !timeout
    
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    
    if (callNow) func(...args)
  }
}

// Throttle for scroll events
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false
  
  return function(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}