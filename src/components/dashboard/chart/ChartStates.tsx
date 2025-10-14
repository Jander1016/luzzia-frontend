import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useResponsive } from '@/hooks/useResponsive'

export function PriceChartSkeleton() {
  const { isMobile } = useResponsive();
  return (
    <Card className={`bg-slate-800/50 border-slate-700/50${isMobile ? '' : ' backdrop-blur-sm'}`}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 bg-slate-700 rounded-xl${isMobile ? '' : ' animate-pulse'}`} />
            <div className="space-y-2">
              <div className={`h-6 bg-slate-700 rounded w-40${isMobile ? '' : ' animate-pulse'}`} />
              <div className={`h-4 bg-slate-700 rounded w-56${isMobile ? '' : ' animate-pulse'}`} />
            </div>
          </div>
        </div>
        <div className="flex space-x-1 bg-slate-700/30 rounded-lg p-1 mt-6">
          <div className={`h-10 bg-slate-700 rounded-md w-20${isMobile ? '' : ' animate-pulse'}`} />
          {!isMobile && <div className="h-10 bg-slate-700 rounded-md w-20 animate-pulse" />}
          {!isMobile && <div className="h-10 bg-slate-700 rounded-md w-20 animate-pulse" />}
        </div>
      </CardHeader>
      <CardContent>
        <div className={`h-80 bg-slate-700/30 rounded${isMobile ? '' : ' animate-pulse'} mb-8`} />
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-4'} gap-4`}>
          {[...Array(isMobile ? 2 : 4)].map((_, i) => (
            <div key={i} className={`h-16 bg-slate-700/30 rounded${isMobile ? '' : ' animate-pulse'}`} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface PriceChartErrorProps {
  error: string
  onRetry: () => void
}

export function PriceChartError({ error, onRetry }: PriceChartErrorProps) {
  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
      <CardContent className="p-6">
        <div className="text-center">
          <div className="text-red-400 mb-2">Error al cargar datos</div>
          <div className="text-slate-400 text-sm mb-4">{error}</div>
          <button 
            onClick={onRetry}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded text-sm transition-colors"
          >
            Reintentar
          </button>
        </div>
      </CardContent>
    </Card>
  )
}