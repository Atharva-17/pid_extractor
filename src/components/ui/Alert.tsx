import { HTMLAttributes, forwardRef } from 'react'
import { AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react'

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error'
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className = '', variant = 'info', children, ...props }, ref) => {
    const variants = {
      info: {
        container: 'bg-blue-600/20 border-blue-500/50 text-blue-400',
        icon: Info
      },
      success: {
        container: 'bg-green-600/20 border-green-500/50 text-green-400',
        icon: CheckCircle
      },
      warning: {
        container: 'bg-yellow-600/20 border-yellow-500/50 text-yellow-400',
        icon: AlertCircle
      },
      error: {
        container: 'bg-red-600/20 border-red-500/50 text-red-400',
        icon: XCircle
      }
    }

    const Icon = variants[variant].icon

    return (
      <div
        ref={ref}
        className={`flex items-start gap-3 p-4 rounded-lg border ${variants[variant].container} ${className}`}
        {...props}
      >
        <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1">{children}</div>
      </div>
    )
  }
)

Alert.displayName = 'Alert'