import { 
  Notification, 
  NotificationType, 
  PriceRecommendationData, 
  CreateNotificationPayload,
  NotificationPriority 
} from '@/types/notifications'
import { PriceData } from '@/components/dashboard/chart/types'
import { classifyPrice } from '@/components/dashboard/chart/types'

export class NotificationRecommendationService {
  private static instance: NotificationRecommendationService
  
  public static getInstance(): NotificationRecommendationService {
    if (!NotificationRecommendationService.instance) {
      NotificationRecommendationService.instance = new NotificationRecommendationService()
    }
    return NotificationRecommendationService.instance
  }

  /**
   * Normaliza una hora para mantenerla en el rango 0-23
   */
  private normalizeHour(hour: number): number {
    return ((hour % 24) + 24) % 24
  }

  /**
   * Formatea una hora como string HH:00
   */
  private formatHour(hour: number): string {
    const normalizedHour = this.normalizeHour(hour)
    return `${String(normalizedHour).padStart(2, '0')}:00`
  }

  /**
   * Analiza los datos de precios del día y genera recomendaciones
   */
  public generateRecommendations(priceData: PriceData[]): CreateNotificationPayload[] {
    if (!priceData.length) return []

    const analysis = this.analyzePriceData(priceData)
    const recommendations: CreateNotificationPayload[] = []

    // Generar diferentes tipos de recomendaciones
    recommendations.push(...this.generateOptimalTimeRecommendations(analysis))
    recommendations.push(...this.generateAvoidUsageRecommendations(analysis))
    recommendations.push(...this.generateScheduleRecommendations(analysis))
    recommendations.push(...this.generateTipOfDay(analysis))

    return recommendations
  }

  /**
   * Analiza los datos de precios para extraer insights
   */
  private analyzePriceData(priceData: PriceData[]): PriceRecommendationData {
    const currentHour = new Date().getHours()
    const currentPrice = priceData.find(p => p.hour === currentHour)?.price || 0
    
    const prices = priceData.map(p => p.price)
    const averagePrice = prices.reduce((a, b) => a + b, 0) / prices.length
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    
    const priceClassification = classifyPrice(currentPrice, priceData) as 'bajo' | 'medio' | 'alto'
    
    // Encontrar las próximas 3 horas con precios más bajos
    const sortedByPrice = priceData
      .filter(p => p.hour > currentHour) // Solo horas futuras
      .sort((a, b) => a.price - b.price)
    
    const nextOptimalHours = sortedByPrice.slice(0, 3).map(p => p.hour)
    
    // Encontrar horas con precios altos a evitar
    const nextAvoidHours = priceData
      .filter(p => p.hour > currentHour && classifyPrice(p.price, priceData) === 'alto')
      .slice(0, 2)
      .map(p => p.hour)
    
    // Calcular oportunidad de ahorro
    const savingsOpportunity = Math.round(((currentPrice - minPrice) / currentPrice) * 100)
    
    return {
      currentHour,
      currentPrice,
      averagePrice,
      minPrice,
      maxPrice,
      priceClassification,
      nextOptimalHours,
      nextAvoidHours,
      savingsOpportunity: Math.max(0, savingsOpportunity)
    }
  }

  /**
   * Genera recomendaciones de momento ideal
   */
  private generateOptimalTimeRecommendations(analysis: PriceRecommendationData): CreateNotificationPayload[] {
    const recommendations: CreateNotificationPayload[] = []
    
    if (analysis.priceClassification === 'bajo') {
      recommendations.push({
        type: 'optimal_time',
        title: 'Momento Ideal',
        message: 'Pon la lavadora ahora',
        icon: 'check-circle',
        priority: 'high',
        actionData: {
          savings: analysis.savingsOpportunity,
          currentPrice: analysis.currentPrice
        },
        metadata: {
          priceLevel: 'low',
          currentHour: analysis.currentHour
        }
      })
    } else if (analysis.nextOptimalHours.length > 0) {
      const nextOptimalHour = analysis.nextOptimalHours[0]
      const hoursUntil = nextOptimalHour - analysis.currentHour
      
      recommendations.push({
        type: 'optimal_time',
        title: 'Momento Ideal',
        message: `Pon la lavadora ahora`,
        icon: 'check-circle',
        priority: 'medium',
        actionData: {
          timeRange: {
            start: this.formatHour(nextOptimalHour),
            end: this.formatHour(nextOptimalHour + 2)
          },
          savings: 40
        },
        metadata: {
          hoursUntil,
          nextOptimalHour
        }
      })
    }

    return recommendations
  }

  /**
   * Genera recomendaciones para evitar uso
   */
  private generateAvoidUsageRecommendations(analysis: PriceRecommendationData): CreateNotificationPayload[] {
    const recommendations: CreateNotificationPayload[] = []
    
    if (analysis.priceClassification === 'alto' && analysis.nextAvoidHours && analysis.nextAvoidHours.length > 0) {
      const currentHour = analysis.currentHour
      const nextExpensiveHour = analysis.nextAvoidHours[0]
      
      recommendations.push({
        type: 'avoid_usage',
        title: 'Evita usar ahora',
        message: 'Lavavajillas y secadora',
        icon: 'alert-triangle',
        priority: 'high',
        actionData: {
          timeRange: {
            start: this.formatHour(currentHour),
            end: this.formatHour(nextExpensiveHour + 1)
          },
          currentPrice: analysis.currentPrice
        },
        metadata: {
          priceLevel: 'high',
          currentHour: analysis.currentHour
        }
      })
    }

    return recommendations
  }

  /**
   * Genera recomendaciones de programación
   */
  private generateScheduleRecommendations(analysis: PriceRecommendationData): CreateNotificationPayload[] {
    const recommendations: CreateNotificationPayload[] = []
    
    if (analysis.nextOptimalHours.length > 0) {
      const optimalHour = analysis.nextOptimalHours[0]
      const endHour = this.normalizeHour(optimalHour + 4) // 4 horas de carga
      
      recommendations.push({
        type: 'schedule_device',
        title: 'Programa para',
        message: 'Carga del coche eléctrico',
        icon: 'clock',
        priority: 'medium',
        actionData: {
          timeRange: {
            start: this.formatHour(optimalHour),
            end: this.formatHour(endHour)
          },
          savings: 60,
          deviceType: 'electric_car'
        },
        metadata: {
          optimalHour,
          device: 'electric_car'
        }
      })
    }

    return recommendations
  }

  /**
   * Genera consejo del día
   */
  private generateTipOfDay(analysis: PriceRecommendationData): CreateNotificationPayload[] {
    const tips = [
      {
        title: 'Consejo del día',
        message: 'Usar electrodomésticos entre las 2:00 y 6:00 AM puede ahorrarte hasta un 60% en tu factura eléctrica.',
        priority: 'low' as NotificationPriority,
        metadata: { tipType: 'time_optimization' }
      },
      {
        title: 'Consejo del día',
        message: 'Los precios suelen ser más bajos durante las madrugadas y fines de semana.',
        priority: 'low' as NotificationPriority,
        metadata: { tipType: 'general_knowledge' }
      },
      {
        title: 'Consejo del día',
        message: 'Programa tu lavavajillas y lavadora para que funcionen automáticamente en horas valle.',
        priority: 'low' as NotificationPriority,
        metadata: { tipType: 'automation' }
      }
    ]

    const randomTip = tips[Math.floor(Math.random() * tips.length)]
    
    return [{
      type: 'tip_of_day',
      title: randomTip.title,
      message: randomTip.message,
      icon: 'lightbulb',
      priority: randomTip.priority,
      metadata: {
        tipType: randomTip.metadata.tipType as 'time_optimization' | 'general_knowledge' | 'automation'
      }
    }]
  }

  /**
   * Filtra notificaciones para evitar duplicados
   */
  public filterDuplicates(
    newRecommendations: CreateNotificationPayload[], 
    existingNotifications: Notification[]
  ): CreateNotificationPayload[] {
    const existingTypes = new Set(
      existingNotifications
        .filter(n => !n.isRead && this.isRecent(n.timestamp))
        .map(n => `${n.type}_${n.metadata?.currentHour || ''}`)
    )

    return newRecommendations.filter(rec => {
      const key = `${rec.type}_${rec.metadata?.currentHour || ''}`
      return !existingTypes.has(key)
    })
  }

  /**
   * Verifica si una notificación es reciente (última hora)
   */
  private isRecent(timestamp: Date): boolean {
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000)
    return new Date(timestamp) > hourAgo
  }
}

// Export singleton instance
export const notificationService = NotificationRecommendationService.getInstance()