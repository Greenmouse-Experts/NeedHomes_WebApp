import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef } from 'react'
import {
  User,
  Lock,
  FileText,
  Headphones,
  Upload,
} from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Label } from '@/components/ui/Label'
import { Select } from '@/components/ui/Select'
import { Avatar, AvatarFallback } from '@/components/ui/Avatar'

export const Route = createFileRoute('/dashboard/settings')({
  component: SettingsPage,
})

type SettingsTab = 'profile' | 'password' | 'kyc' | 'support'
type ProfileSubTab = 'personal-info' | 'kyc'
type KycSubTab = 'personal-info' | 'kyc'

function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')
  const [profileSubTab, setProfileSubTab] = useState<ProfileSubTab>('personal-info')
  const [kycSubTab, setKycSubTab] = useState<KycSubTab>('personal-info')
  
  const frontUploadRef = useRef<HTMLInputElement>(null)
  const backUploadRef = useRef<HTMLInputElement>(null)
  const utilityBillUploadRef = useRef<HTMLInputElement>(null)
  
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  })

  const [profileData, setProfileData] = useState({
    fullName: 'Super Admin',
    email: 'testmail@gmail.com',
    phoneNumber: '0700 000 0000',
    alternatePhone: '0700 000 0000',
    howDidYouHear: '0700 000 0000',
    country: '',
  })

  const [kycData, setKycData] = useState({
    idType: 'national-id',
    address: 'Zone 4, 1 ladi Kwali St, Wuse, Abuja 900001, Federal Capital Territory, Nigeria',
    frontUpload: null as File | null,
    backUpload: null as File | null,
    utilityBill: null as File | null,
  })

  const idTypeOptions = [
    { value: 'national-id', label: 'National ID' },
    { value: 'drivers-license', label: "Driver's License" },
    { value: 'passport', label: 'International Passport' },
  ]

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }))
  }

  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (field: 'frontUpload' | 'backUpload' | 'utilityBill', file: File | null) => {
    setKycData(prev => ({ ...prev, [field]: file }))
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    console.log('Password update:', passwordData)
  }

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Profile update:', profileData)
  }

  const handleKycSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('KYC update:', kycData)
  }

  const tabs = [
    { id: 'profile' as SettingsTab, label: 'Profile', icon: User },
    { id: 'password' as SettingsTab, label: 'Password', icon: Lock },
    { id: 'kyc' as SettingsTab, label: 'KYC', icon: FileText },
    { id: 'support' as SettingsTab, label: 'Support', icon: Headphones },
  ]

  const renderKycForm = () => (
    <form onSubmit={handleKycSubmit} className="max-w-3xl">
      {/* ID Type */}
      <div className="space-y-2 mb-6">
        <Label htmlFor="idType">ID Type</Label>
        <Select
          id="idType"
          options={idTypeOptions}
          value={kycData.idType}
          onChange={(e) => setKycData(prev => ({ ...prev, idType: e.target.value }))}
          className="bg-gray-50"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Upload Front */}
        <div className="space-y-2">
          <Label>Upload Front</Label>
          <div 
            onClick={() => frontUploadRef.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer hover:border-gray-300 transition-colors"
          >
            {kycData.frontUpload ? (
              <p className="text-orange-500 text-sm font-medium">
                View File Upload
              </p>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-8 h-8 text-gray-400" />
                <p className="text-gray-500 text-sm">Click to upload</p>
              </div>
            )}
          </div>
          <input
            ref={frontUploadRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={(e) => handleFileUpload('frontUpload', e.target.files?.[0] || null)}
          />
        </div>

        {/* Upload Back */}
        <div className="space-y-2">
          <Label>Upload Back</Label>
          <div 
            onClick={() => backUploadRef.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer hover:border-gray-300 transition-colors"
          >
            {kycData.backUpload ? (
              <p className="text-orange-500 text-sm font-medium">
                View File Upload
              </p>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-8 h-8 text-gray-400" />
                <p className="text-gray-500 text-sm">Click to upload</p>
              </div>
            )}
          </div>
          <input
            ref={backUploadRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={(e) => handleFileUpload('backUpload', e.target.files?.[0] || null)}
          />
        </div>
      </div>

      {/* Utility Bill */}
      <div className="space-y-2 mb-6">
        <Label>Utility Bill (Proof of Address)</Label>
        <div 
          onClick={() => utilityBillUploadRef.current?.click()}
          className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer hover:border-gray-300 transition-colors"
        >
          {kycData.utilityBill ? (
            <p className="text-orange-500 text-sm font-medium">
              View File Upload
            </p>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-gray-400" />
              <p className="text-gray-500 text-sm">Click to upload</p>
            </div>
          )}
        </div>
        <input
          ref={utilityBillUploadRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={(e) => handleFileUpload('utilityBill', e.target.files?.[0] || null)}
        />
      </div>

      {/* Address */}
      <div className="space-y-2 mb-6">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={kycData.address}
          onChange={(e) => setKycData(prev => ({ ...prev, address: e.target.value }))}
          className="bg-gray-50"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-4 pt-6">
        <Button 
          type="button" 
          variant="outline" 
          size="lg"
          className="px-12"
        >
          Back
        </Button>
        <Button 
          type="submit" 
          variant="primary" 
          size="lg"
          className="px-12"
        >
          Approve
        </Button>
      </div>
    </form>
  )

  const renderPersonalInfoForm = () => (
    <form onSubmit={handleProfileSubmit} className="max-w-3xl">
      {/* Profile Picture */}
      <div className="mb-6">
        <Label className="mb-2">Profile Picture</Label>
        <div className="flex items-center gap-4 mt-2">
          <Avatar className="w-24 h-24 bg-gray-100">
            <AvatarFallback className="text-2xl text-gray-400">S</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            value={profileData.fullName}
            onChange={(e) => handleProfileChange('fullName', e.target.value)}
            className="bg-gray-50"
          />
        </div>

        {/* Email Address */}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={profileData.email}
            onChange={(e) => handleProfileChange('email', e.target.value)}
            className="bg-gray-50"
          />
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            value={profileData.phoneNumber}
            onChange={(e) => handleProfileChange('phoneNumber', e.target.value)}
            className="bg-gray-50"
          />
        </div>

        {/* Alternate Phone Number */}
        <div className="space-y-2">
          <Label htmlFor="alternatePhone">Alternate Phone Number</Label>
          <Input
            id="alternatePhone"
            value={profileData.alternatePhone}
            onChange={(e) => handleProfileChange('alternatePhone', e.target.value)}
            className="bg-gray-50"
          />
        </div>
      </div>

      {/* How did you hear about us */}
      <div className="space-y-2 mt-6">
        <Label htmlFor="howDidYouHear">How did you hear about us?</Label>
        <Input
          id="howDidYouHear"
          value={profileData.howDidYouHear}
          onChange={(e) => handleProfileChange('howDidYouHear', e.target.value)}
          className="bg-gray-50"
        />
      </div>

      {/* Update Button */}
      <div className="pt-6">
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
  )

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
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4">View Details</h3>
                  
                  {/* Sub-tabs */}
                  <div className="flex border-b border-gray-200 mb-6">
                    <button
                      onClick={() => setProfileSubTab('personal-info')}
                      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                        profileSubTab === 'personal-info'
                          ? 'border-orange-500 text-orange-500'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Personal Info
                    </button>
                    <button
                      onClick={() => setProfileSubTab('kyc')}
                      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                        profileSubTab === 'kyc'
                          ? 'border-orange-500 text-orange-500'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      KYC
                    </button>
                  </div>
                </div>

                {/* Personal Info Content */}
                {profileSubTab === 'personal-info' && renderPersonalInfoForm()}

                {/* KYC Sub-tab Content */}
                {profileSubTab === 'kyc' && renderKycForm()}
              </div>
            )}

            {/* Password Tab */}
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

            {/* KYC Tab (direct from sidebar) */}
            {activeTab === 'kyc' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4">View Details</h3>
                  
                  {/* Sub-tabs */}
                  <div className="flex border-b border-gray-200 mb-6">
                    <button
                      onClick={() => setKycSubTab('personal-info')}
                      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                        kycSubTab === 'personal-info'
                          ? 'border-orange-500 text-orange-500'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Personal Info
                    </button>
                    <button
                      onClick={() => setKycSubTab('kyc')}
                      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                        kycSubTab === 'kyc'
                          ? 'border-orange-500 text-orange-500'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      KYC
                    </button>
                  </div>
                </div>

                {/* Personal Info Content */}
                {kycSubTab === 'personal-info' && renderPersonalInfoForm()}

                {/* KYC Content */}
                {kycSubTab === 'kyc' && renderKycForm()}
              </div>
            )}

            {/* Support Tab */}
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
