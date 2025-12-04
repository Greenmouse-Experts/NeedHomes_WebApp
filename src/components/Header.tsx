import { Link, useNavigate } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'
import { 
  ChevronDown, 
  Menu, 
  X, 
  Home, 
  Building2, 
  FileText, 
  HelpCircle,
  LogIn,
  UserPlus
} from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function Header() {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const links = [
    {
      name: 'Company',
      path: '/',
      icon: Building2,
    },
    {
      name: 'Investment',
      path: '/',
      icon: Building2,
    },
    {
      name: 'Resources',
      path: '/',
      icon: FileText,
    },
    {
      name: 'Support',
      path: '/',
      icon: HelpCircle,
    },
  ]

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false)
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [mobileMenuOpen])

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
        <div className="lg:hidden relative" ref={menuRef}>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
          
          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
              {/* Navigation Links */}
              {links.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[var(--color-orange)] transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{link.name}</span>
                  </Link>
                )
              })}
              
              {/* Divider */}
              <div className="border-t border-gray-200 my-2"></div>
              
              {/* Auth Buttons */}
              <div className="px-4 py-2 space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    navigate({ to: '/login' })
                  }}
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  className="w-full justify-start gap-3"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    navigate({ to: '/login' })
                  }}
                >
                  <UserPlus className="w-4 h-4" />
                  Get Free Account
                </Button>
              </div>
            </div>
          )}
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
