'use client'

import { useElectricityData } from '@/hooks/useElectricityData.simple'
import { ErrorDisplay } from '@/components/ui/errorDisplay'
import { Loading } from '@/components/ui/loading'
import Hero from './Hero'

// function _LastUpdated({ lastUpdated }: { lastUpdated: Date | null }) {
//   if (!lastUpdated) return null

//   return (
//     <div className="text-center mb-6">
//       <p className="text-sm text-gray-500">
//         Datos del sistema REE • Actualización automática cada hora
//       </p>
//     </div>
//   )
// }

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

 
      </div>
    </>
  )
}
