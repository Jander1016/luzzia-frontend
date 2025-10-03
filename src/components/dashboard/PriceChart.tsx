'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart3, RefreshCw, Zap, TrendingUp as TrendIcon } from 'lucide-react'
import { usePriceAnalysis, useWeekPrices, useMonthPrices } from '@/hooks/useElectricityData.simple'

// Componentes separados
import { PeriodFilter } from './chart/PeriodFilter'
import { BarChart } from './chart/BarChart'
import { LineChart } from './chart/LineChart'
import { PieChart } from './chart/PieChart'
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
    } catch (error) {
      setIsRefreshing(false)
    }
  }

  const handlePeriodChange = (newPeriod: PeriodType) => {
    setActivePeriod(newPeriod)
    // Efecto de transición suave
    setTimeout(() => {
      document.querySelector('.chart-container')?.classList.add('animate-slide-in-up')
    }, 100)
  }

  const handleChartTypeChange = (newType: ChartType) => {
    setActiveChartType(newType)
    // Efecto de transición para cambio de gráfico
    setTimeout(() => {
      document.querySelector('.chart-container')?.classList.add('animate-slide-in-left')
    }, 100)
  }

  // Auto-actualización cada 5 minutos
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (!isRefreshing) {
  //       handleRefresh()
  //     }
  //   }, 5 * 60 * 1000) // 5 minutos

  //   return () => clearInterval(interval)
  // }, [isRefreshing])

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
  const dynamicLegend = generateDynamicLegend(prices, activePeriod, activeChartType)

  // Renderizar el tipo de gráfico correcto
  const renderChart = () => {
    switch (activeChartType) {
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
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
      <CardHeader>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center animate-pulse-glow">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-white text-xl flex items-center space-x-2">
                <span>{getTitle()}</span>
                {activePeriod === 'hoy' && <Zap className="w-5 h-5 text-yellow-400" />}
              </CardTitle>
              <div className="flex items-center space-x-4">
                <p className="text-slate-400 text-sm">
                  {getDescription()}
                </p>
                {getStatusIndicator()}
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`border-slate-600 hover:bg-slate-700 transition-smooth ${
              isRefreshing ? 'animate-spin' : 'hover-scale-105'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-start md:justify-between space-y-4 md:space-y-0 md:space-x-6">
          {/* Filtro de período */}
          <div className="w-full md:w-auto md:flex-1">
            <PeriodFilter 
              activePeriod={activePeriod} 
              onPeriodChange={handlePeriodChange} 
            />
          </div>
          
          {/* Selector de tipo de gráfico */}
          <div className="w-full md:w-auto md:flex-shrink-0">
            <ChartTypeSelector 
              activeType={activeChartType}
              onTypeChange={handleChartTypeChange}
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Gráfico dinámico con animaciones */}
        <div className="chart-container mb-8 p-4 bg-gradient-chart rounded-lg glass-effect transition-smooth">
          {renderChart()}
        </div>

        {/* Leyenda dinámica */}
        <ChartLegend 
          legend={dynamicLegend} 
          prices={prices} 
          activePeriod={activePeriod} 
        />
      </CardContent>
    </Card>
  )
}
