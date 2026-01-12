import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  User,
  Lock,
  Settings as SettingsIcon,
  Headphones,
} from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Label } from '@/components/ui/Label'

export const Route = createFileRoute('/dashboard/settings')({
  component: SettingsPage,
})

type SettingsTab = 'profile' | 'password' | 'account' | 'support'

function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('password')
  
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  })

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }))
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    console.log('Password update:', passwordData)
  }

  const tabs = [
    { id: 'profile' as SettingsTab, label: 'Profile', icon: User },
    { id: 'password' as SettingsTab, label: 'Password', icon: Lock },
    { id: 'account' as SettingsTab, label: 'Account Settings', icon: SettingsIcon },
    { id: 'support' as SettingsTab, label: 'Support', icon: Headphones },
  ]

  return (
    <DashboardLayout title="Super Admin Dashboard" subtitle="">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 bg-gray-50 border-r border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-lg">Settings</h2>
            </div>
            <nav className="p-2">
              <div className="mb-2">
                <p className="text-xs font-semibold text-gray-500 uppercase px-3 py-2">Personal</p>
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                        activeTab === tab.id
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:bg-white/50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 md:p-8">
            {activeTab === 'password' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-1">CHANGE PASSWORD</h3>
                </div>

                <form onSubmit={handlePasswordSubmit} className="max-w-md space-y-6">
                  {/* New Password */}
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="SuperAdmin"
                      value={passwordData.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      required
                      className="bg-gray-50"
                    />
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="SuperAdmin"
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      required
                      className="bg-gray-50"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      variant="primary" 
                      size="lg"
                      className="px-12"
                    >
                      Update
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="text-center py-12 text-gray-500">
                <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Profile settings coming soon...</p>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="text-center py-12 text-gray-500">
                <SettingsIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Account settings coming soon...</p>
              </div>
            )}

            {activeTab === 'support' && (
              <div className="text-center py-12 text-gray-500">
                <Headphones className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Support page coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
