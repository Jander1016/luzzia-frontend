import { ReactFC } from '@/types/react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorDisplayProps {
  title?: string
  message: string
  onRetry?: () => void
  severity?: 'error' | 'warning'
}

export const ErrorDisplay: ReactFC<ErrorDisplayProps> = ({ 
  title = 'Error',
  message,
  onRetry,
  severity = 'error'
}) => {
  const styles = {
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800'
  }

  return (
    <div className={`p-4 border rounded-lg ${styles[severity]}`}>
      <div className="flex items-start space-x-3">
        <AlertTriangle className={`h-5 w-5 mt-0.5 ${
          severity === 'error' ? 'text-red-600' : 'text-yellow-600'
        }`} />
        <div className="flex-1">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm mt-1">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Reintentar</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

ErrorDisplay.displayName = 'ErrorDisplay'