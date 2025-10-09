'use client'

import { useEffect } from 'react'
import { useCriticalData } from '@/hooks/useElectricityDataContext'
import { useInView } from '@/hooks/useInView'
import { ErrorDisplay } from '@/components/ui/errorDisplay'
import Hero from './Hero'
import { SubscribeForm } from '../forms/SubscribeForm'
import { TrendingUp, Zap, Users } from 'lucide-react'
import dynamic from 'next/dynamic'
import { Loading } from '@/components/ui/loading'

// Lazy load del componente pesado PriceChart
const LazyPriceChart = dynamic(() => 
  import('./LazyPriceChart').then(mod => ({ default: mod.LazyPriceChart })),
  { 
    loading: () => <Loading />,
    ssr: false
  }
)

export function DashboardContent() {
  // Solo cargar datos críticos inmediatamente
  const { stats, isLoading, error, refetch } = useCriticalData()
  
  // Hook para detectar cuando el formulario entra en viewport
  const { ref: subscribeRef, inView: subscribeInView } = useInView({
    threshold: 0.2,
    rootMargin: '50px'
  })

  // Cargar datos críticos al montar el componente
  useEffect(() => {
    if (!stats && !isLoading) {
      console.log('🚀 Loading critical data - component mounted')
      refetch()
    }
  }, [stats, isLoading, refetch])

  return (
    <div className="min-h-screen">
      <div className="container">
      {/* <div className="container mx-auto px-4 py-8 space-y-16"> */}
        
        {/* Hero Section - Siempre visible, datos opcionales */}
        <section>
          <Hero stats={stats} isLoading={isLoading} />
        </section>

        {/* Error handling - UX mejorado */}
        {error && (
          <section className="mb-8">
            <ErrorDisplay
              title={!stats ? "Error de conexión" : "Advertencia"}
              message={!stats ? error : `Algunos datos pueden estar desactualizados: ${error}`}
              onRetry={refetch}
              severity={!stats ? "error" : "warning"}
            />
          </section>
        )}

        {/* Price Chart Section */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-4">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Precios de la Electricidad
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Consulta los precios actuales y históricos del mercado eléctrico español. 
              Datos oficiales actualizados cada hora.
            </p>
          </div>
          
          <div className="relative">
            <LazyPriceChart />
          </div>
        </section>

        {/* Value Proposition Section */}
        <section className="py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Ahorra hasta 30%</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Descubre las horas más baratas para usar tus electrodomésticos
              </p>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Datos Oficiales</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Información directa de Red Eléctrica de España (REE)
              </p>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">+1,000 usuarios</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Únete a miles de personas que ya ahorran en su factura
              </p>
            </div>
          </div>
        </section>

        {/* Newsletter Section - Progressive Loading */}
        <section ref={subscribeRef} className="py-16 relative">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-3xl"></div>
          
          <div className="relative z-10 text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                ¿Quieres Ahorrar Más?
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                Suscríbete a nuestra newsletter y recibe alertas personalizadas cuando 
                los precios estén en su punto más bajo. <span className="text-emerald-400 font-semibold">
                Es completamente gratis.
                </span>
              </p>
            </div>

            {/* Solo renderizar form cuando está visible */}
            <div className="flex justify-center">
              {subscribeInView && <SubscribeForm />}
            </div>

            {/* Social proof */}
            <div className="pt-8 border-t border-slate-700/50">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Trusted by <span className="text-emerald-400 font-semibold">1,000+ usuarios</span> • 
                Promedio de ahorro: <span className="text-emerald-400 font-semibold">25% mensual</span>
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
