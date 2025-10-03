import { PRICE_RANGES } from '@/lib/constants/electricity'

export class ElectricityPriceService {
  static getPriceRange(price: number): typeof PRICE_RANGES[keyof typeof PRICE_RANGES] {
    for (const range of Object.values(PRICE_RANGES)) {
      if (price >= range.min && price <= range.max) {
        return range
      }
    }
    return PRICE_RANGES.medium
  }

  static formatPrice(price: number): string {
    return new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price)
  }

  static calculateSavings(current: number, reference: number): number {
    return Math.round(((reference - current) / reference) * 100)
  }
}