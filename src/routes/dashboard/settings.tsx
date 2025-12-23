import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  User,
  Lock,
  Settings as SettingsIcon,
  Headphones,
  Camera,
  Flag,
} from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Label } from '@/components/ui/Label'
import { Select } from '@/components/ui/Select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'

export const Route = createFileRoute('/dashboard/settings')({
  component: SettingsPage,
})

type SettingsTab = 'personal' | 'profile' | 'password' | 'account' | 'support'

function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('personal')
  const countries = [
    { value: '', label: 'Select your country' },
    { value: 'nigeria', label: 'Nigeria' },
    { value: 'ghana', label: 'Ghana' },
    { value: 'kenya', label: 'Kenya' },
    { value: 'south-africa', label: 'South Africa' },
    { value: 'united-states', label: 'United States' },
    { value: 'united-kingdom', label: 'United Kingdom' },
    { value: 'canada', label: 'Canada' },
    { value: 'australia', label: 'Australia' },
  ]

  const [formData, setFormData] = useState({
    fullName: 'Super Admin',
    email: 'testmail@gmail.com',
    phoneNumber: '0700 000 0000',
    country: '',
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle password change
    console.log('Password changed')
  }

  const tabs = [
    { id: 'personal' as SettingsTab, label: 'Personal', icon: User },
    { id: 'profile' as SettingsTab, label: 'Profile', icon: User },
    { id: 'password' as SettingsTab, label: 'Password', icon: Lock },
    { id: 'account' as SettingsTab, label: 'Account Settings', icon: SettingsIcon },
    { id: 'support' as SettingsTab, label: 'Support', icon: Headphones },
  ]

  return (
    <DashboardLayout title="Super Admin Dashboard" subtitle="Settings">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-[var(--color-orange)] text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            {/* Personal Settings */}
            {activeTab === 'personal' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex items-start gap-6 pb-6 border-b border-gray-200">
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 rounded-full ring-4 ring-gray-100 overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=faces" 
                          alt="Profile"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex-1 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="gap-2"
                        onClick={() => {
                          // Handle image upload
                          const input = document.createElement('input')
                          input.type = 'file'
                          input.accept = 'image/*'
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0]
                            if (file) {
                              // Handle file upload logic here
                              console.log('File selected:', file)
                            }
                          }
                          input.click()
                        }}
                      >
                        <Camera className="w-4 h-4" />
                        Change Picture
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">
                        JPG, PNG or GIF. Max size 2MB
                      </p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-sm font-semibold text-gray-700">
                        Full Name
                      </Label>
                      <Input
                        id="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber" className="text-sm font-semibold text-gray-700">
                        Phone Number
                      </Label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2 z-10 pointer-events-none">
                          <Flag className="w-5 h-5 text-[var(--color-orange)]" />
                          <span className="text-sm font-medium text-gray-700">+234</span>
                        </div>
                        <Input
                          id="phoneNumber"
                          type="tel"
                          value={formData.phoneNumber}
                          onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                          className="pl-24"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country" className="text-sm font-semibold text-gray-700">
                        Country
                      </Label>
                      <Select
                        id="country"
                        options={countries}
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Update Button */}
                  <div className="pt-4 border-t border-gray-200">
                    <Button
                      type="submit"
                      variant="primary"
                      className="w-full md:w-auto px-8 h-12 text-base font-semibold"
                    >
                      Update
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h2>
                <p className="text-gray-600 mb-6">Manage your profile information and preferences.</p>
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <p className="text-gray-500">Profile settings coming soon...</p>
                </div>
              </div>
            )}

            {/* Password Settings */}
            {activeTab === 'password' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Change Password</h2>
                
                <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-2xl">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-sm font-semibold text-gray-700">
                      Current Password
                    </Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                      placeholder="Enter your current password"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-sm font-semibold text-gray-700">
                      New Password
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      placeholder="Enter your new password"
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Must be at least 8 characters long
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      placeholder="Confirm your new password"
                      required
                    />
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <Button
                      type="submit"
                      variant="primary"
                      className="w-full md:w-auto px-8 h-12 text-base font-semibold"
                      disabled={
                        !passwordData.currentPassword ||
                        !passwordData.newPassword ||
                        passwordData.newPassword !== passwordData.confirmPassword
                      }
                    >
                      Change Password
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Account Settings */}
            {activeTab === 'account' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
                <p className="text-gray-600 mb-6">Manage your account preferences and security settings.</p>
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <p className="text-gray-500">Account settings coming soon...</p>
                </div>
              </div>
            )}

            {/* Support */}
            {activeTab === 'support' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Support</h2>
                <p className="text-gray-600 mb-6">Get help and contact support.</p>
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <p className="text-gray-500">Support section coming soon...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
