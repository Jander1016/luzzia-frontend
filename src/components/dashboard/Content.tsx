'use client'

import { useElectricityData } from '@/hooks/useElectricityData.simple'
import { ErrorDisplay } from '@/components/ui/errorDisplay'
import { Loading } from '@/components/ui/loading'
import Hero from './Hero'
import { PriceChart } from './PriceChart'
import { SubscribeForm } from '../forms/SubscribeForm'

export function DashboardContent() {
  const { stats, isLoading, error, refetch } = useElectricityData()

  // Solo mostrar loading en la carga inicial
  if (isLoading && !stats) {
    return <Loading />
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <Hero stats={stats} />

        {/* Error no crítico - mostrar pero no bloquear */}
        {error && stats && (
          <div className="mt-6">
            <ErrorDisplay
              title="Advertencia"
              message={`Algunos datos pueden estar desactualizados: ${error}`}
              onRetry={refetch}
              severity="warning"
            />
          </div>
        )}

        {/* Error crítico - sin datos */}
        {error && !stats && (
          <ErrorDisplay
            title="Error de conexión"
            message={error}
            onRetry={refetch}
            severity="error"
          />
        )}

        {error && (
          <ErrorDisplay
            title="Error de conexión"
            message={error}
            onRetry={refetch}
            severity="warning"
          />
        )}

        {/* Título de la página */}
        <hr />
        <section className="mb-8 pt-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-2">Precios de la Electricidad</h2>
          <p className="text-slate-400">Consulta los precios actuales y históricos del mercado eléctrico</p>
        </section>

        {/* Gráfico principal de precio de la luz */}
        <PriceChart />

        {/* Formulario de subscripcion al newsletter*/}
        <br />
        <hr />
        <section className="mb-8 pt-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-2">Suscríbete a Nuestra Newsletter</h2>
          <p className="text-slate-400">Recibirás los precios de la Luz actualizados del día, semanal, mensual tú eliges </p>
        </section>
        <div className="mt-12 flex justify-center align-middle items-center">
          <SubscribeForm />
        </div>

      </div>
    </>
  )
}
