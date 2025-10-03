import { ReactFC } from '@/types/react'
import { Zap } from 'lucide-react'

interface LoadingProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

export const Loading: ReactFC<LoadingProps> = ({ 
  message = 'Cargando datos energéticos...',
  size = 'md'
}) => {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  }

  return (
    <div className="min-h-screen bg-gray-500 flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Zap className={`${sizes[size]} text-primary-500 animate-pulse`} />
        </div>
        <div 
          className={`animate-spin rounded-full border-b-2 border-primary-500 mx-auto ${sizes[size]}`}
          role="status"
          aria-label="loading"
        />
        <p className="mt-4 text-gray-500">{message}</p>
      </div>
    </div>
  )
}

Loading.displayName = 'Loading'