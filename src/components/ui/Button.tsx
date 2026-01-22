import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
    
    const variants = {
      primary: 'bg-gradient-to-r from-[var(--color-orange)] to-[var(--color-orange-light)] hover:from-[var(--color-orange-dark)] hover:to-[var(--color-orange-medium)] text-white focus:ring-[var(--color-orange)] shadow-lg hover:shadow-xl',
      secondary: 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white focus:ring-gray-600 shadow-md hover:shadow-lg',
      outline: 'border-2 border-[var(--color-orange)] text-[var(--color-orange)] hover:bg-gradient-to-r hover:from-[var(--color-orange)] hover:to-[var(--color-orange-light)] hover:text-white focus:ring-[var(--color-orange)] bg-transparent',
      ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-300',
      accent: 'bg-gradient-to-r from-black to-gray-900 hover:from-gray-900 hover:to-black text-white focus:ring-gray-900 shadow-lg hover:shadow-xl',
    }
    
    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-2.5 text-base',
      lg: 'px-8 py-3.5 text-lg',
    }

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

