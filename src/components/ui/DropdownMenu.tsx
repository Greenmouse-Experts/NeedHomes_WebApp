import { HTMLAttributes, useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

export interface DropdownMenuProps extends HTMLAttributes<HTMLDivElement> {
  trigger: React.ReactNode
  children: React.ReactNode
  align?: 'left' | 'right'
}

export const DropdownMenu = ({ trigger, children, align = 'right', className, ...props }: DropdownMenuProps) => {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  const handleClose = () => setOpen(false)

  return (
    <div ref={dropdownRef} className="relative inline-block" {...props}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div
          className={cn(
            'absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg',
            align === 'right' ? 'right-0' : 'left-0',
            className
          )}
          onClick={handleClose}
        >
          {children}
        </div>
      )}
    </div>
  )
}

export interface DropdownMenuItemProps extends HTMLAttributes<HTMLDivElement> {
  onClick?: () => void
}

export const DropdownMenuItem = ({ className, onClick, ...props }: DropdownMenuItemProps) => {
  return (
    <div
      className={cn(
        'relative flex cursor-pointer select-none items-center px-3 py-2 text-sm outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100',
        className
      )}
      onClick={onClick}
      {...props}
    />
  )
}

