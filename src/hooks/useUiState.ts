'use client'

import { useCallback, useTransition } from 'react'

interface UseUIStateReturn<T> {
  isPending: boolean
  update: (value: T) => void
}

export function useUIState<T>(
  value: T,
  onChange: (value: T) => void
): UseUIStateReturn<T> {
  const [isPending, startTransition] = useTransition()

  const update = useCallback((newValue: T) => {
    startTransition(() => {
      onChange(newValue)
    })
  }, [onChange])

  return {
    isPending,
    update
  }
}