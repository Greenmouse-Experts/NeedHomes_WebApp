import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Eye, EyeOff } from 'lucide-react'

export const Route = createFileRoute('/signup')({
  component: SignUpPage,
})

type UserType = 'investor' | 'partner'

function SignUpPage() {
  const navigate = useNavigate()
  const [userType, setUserType] = useState<UserType>('investor')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    email: '',
    phoneNumber: '',
    gender: '',
    country: '',
    state: '',
    city: '',
    password: '',
    confirmPassword: '',
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    
    // Here you would typically make an API call
    console.log('Signing up:', { ...formData, userType })
    
    // Navigate to dashboard or login
    navigate({ to: '/login' })
  }

  const imageUrl = userType === 'investor' 
    ? '/assets/Rectangle 21299(2).png'
    : '/assets/Rectangle 21299(1).png'

  return (
    <div className="min-h-screen lg:h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={imageUrl}
            alt={userType === 'investor' ? 'Become an Investor' : 'Become a Partner Agent'} 
            className="w-full h-full object-cover opacity-80"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
        </div>
        
        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-end p-12 text-white w-full">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold leading-tight">
              {userType === 'investor' 
                ? 'Start Your Investment Journey Today'
                : 'Join Our Partner Network'}
            </h2>
            <p className="text-lg text-gray-300 max-w-md">
              {userType === 'investor'
                ? 'Create your account to access exclusive property investment opportunities and grow your portfolio.'
                : 'Partner with us to connect property seekers with their dream homes and earn competitive commissions.'}
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 bg-[#3A3A4A] overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-4 sm:p-6 md:p-8">
          <div className="w-full max-w-md space-y-4 sm:space-y-6 py-6 sm:py-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center mb-4">
            <Link to="/" className="inline-block">
              <img 
                src="/need_homes_logo.png" 
                alt="NeedHomes" 
                className="h-12 sm:h-16 mb-2"
              />
            </Link>
          </div>

          {/* Form Header */}
          <div className="text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Sign Up</h1>
            <p className="text-sm sm:text-base text-gray-300">Fill in your details</p>
          </div>

          {/* User Type Toggle */}
          <div className="flex gap-2 p-1 bg-white/10 rounded-xl">
            <button
              type="button"
              onClick={() => setUserType('investor')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                userType === 'investor'
                  ? 'bg-[var(--color-orange)] text-white shadow-lg'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Investor
            </button>
            <button
              type="button"
              onClick={() => setUserType('partner')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                userType === 'partner'
                  ? 'bg-[var(--color-orange)] text-white shadow-lg'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Partner Agent
            </button>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-white">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-white">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address" className="text-white">Address</Label>
              <Input
                id="address"
                type="text"
                placeholder="14 Lekki street, Gbangba, Lagos"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20"
              />
            </div>

            {/* Email and Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-white">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="+234 803 XXX XXXX"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20"
                />
              </div>
            </div>

            {/* Gender and Country */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-white">Gender</Label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  required
                  className="flex w-full rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur-sm px-4 py-3 text-base text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] focus:bg-white/20 transition-all duration-300"
                >
                  <option value="" className="bg-gray-800">Select Gender</option>
                  <option value="male" className="bg-gray-800">Male</option>
                  <option value="female" className="bg-gray-800">Female</option>
                  <option value="other" className="bg-gray-800">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="country" className="text-white">Country</Label>
                <select
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  required
                  className="flex w-full rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur-sm px-4 py-3 text-base text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] focus:bg-white/20 transition-all duration-300"
                >
                  <option value="" className="bg-gray-800">Select Country</option>
                  <option value="nigeria" className="bg-gray-800">Nigeria</option>
                  <option value="ghana" className="bg-gray-800">Ghana</option>
                  <option value="kenya" className="bg-gray-800">Kenya</option>
                  <option value="south-africa" className="bg-gray-800">South Africa</option>
                  <option value="other" className="bg-gray-800">Other</option>
                </select>
              </div>
            </div>

            {/* State and City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="state" className="text-white">State</Label>
                <Input
                  id="state"
                  type="text"
                  placeholder="Lagos"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city" className="text-white">City</Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="Ikeja"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20"
                />
              </div>
            </div>

            {/* Password Fields */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[var(--color-orange)] hover:bg-[var(--color-orange-dark)] text-white text-base sm:text-lg py-5 sm:py-6 mt-4 sm:mt-6"
            >
              Done
            </Button>
          </form>

          {/* Login Link */}
          <div className="text-center pt-2">
            <p className="text-gray-300">
              Already have an account?{' '}
              <Link to="/login" className="text-[var(--color-orange)] hover:text-[var(--color-orange-light)] font-semibold transition-colors">
                Log In
              </Link>
            </p>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

