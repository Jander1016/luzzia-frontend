export const PRICE_RANGES = {
  low: { min: 0.06, max: 0.10, label: 'Bajo', color: 'green' },
  medium: { min: 0.11, max: 0.17, label: 'Medio', color: 'yellow' },
  high: { min: 0.18, max: 0.23, label: 'Alto', color: 'orange' },
  veryHigh: { min: 0.24, max: Infinity, label: 'Muy Alto', color: 'red' }
} as const

export const RECOMMENDATION_TYPES = {
  ideal: { icon: 'check', badge: 'Recomendado', color: 'green' },
  avoid: { icon: 'x', badge: 'Evitar', color: 'red' },
  schedule: { icon: 'clock', badge: 'Programar', color: 'blue' }
} as const

export const COMPARISON_TYPES = ['tarifa fija', 'tarifa con discriminación horaria'] as const