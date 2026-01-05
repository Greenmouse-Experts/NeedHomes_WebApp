import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Switch } from '@/components/ui/Switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

export const Route = createFileRoute('/admin')({
  component: AdminLoginPage,
})

// Demo admin credentials
const DEMO_ADMIN = {
  email: 'admin@needhomes.com',
  password: 'admin123'
}

function AdminLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Check demo credentials
    if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
      // Store admin session
      localStorage.setItem('adminAuth', 'true')
      navigate({ to: '/dashboard' })
    } else {
      setError('Invalid admin credentials. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center p-4 pt-24 relative overflow-hidden">
      {/* Creative Background Elements - Dark theme */}
      
      {/* Large geometric shapes */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-[var(--color-orange)]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-[var(--color-orange)]/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-orange)]/5 rounded-full blur-3xl"></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.05]" style={{
        backgroundImage: `
          linear-gradient(to right, var(--color-orange) 1px, transparent 1px),
          linear-gradient(to bottom, var(--color-orange) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
      }}></div>
      
      {/* Diagonal lines pattern */}
      <div className="absolute inset-0 opacity-[0.05]" style={{
        backgroundImage: `repeating-linear-gradient(
          45deg,
          transparent,
          transparent 10px,
          var(--color-orange) 10px,
          var(--color-orange) 20px
        )`
      }}></div>
      
      {/* Floating shapes */}
      <div className="absolute top-32 right-32 w-32 h-32 border-2 border-[var(--color-orange)]/30 rounded-lg rotate-45"></div>
      <div className="absolute bottom-32 left-32 w-24 h-24 border-2 border-[var(--color-orange)]/30 rounded-full"></div>
      <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-[var(--color-orange)]/20 rounded-lg rotate-12"></div>
      
      {/* Subtle dot pattern */}
      <div className="absolute inset-0 opacity-[0.08]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, var(--color-orange) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Admin Login Card */}
      <Card className="w-full max-w-md bg-gray-100 shadow-2xl border-0 relative z-10">
        <CardHeader className="space-y-4 pb-4">
          {/* Logo inside card */}
          <div className="flex flex-col items-center">
            <img 
              src="/logo.png" 
              alt="NeedHomes Admin" 
              className="h-20 mb-2 drop-shadow-md" 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }} 
            />
            <div className="hidden flex-col items-center">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 border-2 border-[var(--color-orange)] rounded-t-lg"></div>
                <h1 className="text-xl font-bold text-gray-900">NEEDHOMES</h1>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 bg-[var(--color-orange)] rounded flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
              </svg>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Admin Login</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Demo Credentials Info */}
          <div className="mb-4 p-3 bg-[var(--color-orange)]/10 border border-[var(--color-orange)]/30 rounded-lg">
            <p className="text-xs font-semibold text-[var(--color-orange)] mb-1">Demo Credentials:</p>
            <p className="text-xs text-gray-700">Email: admin@needhomes.com</p>
            <p className="text-xs text-gray-700">Password: admin123</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@needhomes.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-gray-300 bg-white text-gray-900"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-gray-300 bg-white text-gray-900"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="remember"
                checked={rememberMe}
                onCheckedChange={setRememberMe}
              />
              <Label htmlFor="remember" className="text-gray-600 cursor-pointer">
                Remember me
              </Label>
            </div>
            <Button
              type="submit"
              className="w-full bg-[var(--color-orange)] hover:bg-[var(--color-orange-dark)] text-white cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Admin Sign in'}
            </Button>
          </form>

          {/* Link to user login */}
          <div className="mt-4 text-center">
            <a href="/login" className="text-sm text-gray-600 hover:text-[var(--color-orange)] transition-colors">
              Not an admin? Go to user login
            </a>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
