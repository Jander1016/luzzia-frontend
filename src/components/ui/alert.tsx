import { ReactFC } from '@/types/react'

interface AlertProps {
  variant?: 'error' | 'warning' | 'success'
  children: React.ReactNode
  action?: {
    label: string
    onClick: () => void
  }
}

export const Alert: ReactFC<AlertProps> = ({ 
  variant = 'error', 
  children, 
  action 
}) => {
  const variants = {
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    success: 'bg-green-50 border-green-200 text-green-800'
  }

  return (
    <div className={`mb-6 p-4 border rounded-lg ${variants[variant]}`}>
      <div className="flex justify-between items-center">
        <p className="text-sm">{children}</p>
        {action && (
          <button
            onClick={action.onClick}
            className="ml-4 px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  )
}

Alert.displayName = 'Alert'