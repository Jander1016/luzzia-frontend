'use client'

import { useElectricityData } from '@/hooks/useElectricityData.simple'
import { ErrorDisplay } from '@/components/ui/errorDisplay'
import Hero from './Hero'
import { PriceChart } from './PriceChart'
import { SubscribeForm } from '../forms/SubscribeForm'
import { TrendingUp, Zap, Users } from 'lucide-react'

export function DashboardContent() {
  const { stats, isLoading, error, refetch } = useElectricityData()

  // Mostrar contenido inmediatamente, solo loading en secciones específicas
  // NO bloquear toda la página por datos de API

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
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Consulta los precios actuales y históricos del mercado eléctrico español. 
              Datos oficiales actualizados cada hora.
            </p>
          </div>
          
          <div className="relative">
            <PriceChart />
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
              <p className="text-slate-400">
                Descubre las horas más baratas para usar tus electrodomésticos
              </p>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Datos Oficiales</h3>
              <p className="text-slate-400">
                Información directa de Red Eléctrica de España (REE)
              </p>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">+1,000 usuarios</h3>
              <p className="text-slate-400">
                Únete a miles de personas que ya ahorran en su factura
              </p>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 relative">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-3xl"></div>
          
          <div className="relative z-10 text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                ¿Quieres Ahorrar Más?
              </h2>
              <p className="text-lg text-slate-400 max-w-3xl mx-auto">
                Suscríbete a nuestra newsletter y recibe alertas personalizadas cuando 
                los precios estén en su punto más bajo. <span className="text-emerald-400 font-semibold">
                Es completamente gratis.
                </span>
              </p>
            </div>

            <div className="flex justify-center">
              <SubscribeForm />
            </div>

            {/* Social proof */}
            <div className="pt-8 border-t border-slate-700/50">
              <p className="text-sm text-slate-500">
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
