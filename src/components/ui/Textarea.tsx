import { TextareaHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'flex min-h-[80px] w-full rounded-xl border-2 border-gray-200 bg-white/90 backdrop-blur-sm px-4 py-3 text-base',
          'placeholder:text-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] focus:bg-white',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50',
          'transition-all duration-300 shadow-sm hover:shadow-md',
          className
        )}
        {...props}
      />
    )
  }
)

Textarea.displayName = 'Textarea'

