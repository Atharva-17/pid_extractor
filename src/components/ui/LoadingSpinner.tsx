import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'warning' | 'white'
  className?: string
}

export function LoadingSpinner({ size = 'md', variant = 'primary', className = '' }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  const variants = {
    primary: 'text-blue-400',
    warning: 'text-yellow-400',
    white: 'text-white'
  }

  return (
    <Loader2 className={`animate-spin ${sizes[size]} ${variants[variant]} ${className}`} />
  )
}