import { Link, useNavigate } from '@tanstack/react-router'
import { ChevronDown, Menu } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function Header() {
  const navigate = useNavigate()
  const links = [
    {
      name: 'Company',
      path: '/',
    },
    {
      name: 'Investment',
      path: '/',
    },
    {
      name: 'Resources',
      path: '/',
    },
    {
      name: 'Support',
      path: '/',
    },
  ]

  return (
    <div className="h-20 grid place-items-center bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto flex justify-between px-4 md:px-0 items-center w-full">
        <Link to="/" className="text-xl font-bold flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img 
            src="/logo.png" 
            className="h-12 w-auto object-contain" 
            alt="NeedHomes Logo"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }} 
          />
          <div className="hidden flex-col">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 border-2 border-[var(--color-orange)] rounded-t-lg"></div>
              <span className="text-xl font-bold text-gray-900">NEEDHOMES</span>
            </div>
            <span className="text-xs text-gray-600">PROPERTY INVESTMENT LTD</span>
          </div>
        </Link>
        <div className="hidden lg:flex items-center space-x-1">
          {links.map((link) => (
            <Link
              to={link.path}
              key={link.name}
              className="px-4 py-2 text-gray-700 hover:text-[var(--color-orange)] transition-colors flex items-center gap-1 font-medium"
            >
              {link.name} <ChevronDown size={12} />
            </Link>
          ))}
        </div>
        <div className="lg:hidden">
          <Button variant="ghost" size="sm" className="p-2">
            <Menu size={20} />
          </Button>
        </div>
        <div className="space-x-2 hidden lg:flex">
          <Button
            variant="outline"
            onClick={() => navigate({ to: '/login' })}
          >
            Sign In
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate({ to: '/login' })}
          >
            Get Free Account
          </Button>
        </div>
      </nav>
    </div>
  )
}
