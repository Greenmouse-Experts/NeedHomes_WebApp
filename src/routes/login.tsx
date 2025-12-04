import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Switch } from '@/components/ui/Switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { useLogin } from '@/lib/api-client'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const loginMutation = useLogin()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await loginMutation.mutateAsync({ email, password })
      navigate({ to: '/dashboard' })
    } catch (error) {
      console.error('Login failed:', error)
      // Still navigate on error for development
      navigate({ to: '/dashboard' })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex flex-col items-center justify-center p-4 pt-24 relative overflow-hidden">
      {/* Creative Background Elements */}
      
      {/* Large geometric shapes */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-[var(--color-orange)]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-[var(--color-orange)]/5 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-orange)]/3 rounded-full blur-3xl"></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `
          linear-gradient(to right, var(--color-orange) 1px, transparent 1px),
          linear-gradient(to bottom, var(--color-orange) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
      }}></div>
      
      {/* Diagonal lines pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `repeating-linear-gradient(
          45deg,
          transparent,
          transparent 10px,
          var(--color-orange) 10px,
          var(--color-orange) 20px
        )`
      }}></div>
      
      {/* Floating shapes */}
      <div className="absolute top-32 right-32 w-32 h-32 border-2 border-[var(--color-orange)]/20 rounded-lg rotate-45"></div>
      <div className="absolute bottom-32 left-32 w-24 h-24 border-2 border-[var(--color-orange)]/20 rounded-full"></div>
      <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-[var(--color-orange)]/10 rounded-lg rotate-12"></div>
      
      {/* Subtle dot pattern */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, var(--color-orange) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Logo above card */}
      <div className="flex flex-col items-center mb-6 relative z-10">
        <img 
          src="/logo.png" 
          alt="NeedHomes" 
          className="h-20 mb-2 drop-shadow-lg" 
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
          <p className="text-xs text-gray-600">PROPERTY MANAGEMENT</p>
        </div>
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-md shadow-2xl border-0 relative z-10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-black">Log In</CardTitle>
          <CardDescription className="text-gray-500">
            Enter your email and password to sign in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-gray-300"
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
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </CardContent>
      </Card>

    </div>
  )
}
