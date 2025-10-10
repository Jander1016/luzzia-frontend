'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, Zap } from 'lucide-react'
import { usePriceAnalysis, useWeekPrices, useMonthPrices } from '@/hooks/useElectricityData.simple'
import { useResponsive } from '@/hooks/useResponsive'

// Componentes separados
import { PeriodFilter } from './chart/PeriodFilter'
import { BarChart } from './chart/BarChartRecharts'
import { LineChart } from './chart/LineChartRecharts'
import { PieChart } from './chart/PieChartRecharts'
import { ChartTypeSelector } from './chart/ChartTypeSelector'
import { ChartLegend } from './chart/ChartLegend'
import { PriceChartSkeleton, PriceChartError } from './chart/ChartStates'

// Utilidades y tipos
import { PeriodType, PriceData, ChartType } from './chart/types'
import { aggregateDataByWeeks, aggregateDataByMonths } from './chart/dataAggregation'
import { generateDynamicLegend } from './chart/legendUtils'

export function PriceChart() {
  const [activePeriod, setActivePeriod] = useState<PeriodType>('hoy')
  const [activeChartType, setActiveChartType] = useState<ChartType>('bar')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  
  // Hook para detectar dispositivos móviles
  const { isMobile } = useResponsive()
  
  // En móvil, forzar el tipo de gráfico a 'line'
  const effectiveChartType = isMobile ? 'line' : activeChartType
  
  // Hooks para diferentes períodos
  const todayAnalysis = usePriceAnalysis()
  const weekPrices = useWeekPrices()
  const monthPrices = useMonthPrices()
  
  // Seleccionar los datos según el período activo
  const currentData = activePeriod === 'hoy' ? todayAnalysis : 
                     activePeriod === 'semana' ? weekPrices : monthPrices
  
  // Procesar datos según el período
  const processedPrices = (): PriceData[] => {
    if (activePeriod === 'hoy') {
      return todayAnalysis.data?.prices || []
    } else if (activePeriod === 'semana') {
      const rawData = Array.isArray(currentData.data) ? currentData.data : []
      return aggregateDataByWeeks(rawData)
    } else if (activePeriod === 'mes') {
      const rawData = Array.isArray(currentData.data) ? currentData.data : []
      return aggregateDataByMonths(rawData)
    }
    return []
  }

  const prices = processedPrices()

  // Funciones de feedback mejoradas
  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await currentData.refetch()
      setLastUpdated(new Date())
      // Simular pequeño delay para feedback visual
      setTimeout(() => setIsRefreshing(false), 500)
    } catch {
      setIsRefreshing(false)
    }
  }

  const handlePeriodChange = (newPeriod: PeriodType) => {
    setActivePeriod(newPeriod)
    // Efecto de transición suave
    setTimeout(() => {
      document.querySelector('.chart-bg')?.classList.add('animate-chart-load')
    }, 100)
  }

  const handleChartTypeChange = (newType: ChartType) => {
    setActiveChartType(newType)
    // Efecto de transición para cambio de gráfico
    setTimeout(() => {
      document.querySelector('.chart-bg')?.classList.add('animate-chart-load')
    }, 100)
  }

  const getStatusIndicator = () => {
    if (currentData.isLoading || isRefreshing) {
      return (
        <div className="flex items-center space-x-2 text-yellow-400">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
          <span className="text-xs">Actualizando...</span>
        </div>
      )
    }
    
    const timeDiff = Math.floor((new Date().getTime() - lastUpdated.getTime()) / 1000 / 60)
    const isRecent = timeDiff < 5
    
    return (
      <div className={`flex items-center space-x-2 ${isRecent ? 'text-green-400' : 'text-slate-400'}`}>
        <div className={`w-2 h-2 rounded-full ${isRecent ? 'bg-green-400' : 'bg-slate-400'}`}></div>
        <span className="text-xs">
          {isRecent ? 'Actualizado' : `Hace ${timeDiff}m`}
        </span>
      </div>
    )
  }

  // Estados de carga y error
  if (currentData.isLoading && !isRefreshing) {
    return <PriceChartSkeleton />
  }

  if (currentData.error) {
    return <PriceChartError error={currentData.error} onRetry={handleRefresh} />
  }
  
  // Generar leyendas dinámicas
  const dynamicLegend = generateDynamicLegend(prices, activePeriod, effectiveChartType)

  // Renderizar el tipo de gráfico correcto
  const renderChart = () => {
    switch (effectiveChartType) {
      case 'bar':
        return <BarChart prices={prices} period={activePeriod} />
      case 'line':
        return <LineChart prices={prices} period={activePeriod} />
        case 'pie':
        return <PieChart prices={prices} period={activePeriod} />
      default:
        return <BarChart prices={prices} period={activePeriod} />
    }
  }

  // Funciones de utilidad para títulos
  const getTitle = () => {
    switch (activePeriod) {
      case 'hoy': return 'Precio de la Luz - Hoy'
      case 'semana': return 'Precio de la Luz - Por Semanas'
      case 'mes': return 'Precio de la Luz - Por Meses'
      default: return 'Precio de la Luz'
    }
  }

  const getDescription = () => {
    switch (activePeriod) {
      case 'hoy': return 'Datos en tiempo real - OMIE'
      case 'semana': return 'Promedio por semanas del mes actual'
      case 'mes': return 'Promedio mensual del año actual'
      default: return 'Datos de electricidad'
    }
  }

  return (
    <Card className="bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900 border-slate-700/50 shadow-2xl w-full">
      <CardHeader className={`${isMobile ? 'p-3' : 'p-4 sm:p-6'}`}>
        <div className={`flex flex-col sm:flex-row sm:justify-between sm:items-center ${isMobile ? 'mb-3' : 'mb-6'} space-y-4 sm:space-y-0`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center animate-pulse-glow">
              <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-white text-lg sm:text-xl flex items-center space-x-2">
                <span>{getTitle()}</span>
                {activePeriod === 'hoy' && <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />}
              </CardTitle>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0">
                <p className="text-slate-300 text-xs sm:text-sm">
                  {getDescription()}
                </p>
                {getStatusIndicator()}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-start md:justify-between space-y-4 md:space-y-0 md:space-x-6">
          {/* Filtro de período */}
          <div className="w-full md:w-auto md:flex-1">
            <PeriodFilter 
              activePeriod={activePeriod} 
              onPeriodChange={handlePeriodChange} 
            />
          </div>
          
          {/* Selector de tipo de gráfico - Oculto en móvil */}
          {!isMobile && (
            <div className="w-full md:w-auto md:flex-shrink-0">
              <ChartTypeSelector 
                activeType={activeChartType}
                onTypeChange={handleChartTypeChange}
              />
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className={`${isMobile ? 'p-2' : 'p-4 sm:p-2'}`}>
        {/* Gráfico dinámico con animaciones */}
        <div className={`chart-bg bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900 rounded-xl border border-slate-400/10 shadow-2xl backdrop-blur-md transition-all duration-300 ${isMobile ? 'p-1 mb-4' : 'p-2 mb-6'}`}>
          {renderChart()}
        </div>

        {/* Leyenda dinámica */}
        {/* Leyenda dinámica - Oculta en móvil para dar más espacio al gráfico */}
        {/* {( */}
        {!isMobile && (
        <div className="flex justify-center items-center p-3">
            <ChartLegend 
              legend={dynamicLegend} 
              prices={prices} 
              activePeriod={activePeriod} 
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
