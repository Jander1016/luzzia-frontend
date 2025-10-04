'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Hook que ejecuta una función cuando cambia la hora
 * Útil para datos que se actualizan cada hora
 */
export function useHourlyEffect(callback: () => void, enabled: boolean = true) {
  const lastHourRef = useRef<number>(new Date().getHours())
  const callbackRef = useRef(callback)

  // Mantener la referencia actualizada
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    if (!enabled) return

    const checkHourChange = () => {
      const currentHour = new Date().getHours()
      if (currentHour !== lastHourRef.current) {
        lastHourRef.current = currentHour
        callbackRef.current()
      }
    }

    // Verificar cada minuto si cambió la hora
    const interval = setInterval(checkHourChange, 60000) // 1 minuto

    return () => clearInterval(interval)
  }, [enabled])
}

/**
 * Hook que devuelve la hora actual y se actualiza cada hora
 */
export function useCurrentHour() {
  const [currentHour, setCurrentHour] = useState(new Date().getHours())

  useHourlyEffect(() => {
    setCurrentHour(new Date().getHours())
  })

  return currentHour
}

/**
 * Hook que indica si los datos necesitan actualizarse basado en la hora
 */
export function useDataFreshness(lastUpdated: Date | null): boolean {
  const currentHour = useCurrentHour()
  
  if (!lastUpdated) return true // Datos nunca cargados

  const lastUpdatedHour = lastUpdated.getHours()
  return currentHour !== lastUpdatedHour
}