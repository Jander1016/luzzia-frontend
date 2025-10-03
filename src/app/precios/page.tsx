'use client'

import { PriceChart } from "@/components/dashboard/PriceChart";
import { ErrorDisplay } from "@/components/ui/errorDisplay";
import { Loading } from "@/components/ui/loading";
import { useElectricityData } from "@/hooks/useElectricityData.simple";

export default function PreciosPage() {
  const { isLoading, error, refetch } = useElectricityData()
  
  if (isLoading) {
    return <Loading />
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      {error && (
        <ErrorDisplay
          title="Error de conexión"
          message={error}
          onRetry={refetch}
          severity="warning"
        />
      )}
      
      {/* Título de la página */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Precios de la Electricidad</h1>
        <p className="text-slate-400">Consulta los precios actuales y históricos del mercado eléctrico</p>
      </div>

      {/* Gráfico principal de precio de la luz */}
      <PriceChart />
    </div>
  )
}