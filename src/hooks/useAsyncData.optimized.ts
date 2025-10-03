'use client'

import { useState, useEffect, useRef, useCallback, use } from 'react'

interface UseAsyncDataOptions<T> {
  initialData?: T
  refetchInterval?: number
  retryCount?: number
  enabled?: boolean
}

interface UseAsyncDataReturn<T> {
  data: T | null
  isLoading: boolean
  error: string | null
  refetch: () => void
  lastUpdated: Date | null
}

/**
 * Hook moderno optimizado para React Compiler
 * El compilador maneja automáticamente la memoización y optimizaciones
 */
export function useAsyncData<T>(
  fetcher: () => Promise<T>,
  options: UseAsyncDataOptions<T> = {}
): UseAsyncDataReturn<T> {
  const {
    initialData = null,
    refetchInterval,
    retryCount = 2,
    enabled = true
  } = options

  const [data, setData] = useState<T | null>(initialData)
  const [isLoading, setIsLoading] = useState(!initialData)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  
  const abortControllerRef = useRef<AbortController | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // React Compiler optimizará esta función automáticamente
  const fetchData = useCallback(async (attempt: number = 1): Promise<void> => {
    if (!enabled) return

    // Cancelar request anterior
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      setIsLoading(true)
      setError(null)

      const result = await fetcher()
      
      if (controller.signal.aborted) return

      setData(result)
      setLastUpdated(new Date())
    } catch (err) {
      if (controller.signal.aborted) return

      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      
      // Reintentar si no se ha alcanzado el límite
      if (attempt < retryCount) {
        console.warn(`Intento ${attempt}/${retryCount} falló, reintentando...`, errorMessage)
        retryTimeoutRef.current = setTimeout(() => {
          fetchData(attempt + 1)
        }, Math.pow(2, attempt) * 1000) // Backoff exponencial
        return
      }

      setError(errorMessage)
      console.error('Error fetching data:', err)
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false)
      }
    }
  }, [enabled, fetcher, retryCount])

  // React Compiler optimizará esta función automáticamente  
  const refetch = () => {
    fetchData()
  }

  // Effect simplificado - React Compiler optimiza las dependencias
  useEffect(() => {
    if (enabled && !initialData) {
      fetchData()
    }

    // Configurar refetch automático solo si refetchInterval es mayor a 0
    if (refetchInterval && refetchInterval > 0 && enabled) {
      intervalRef.current = setInterval(() => {
        if (!abortControllerRef.current?.signal.aborted) {
          fetchData()
        }
      }, refetchInterval)
    }

    // Cleanup
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
    }
  }, [enabled, refetchInterval, initialData, fetchData])

  return {
    data,
    isLoading,
    error,
    refetch,
    lastUpdated
  }
}

/**
 * Hook para usar con React 19 Suspense
 */
export function useSuspenseData<T>(promise: Promise<T>): T {
  return use(promise)
}

/**
 * Hook para datos en tiempo real - optimizado para React Compiler
 */
export function useRealtimeData<T>(
  fetcher: () => Promise<T>,
  intervalMs: number = 60000
): UseAsyncDataReturn<T> {
  return useAsyncData(fetcher, {
    refetchInterval: intervalMs > 0 ? intervalMs : undefined, // Solo configurar interval si es mayor a 0
    retryCount: 3,
    enabled: true
  })
}