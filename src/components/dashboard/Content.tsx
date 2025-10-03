'use client'

import { useElectricityData } from '@/hooks/useElectricityData.simple'



import { ErrorDisplay } from '@/components/ui/errorDisplay'
import { Loading } from '@/components/ui/loading'
import Hero from './Hero'

function LastUpdated({ lastUpdated }: { lastUpdated: Date | null }) {
  if (!lastUpdated) return null

  return (
    <div className="text-center mb-6">
      <p className="text-sm text-gray-500">
        Datos del sistema REE • Actualización automática cada hora
      </p>
    </div>
  )
}

export function DashboardContent() {
  const { stats, isLoading, error, refetch, lastUpdated } = useElectricityData()

  // Solo mostrar loading en la carga inicial
  if (isLoading && !stats) {
    return <Loading />
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Estado de los datos */}
        {/* <DataStatus 
          lastUpdated={lastUpdated}
          isLoading={isLoading}
          error={error}
          onRefresh={refetch}
        /> */}

        {/* Contenido principal */}
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

        <LastUpdated lastUpdated={lastUpdated} />

        {/* Comentarios para futuras funcionalidades */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          <PriceChart />
          <Recommendations recommendations={recommendations} />
        </div> */}
        
        {/* Información adicional */}
        {/* {stats && (
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-2">
              ℹ️ Información del sistema
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Los precios se actualizan automáticamente cada hora</li>
              <li>• Los datos provienen del sistema REE (Red Eléctrica de España)</li>
              <li>• Puedes refrescar manualmente en cualquier momento</li>
            </ul>
          </div>
        )} */}
      </div>
    </div>
  )
}