import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { ChevronLeft, Upload, Calendar, Plus } from 'lucide-react'

export const Route = createFileRoute('/dashboard/properties/new')({
  component: NewPropertyPage,
})

type Tab = 'basic' | 'media' | 'pricing' | 'specific'

function NewPropertyPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('basic')
  const [packageType, setPackageType] = useState('outright-purchase')

  // Form state
  const [formData, setFormData] = useState({
    propertyTitle: '',
    propertyType: '',
    state: '',
    lga: '',
    cityTown: '',
    developmentStage: '',
    description: '',
    deliveryDate: '',
    basePrice: '',
  })

  const [additionalFees, setAdditionalFees] = useState([
    { title: 'Legal Fee', price: '27,000,000' },
    { title: 'Development levy', price: '27,000,000' },
    { title: 'Survey fee', price: '27,000,000' },
    { title: 'Agent Fee', price: '27,000,000' },
    { title: 'Reservation Fee', price: '27,000,000' },
  ])

  const [showAddFeeModal, setShowAddFeeModal] = useState(false)
  const [newFee, setNewFee] = useState({ title: '', price: '' })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const tabs = [
    { id: 'basic' as Tab, label: 'Basic Property Information' },
    { id: 'media' as Tab, label: 'Media Uploads' },
    { id: 'pricing' as Tab, label: 'Pricing & Access' },
    { id: 'specific' as Tab, label: 'Specific Fields' },
  ]

  const handleNext = () => {
    const currentIndex = tabs.findIndex(t => t.id === activeTab)
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id)
    }
  }

  const handleBack = () => {
    navigate({ to: '/dashboard/properties/listed' })
  }

  return (
    <DashboardLayout title="Manage Properties" subtitle="">
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">New Property</span>
          </button>

          <select
            value={packageType}
            onChange={(e) => setPackageType(e.target.value)}
            className="px-4 py-2 bg-[var(--color-orange)] text-white rounded-lg font-medium text-sm"
          >
            <option value="outright-purchase">Outright Purchase</option>
            <option value="co-development">Co-Development</option>
            <option value="fractional-ownership">Fractional Ownership</option>
            <option value="land-banking">Land Banking</option>
            <option value="save-to-own">Save to Own</option>
          </select>
        </div>

        {/* Package Title */}
        <h2 className="text-xl font-semibold mb-6">
          {packageType === 'outright-purchase' && 'Outright Purchase'}
          {packageType === 'co-development' && 'Co-Development'}
          {packageType === 'fractional-ownership' && 'Fractional Ownership'}
          {packageType === 'land-banking' && 'Land Banking'}
          {packageType === 'save-to-own' && 'Save to Own'}
        </h2>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 px-4 whitespace-nowrap font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-[var(--color-orange)] text-[var(--color-orange)] bg-[var(--color-orange)]/10 rounded-t-lg'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Basic Property Information Tab */}
        {activeTab === 'basic' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Property Title */}
              <div className="space-y-2">
                <Label htmlFor="propertyTitle">Property Title</Label>
                <Input
                  id="propertyTitle"
                  type="text"
                  placeholder="Enter name of the property"
                  value={formData.propertyTitle}
                  onChange={(e) => handleInputChange('propertyTitle', e.target.value)}
                />
              </div>

              {/* Property Type */}
              <div className="space-y-2">
                <Label htmlFor="propertyType">Property Type</Label>
                <select
                  id="propertyType"
                  value={formData.propertyType}
                  onChange={(e) => handleInputChange('propertyType', e.target.value)}
                  className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                >
                  <option value="">select</option>
                  <option value="detached">Detached</option>
                  <option value="semi-detached">Semi-Detached</option>
                  <option value="terrace">Terrace</option>
                  <option value="apartment">Apartment</option>
                </select>
              </div>

              {/* State */}
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <select
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                >
                  <option value="">Enter your State</option>
                  <option value="lagos">Lagos</option>
                  <option value="ogun">Ogun</option>
                  <option value="abuja">Abuja</option>
                </select>
              </div>

              {/* LGA */}
              {/* <div className="space-y-2">
                <Label htmlFor="lga">LGA</Label>
                <select
                  id="lga"
                  value={formData.lga}
                  onChange={(e) => handleInputChange('lga', e.target.value)}
                  className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                >
                  <option value="">Enter your LGA</option>
                  <option value="ikeja">Ikeja</option>
                  <option value="lekki">Lekki</option>
                  <option value="ikorodu">Ikorodu</option>
                </select>
              </div> */}

              {/* City/Town */}
              <div className="space-y-2">
                <Label htmlFor="cityTown">City/Town</Label>
                <select
                  id="cityTown"
                  value={formData.cityTown}
                  onChange={(e) => handleInputChange('cityTown', e.target.value)}
                  className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                >
                  <option value="">Enter your City/Town</option>
                  <option value="lagos-island">Lagos Island</option>
                  <option value="victoria-island">Victoria Island</option>
                  <option value="ajah">Ajah</option>
                </select>
              </div>

              {/* Development Stage */}
              <div className="space-y-2">
                <Label htmlFor="developmentStage">Development Stage</Label>
                <select
                  id="developmentStage"
                  value={formData.developmentStage}
                  onChange={(e) => handleInputChange('developmentStage', e.target.value)}
                  className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                >
                  <option value="">Select</option>
                  <option value="planning">Planning</option>
                  <option value="construction">Under Construction</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Description - Full Width */}
            <div className="mt-6 space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                rows={4}
                placeholder="Write"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300 resize-none"
              />
            </div>

            {/* Delivery/Completion Date */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="deliveryDate">Delivery/Completion Date</Label>
                <div className="relative">
                  <Input
                    id="deliveryDate"
                    type="date"
                    placeholder="06/01/2026"
                    value={formData.deliveryDate}
                    onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Next Button */}
            <div className="mt-8 flex justify-end">
              <Button
                onClick={handleNext}
                className="bg-[var(--color-orange)] hover:bg-[var(--color-orange-dark)] text-white px-8"
              >
                Next →
              </Button>
            </div>
          </div>
        )}

        {/* Media Uploads Tab */}
        {activeTab === 'media' && (
          <div>
            {/* Cover Image */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Cover Image</h3>
                <Button size="sm" className="bg-[var(--color-orange)] hover:bg-[var(--color-orange-dark)] text-white">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50">
                <p className="text-center text-gray-500">Upload cover image</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Gallery Images */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Gallery Images</h3>
                  <Button size="sm" className="bg-[var(--color-orange)] hover:bg-[var(--color-orange-dark)] text-white">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50">
                  <p className="text-center text-gray-500">Upload gallery images</p>
                </div>
              </div>

              {/* Videos */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Videos</h3>
                  <Button size="sm" className="bg-[var(--color-orange)] hover:bg-[var(--color-orange-dark)] text-white">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50">
                  <p className="text-center text-gray-500">Upload videos</p>
                </div>
              </div>
            </div>

            {/* Document Uploads */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Document Uploads</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded flex items-center justify-center">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="font-medium">Certificate of Ownership</span>
                  </div>
                  <Button size="sm" className="bg-[var(--color-orange)] hover:bg-[var(--color-orange-dark)] text-white">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded flex items-center justify-center">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="font-medium">Brochures</span>
                  </div>
                  <Button size="sm" className="bg-[var(--color-orange)] hover:bg-[var(--color-orange-dark)] text-white">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </div>
            </div>

            {/* Next Button */}
            <div className="mt-8 flex justify-end">
              <Button
                onClick={handleNext}
                className="bg-[var(--color-orange)] hover:bg-[var(--color-orange-dark)] text-white px-8"
              >
                Next →
              </Button>
            </div>
          </div>
        )}

        {/* Pricing & Access Tab */}
        {activeTab === 'pricing' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-8">
                {/* Base Price */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Base Price</h3>
                  <Input
                    type="text"
                    placeholder="Enter base price"
                    value={formData.basePrice}
                    onChange={(e) => handleInputChange('basePrice', e.target.value)}
                  />
                </div>

                {/* Access Rules */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Access Rules</h3>
                  <h4 className="font-medium mb-3">Document Board Threshold</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Certificate of Ownership</span>
                      <Button size="sm" className="bg-[var(--color-orange)] hover:bg-[var(--color-orange-dark)] text-white text-xs">
                        <Upload className="w-3 h-3 mr-1" />
                        Upload
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Survey Plan</span>
                      <Button size="sm" className="bg-[var(--color-orange)] hover:bg-[var(--color-orange-dark)] text-white text-xs">
                        <Upload className="w-3 h-3 mr-1" />
                        Upload
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Transfer of Ownership</span>
                      <Button size="sm" className="bg-[var(--color-orange)] hover:bg-[var(--color-orange-dark)] text-white text-xs">
                        <Upload className="w-3 h-3 mr-1" />
                        Upload
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Additional Fees */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Additional Fees</h3>
                  <Button 
                    size="sm" 
                    onClick={() => setShowAddFeeModal(true)}
                    className="bg-[var(--color-orange)] hover:bg-[var(--color-orange-dark)] text-white"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Fee
                  </Button>
                </div>
                <div className="space-y-3">
                  {additionalFees.map((fee, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">{fee.title}</span>
                      <span className="font-semibold">₦{fee.price}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg border-t-2 border-gray-300 mt-4">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-lg">
                      ₦{additionalFees.reduce((sum, fee) => sum + parseFloat(fee.price.replace(/,/g, '')), 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Button */}
            <div className="mt-8 flex justify-end">
              <Button
                onClick={handleNext}
                className="bg-[var(--color-orange)] hover:bg-[var(--color-orange-dark)] text-white px-8"
              >
                Next →
              </Button>
            </div>
          </div>
        )}

        {/* Specific Fields Tab */}
        {activeTab === 'specific' && (
          <div>
            {/* Outright Purchase Fields */}
            {packageType === 'outright-purchase' && (
              <div>
                <p className="text-sm text-gray-600 mb-6">
                  Fields for projects where investors contribute to construction and share profits.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Total Selling Price */}
                  <div className="space-y-2">
                    <Label htmlFor="totalSellingPrice">Total Selling Price*</Label>
                    <Input id="totalSellingPrice" placeholder="Total Price" />
                  </div>

                  {/* Available Units */}
                  <div className="space-y-2">
                    <Label htmlFor="availableUnits">Available Units*</Label>
                    <select
                      id="availableUnits"
                      className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                    >
                      <option value="">select</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="5">5</option>
                      <option value="10">10</option>
                    </select>
                  </div>

                  {/* Unit Types */}
                  <div className="space-y-2">
                    <Label htmlFor="unitTypes">Unit Types*</Label>
                    <select
                      id="unitTypes"
                      className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                    >
                      <option value="">Select</option>
                      <option value="studio">Studio</option>
                      <option value="1br">1 Bedroom</option>
                      <option value="2br">2 Bedroom</option>
                      <option value="3br">3 Bedroom</option>
                    </select>
                  </div>

                  {/* Payment Options */}
                  <div className="space-y-2">
                    <Label htmlFor="paymentOptions">Payment Options</Label>
                    <select
                      id="paymentOptions"
                      className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                    >
                      <option value="">select</option>
                      <option value="full">Full Payment</option>
                      <option value="installment">Installment</option>
                      <option value="mortgage">Mortgage</option>
                    </select>
                  </div>

                  {/* Installment Plan */}
                  <div className="space-y-2">
                    <Label htmlFor="installmentPlan">Installment Plan</Label>
                    <select
                      id="installmentPlan"
                      className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                    >
                      <option value="">Enter your City/Town</option>
                      <option value="3-months">3 Months</option>
                      <option value="6-months">6 Months</option>
                      <option value="12-months">12 Months</option>
                    </select>
                  </div>

                  {/* Ownership Transfer Rules */}
                  <div className="space-y-2">
                    <Label htmlFor="ownershipTransferRules">Ownership Transfer Rules</Label>
                    <Input id="ownershipTransferRules" placeholder="" />
                  </div>

                  {/* Certificate Template */}
                  <div className="space-y-2">
                    <Label htmlFor="certificateTemplate">Certificate Template</Label>
                    <select
                      id="certificateTemplate"
                      className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                    >
                      <option value="">Select</option>
                      <option value="standard">Standard</option>
                      <option value="premium">Premium</option>
                    </select>
                  </div>
                </div>

                {/* Optional Fields Section */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Optional Fields</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Discount Options */}
                    <div className="space-y-2">
                      <Label htmlFor="discountOptions">Discount Options</Label>
                      <select
                        id="discountOptions"
                        className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                      >
                        <option value="">Promo</option>
                        <option value="early-bird">Early Bird</option>
                        <option value="bulk">Bulk Purchase</option>
                        <option value="seasonal">Seasonal</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Co-Development Fields */}
            {packageType === 'co-development' && (
              <div>
                <p className="text-sm text-gray-600 mb-6">
                  Fields for projects where investors contribute to construction and share profits.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Total Project Cost */}
                  <div className="space-y-2">
                    <Label htmlFor="totalProjectCost">Total Project Cost</Label>
                    <Input id="totalProjectCost" placeholder="Total Price" />
                  </div>

                  {/* Minimum Investment Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="minimumInvestment">Minimum Investment Amount</Label>
                    <select
                      id="minimumInvestment"
                      className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                    >
                      <option value="">select</option>
                      <option value="1m">₦1,000,000</option>
                      <option value="5m">₦5,000,000</option>
                      <option value="10m">₦10,000,000</option>
                    </select>
                  </div>

                  {/* Milestone Structure */}
                  <div className="space-y-2">
                    <Label htmlFor="milestoneStructure">Milestone Structure</Label>
                    <select
                      id="milestoneStructure"
                      className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                    >
                      <option value="">Select</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="monthly">Monthly</option>
                      <option value="phase-based">Phase Based</option>
                    </select>
                  </div>

                  {/* Milestone % Breakdown */}
                  <div className="space-y-2">
                    <Label htmlFor="milestoneBreakdown">Milestone % Breakdown</Label>
                    <select
                      id="milestoneBreakdown"
                      className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                    >
                      <option value="">select</option>
                      <option value="25-50-25">25-50-25</option>
                      <option value="30-40-30">30-40-30</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>

                  {/* Expected ROI */}
                  <div className="space-y-2">
                    <Label htmlFor="expectedRoi">Expected ROI (%)</Label>
                    <select
                      id="expectedRoi"
                      className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                    >
                      <option value="">Enter your City/Town</option>
                      <option value="10">10%</option>
                      <option value="15">15%</option>
                      <option value="20">20%</option>
                    </select>
                  </div>

                  {/* Project Duration */}
                  <div className="space-y-2">
                    <Label htmlFor="projectDuration">Project Duration</Label>
                    <Input id="projectDuration" placeholder="" />
                  </div>

                  {/* Profit Sharing Formula */}
                  <div className="space-y-2">
                    <Label htmlFor="profitSharingFormula">Profit Sharing Formula</Label>
                    <select
                      id="profitSharingFormula"
                      className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                    >
                      <option value="">Select</option>
                      <option value="proportional">Proportional</option>
                      <option value="fixed">Fixed</option>
                      <option value="tiered">Tiered</option>
                    </select>
                  </div>

                  {/* Document Board Access Level */}
                  <div className="space-y-2">
                    <Label htmlFor="documentBoardAccess">Document Board Access Level</Label>
                    <select
                      id="documentBoardAccess"
                      className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                    >
                      <option value="">Promo</option>
                      <option value="basic">Basic</option>
                      <option value="standard">Standard</option>
                      <option value="premium">Premium</option>
                    </select>
                  </div>

                  {/* Exit Method */}
                  <div className="space-y-2">
                    <Label htmlFor="exitMethod">Exit Method</Label>
                    <Input id="exitMethod" placeholder="Enter your City/Town" />
                  </div>
                </div>

                {/* Optional Fields Section */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Optional Fields</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Monitoring Officer */}
                    <div className="space-y-2">
                      <Label htmlFor="monitoringOfficer">Monitoring Officer</Label>
                      <select
                        id="monitoringOfficer"
                        className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                      >
                        <option value="">Select</option>
                        <option value="officer1">Officer 1</option>
                        <option value="officer2">Officer 2</option>
                      </select>
                    </div>

                    {/* Construction Partner Details */}
                    <div className="space-y-2">
                      <Label htmlFor="constructionPartner">Construction Partner Details</Label>
                      <select
                        id="constructionPartner"
                        className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                      >
                        <option value="">Promo</option>
                        <option value="partner1">Partner 1</option>
                        <option value="partner2">Partner 2</option>
                      </select>
                    </div>

                    {/* Risk Factors / Disclosures */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="riskFactors">Risk Factors / Disclosures</Label>
                      <select
                        id="riskFactors"
                        className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                      >
                        <option value="">Select</option>
                        <option value="low">Low Risk</option>
                        <option value="medium">Medium Risk</option>
                        <option value="high">High Risk</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Fractional Ownership Fields */}
            {packageType === 'fractional-ownership' && (
              <div>
                <p className="text-sm text-gray-600 mb-6">
                  Fields for properties divided into investment shares.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Property Valuation */}
                  <div className="space-y-2">
                    <Label htmlFor="propertyValuation">Property Valuation</Label>
                    <Input id="propertyValuation" placeholder="Total Price" />
                  </div>

                  {/* Total Available Shares */}
                  <div className="space-y-2">
                    <Label htmlFor="totalShares">Total Available Shares</Label>
                    <select
                      id="totalShares"
                      className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                    >
                      <option value="">select</option>
                      <option value="100">100</option>
                      <option value="500">500</option>
                      <option value="1000">1000</option>
                    </select>
                  </div>

                  {/* Price per Share */}
                  <div className="space-y-2">
                    <Label htmlFor="pricePerShare">Price per Share</Label>
                    <select
                      id="pricePerShare"
                      className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                    >
                      <option value="">Select</option>
                      <option value="100k">₦100,000</option>
                      <option value="500k">₦500,000</option>
                      <option value="1m">₦1,000,000</option>
                    </select>
                  </div>

                  {/* Minimum Purchase Quantity */}
                  <div className="space-y-2">
                    <Label htmlFor="minPurchaseQty">Minimum Purchase Quantity</Label>
                    <select
                      id="minPurchaseQty"
                      className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                    >
                      <option value="">select</option>
                      <option value="1">1</option>
                      <option value="5">5</option>
                      <option value="10">10</option>
                    </select>
                  </div>

                  {/* Expected Rental Yield */}
                  <div className="space-y-2">
                    <Label htmlFor="rentalYield">Expected Rental Yield (%)</Label>
                    <select
                      id="rentalYield"
                      className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                    >
                      <option value="">Enter your City/Town</option>
                      <option value="5">5%</option>
                      <option value="7">7%</option>
                      <option value="10">10%</option>
                    </select>
                  </div>

                  {/* ROI Distribution Cycle */}
                  <div className="space-y-2">
                    <Label htmlFor="roiCycle">ROI Distribution Cycle</Label>
                    <Input id="roiCycle" placeholder="" />
                  </div>

                  {/* Exit Window */}
                  <div className="space-y-2">
                    <Label htmlFor="exitWindow">Exit Window</Label>
                    <select
                      id="exitWindow"
                      className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                    >
                      <option value="">Select</option>
                      <option value="6-months">6 Months</option>
                      <option value="1-year">1 Year</option>
                      <option value="2-years">2 Years</option>
                    </select>
                  </div>

                  {/* Share Certificate Template */}
                  <div className="space-y-2">
                    <Label htmlFor="shareCertificate">Share Certificate Template</Label>
                    <select
                      id="shareCertificate"
                      className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                    >
                      <option value="">Promo</option>
                      <option value="standard">Standard</option>
                      <option value="premium">Premium</option>
                    </select>
                  </div>
                </div>

                {/* Optional Fields Section */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Optional Fields</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Secondary Marketplace Rules */}
                    <div className="space-y-2">
                      <Label htmlFor="marketplaceRules">Secondary Marketplace Rules</Label>
                      <select
                        id="marketplaceRules"
                        className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                      >
                        <option value="">select</option>
                        <option value="open">Open Trading</option>
                        <option value="restricted">Restricted</option>
                      </select>
                    </div>

                    {/* Minimum Holding Period */}
                    <div className="space-y-2">
                      <Label htmlFor="holdingPeriod">Minimum Holding Period</Label>
                      <select
                        id="holdingPeriod"
                        className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                      >
                        <option value="">Promo</option>
                        <option value="3-months">3 Months</option>
                        <option value="6-months">6 Months</option>
                        <option value="1-year">1 Year</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Land Banking Fields */}
            {packageType === 'land-banking' && (
              <div>
                <p className="text-sm text-gray-600 mb-6">
                  Fields for purchasing undeveloped land expected to appreciate.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Total Land Size */}
                  <div className="space-y-2">
                    <Label htmlFor="landSize">Total Land Size (sqm)</Label>
                    <Input id="landSize" placeholder="Total Price" />
                  </div>

                  {/* Plot Size Options */}
                  <div className="space-y-2">
                    <Label htmlFor="plotSize">Plot Size Options</Label>
                    <select
                      id="plotSize"
                      className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                    >
                      <option value="">select</option>
                      <option value="300">300 sqm</option>
                      <option value="500">500 sqm</option>
                      <option value="1000">1000 sqm</option>
                    </select>
                  </div>

                  {/* Price per sqm / plot */}
                  <div className="space-y-2">
                    <Label htmlFor="pricePerPlot">Price per sqm / plot</Label>
                    <select
                      id="pricePerPlot"
                      className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                    >
                      <option value="">Select</option>
                      <option value="50k">₦50,000/sqm</option>
                      <option value="100k">₦100,000/sqm</option>
                      <option value="200k">₦200,000/sqm</option>
                    </select>
                  </div>

                  {/* Appreciation Rate */}
                  <div className="space-y-2">
                    <Label htmlFor="appreciationRate">Appreciation Rate (%)</Label>
                    <select
                      id="appreciationRate"
                      className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                    >
                      <option value="">select</option>
                      <option value="10">10%</option>
                      <option value="15">15%</option>
                      <option value="20">20%</option>
                    </select>
                  </div>

                  {/* Land Holding Duration */}
                  <div className="space-y-2">
                    <Label htmlFor="holdingDuration">Land Holding Duration</Label>
                    <select
                      id="holdingDuration"
                      className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                    >
                      <option value="">Enter your City/Town</option>
                      <option value="1-year">1 Year</option>
                      <option value="2-years">2 Years</option>
                      <option value="5-years">5 Years</option>
                    </select>
                  </div>

                  {/* Buy-back Clause */}
                  <div className="space-y-2">
                    <Label htmlFor="buybackClause">Buy-back Clause</Label>
                    <Input id="buybackClause" placeholder="" />
                  </div>

                  {/* Survey/Title Documents */}
                  <div className="space-y-2">
                    <Label htmlFor="surveyDocs1">Survey/Title Documents</Label>
                    <select
                      id="surveyDocs1"
                      className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                    >
                      <option value="">Select</option>
                      <option value="survey">Survey Plan</option>
                      <option value="cof-o">C of O</option>
                      <option value="deed">Deed of Assignment</option>
                    </select>
                  </div>

                  {/* Survey/Title Documents (second field) */}
                  <div className="space-y-2">
                    <Label htmlFor="surveyDocs2">Survey/Title Documents</Label>
                    <select
                      id="surveyDocs2"
                      className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                    >
                      <option value="">Promo</option>
                      <option value="gazette">Gazette</option>
                      <option value="excision">Excision</option>
                    </select>
                  </div>
                </div>

                {/* Optional Fields Section */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Optional Fields</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Bulk Purchase Discount */}
                    <div className="space-y-2">
                      <Label htmlFor="bulkDiscount">Bulk Purchase Discount</Label>
                      <select
                        id="bulkDiscount"
                        className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                      >
                        <option value="">Select</option>
                        <option value="5">5%</option>
                        <option value="10">10%</option>
                        <option value="15">15%</option>
                      </select>
                    </div>

                    {/* Development Projection */}
                    <div className="space-y-2">
                      <Label htmlFor="devProjection">Development Projection</Label>
                      <select
                        id="devProjection"
                        className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                      >
                        <option value="">Promo</option>
                        <option value="residential">Residential Development</option>
                        <option value="commercial">Commercial Development</option>
                        <option value="mixed">Mixed Use</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save to Own Fields - Using same as Outright Purchase */}
            {packageType === 'save-to-own' && (
              <div>
                <p className="text-sm text-gray-600 mb-6">
                  Fields for save-to-own properties.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Total Selling Price */}
                  <div className="space-y-2">
                    <Label htmlFor="totalSellingPrice">Total Selling Price*</Label>
                    <Input id="totalSellingPrice" placeholder="Total Price" />
                  </div>

                  {/* Available Units */}
                  <div className="space-y-2">
                    <Label htmlFor="availableUnits">Available Units*</Label>
                    <select
                      id="availableUnits"
                      className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                    >
                      <option value="">select</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="5">5</option>
                      <option value="10">10</option>
                    </select>
                  </div>

                  {/* Unit Types */}
                  <div className="space-y-2">
                    <Label htmlFor="unitTypes">Unit Types*</Label>
                    <select
                      id="unitTypes"
                      className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                    >
                      <option value="">Select</option>
                      <option value="studio">Studio</option>
                      <option value="1br">1 Bedroom</option>
                      <option value="2br">2 Bedroom</option>
                      <option value="3br">3 Bedroom</option>
                    </select>
                  </div>

                  {/* Payment Options */}
                  <div className="space-y-2">
                    <Label htmlFor="paymentOptions">Payment Options</Label>
                    <select
                      id="paymentOptions"
                      className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                    >
                      <option value="">select</option>
                      <option value="full">Full Payment</option>
                      <option value="installment">Installment</option>
                      <option value="mortgage">Mortgage</option>
                    </select>
                  </div>

                  {/* Installment Plan */}
                  <div className="space-y-2">
                    <Label htmlFor="installmentPlan">Installment Plan</Label>
                    <select
                      id="installmentPlan"
                      className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                    >
                      <option value="">Enter your City/Town</option>
                      <option value="3-months">3 Months</option>
                      <option value="6-months">6 Months</option>
                      <option value="12-months">12 Months</option>
                    </select>
                  </div>

                  {/* Ownership Transfer Rules */}
                  <div className="space-y-2">
                    <Label htmlFor="ownershipTransferRules">Ownership Transfer Rules</Label>
                    <Input id="ownershipTransferRules" placeholder="" />
                  </div>

                  {/* Certificate Template */}
                  <div className="space-y-2">
                    <Label htmlFor="certificateTemplate">Certificate Template</Label>
                    <select
                      id="certificateTemplate"
                      className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                    >
                      <option value="">Select</option>
                      <option value="standard">Standard</option>
                      <option value="premium">Premium</option>
                    </select>
                  </div>
                </div>

                {/* Optional Fields Section */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Optional Fields</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Discount Options */}
                    <div className="space-y-2">
                      <Label htmlFor="discountOptions">Discount Options</Label>
                      <select
                        id="discountOptions"
                        className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                      >
                        <option value="">Promo</option>
                        <option value="early-bird">Early Bird</option>
                        <option value="bulk">Bulk Purchase</option>
                        <option value="seasonal">Seasonal</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Done Button */}
            <div className="mt-8 flex justify-end">
              <Button
                onClick={() => navigate({ to: '/dashboard/properties/listed' })}
                className="bg-[var(--color-orange)] hover:bg-[var(--color-orange-dark)] text-white px-8"
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </div>
      {/* Add Fee Modal */}
      {showAddFeeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Add Fee</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="feeTitle">Title</Label>
                <Input
                  id="feeTitle"
                  type="text"
                  placeholder="Enter fee title"
                  value={newFee.title}
                  onChange={(e) => setNewFee({ ...newFee, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="feePrice">Price</Label>
                <Input
                  id="feePrice"
                  type="text"
                  placeholder="Enter price"
                  value={newFee.price}
                  onChange={(e) => setNewFee({ ...newFee, price: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddFeeModal(false)
                  setNewFee({ title: '', price: '' })
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (newFee.title && newFee.price) {
                    setAdditionalFees([...additionalFees, newFee])
                    setShowAddFeeModal(false)
                    setNewFee({ title: '', price: '' })
                  }
                }}
                className="bg-[var(--color-orange)] hover:bg-[var(--color-orange-dark)] text-white"
              >
                Add Fee
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
