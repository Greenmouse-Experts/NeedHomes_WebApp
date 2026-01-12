import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { ChevronLeft } from 'lucide-react'

export const Route = createFileRoute('/dashboard/properties/listed')({
  component: ListedPropertyPage,
})

type Tab = 'basic' | 'media' | 'pricing' | 'specific'

function ListedPropertyPage() {
  const [activeTab, setActiveTab] = useState<Tab>('specific')
  const [formData, setFormData] = useState({
    propertyValuation: '',
    totalAvailableShares: '',
    pricePerShare: '',
    minimumPurchaseQuantity: '',
    expectedRentalYield: '',
    roiDistributionCycle: '',
    exitWindow: '',
    shareCertificateTemplate: '',
    secondaryMarketplaceRules: '',
    minimumHoldingPeriod: '',
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const tabs = [
    { id: 'basic' as Tab, label: 'Basic Property Information' },
    { id: 'media' as Tab, label: 'Media Uploads' },
    { id: 'pricing' as Tab, label: 'Pricing & Access' },
    { id: 'specific' as Tab, label: 'Specific Fields' },
  ]

  return (
    <DashboardLayout title="Manage Properties" subtitle="">
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Header */}
        <div className="mb-6">
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">New Property</span>
          </button>
          
          <div className="flex items-center gap-2">
            <Button variant="primary" size="sm">
              Fractional Ownership
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex gap-4 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 px-2 whitespace-nowrap font-medium text-sm transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-[var(--color-orange)] text-[var(--color-orange)]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Specific Fields Tab Content */}
        {activeTab === 'specific' && (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Fractional Ownership</h3>
              <p className="text-gray-600 text-sm">
                Fields for properties divided into investment shares.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Property Valuation */}
              <div className="space-y-2">
                <Label htmlFor="propertyValuation">Property Valuation</Label>
                <Input
                  id="propertyValuation"
                  type="text"
                  placeholder="Total Price"
                  value={formData.propertyValuation}
                  onChange={(e) => handleInputChange('propertyValuation', e.target.value)}
                />
              </div>

              {/* Total Available Shares */}
              <div className="space-y-2">
                <Label htmlFor="totalAvailableShares">Total Available Shares</Label>
                <Input
                  id="totalAvailableShares"
                  type="text"
                  placeholder="Select"
                  value={formData.totalAvailableShares}
                  onChange={(e) => handleInputChange('totalAvailableShares', e.target.value)}
                />
              </div>

              {/* Price per Share */}
              <div className="space-y-2">
                <Label htmlFor="pricePerShare">Price per Share</Label>
                <select
                  id="pricePerShare"
                  value={formData.pricePerShare}
                  onChange={(e) => handleInputChange('pricePerShare', e.target.value)}
                  className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                >
                  <option value="">Select</option>
                  <option value="100">$100</option>
                  <option value="500">$500</option>
                  <option value="1000">$1000</option>
                </select>
              </div>

              {/* Minimum Purchase Quantity */}
              <div className="space-y-2">
                <Label htmlFor="minimumPurchaseQuantity">Minimum Purchase Quantity</Label>
                <select
                  id="minimumPurchaseQuantity"
                  value={formData.minimumPurchaseQuantity}
                  onChange={(e) => handleInputChange('minimumPurchaseQuantity', e.target.value)}
                  className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                >
                  <option value="">Select</option>
                  <option value="1">1 Share</option>
                  <option value="5">5 Shares</option>
                  <option value="10">10 Shares</option>
                </select>
              </div>

              {/* Expected Rental Yield (%) */}
              <div className="space-y-2">
                <Label htmlFor="expectedRentalYield">Expected Rental Yield (%)</Label>
                <select
                  id="expectedRentalYield"
                  value={formData.expectedRentalYield}
                  onChange={(e) => handleInputChange('expectedRentalYield', e.target.value)}
                  className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                >
                  <option value="">Enter your City/Town</option>
                  <option value="5">5%</option>
                  <option value="10">10%</option>
                  <option value="15">15%</option>
                </select>
              </div>

              {/* ROI Distribution Cycle */}
              <div className="space-y-2">
                <Label htmlFor="roiDistributionCycle">ROI Distribution Cycle</Label>
                <Input
                  id="roiDistributionCycle"
                  type="text"
                  placeholder=""
                  value={formData.roiDistributionCycle}
                  onChange={(e) => handleInputChange('roiDistributionCycle', e.target.value)}
                />
              </div>

              {/* Exit Window */}
              <div className="space-y-2">
                <Label htmlFor="exitWindow">Exit Window</Label>
                <select
                  id="exitWindow"
                  value={formData.exitWindow}
                  onChange={(e) => handleInputChange('exitWindow', e.target.value)}
                  className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                >
                  <option value="">Select</option>
                  <option value="6months">6 Months</option>
                  <option value="1year">1 Year</option>
                  <option value="2years">2 Years</option>
                </select>
              </div>

              {/* Share Certificate Template */}
              <div className="space-y-2">
                <Label htmlFor="shareCertificateTemplate">Share Certificate Template</Label>
                <select
                  id="shareCertificateTemplate"
                  value={formData.shareCertificateTemplate}
                  onChange={(e) => handleInputChange('shareCertificateTemplate', e.target.value)}
                  className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                >
                  <option value="">Promo</option>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
            </div>

            {/* Optional Fields */}
            <div className="mt-8">
              <h4 className="text-base font-semibold mb-4">Optional Fields</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Secondary Marketplace Rules */}
                <div className="space-y-2">
                  <Label htmlFor="secondaryMarketplaceRules">Secondary Marketplace Rules</Label>
                  <select
                    id="secondaryMarketplaceRules"
                    value={formData.secondaryMarketplaceRules}
                    onChange={(e) => handleInputChange('secondaryMarketplaceRules', e.target.value)}
                    className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                  >
                    <option value="">Select</option>
                    <option value="flexible">Flexible</option>
                    <option value="strict">Strict</option>
                  </select>
                </div>

                {/* Minimum Holding Period */}
                <div className="space-y-2">
                  <Label htmlFor="minimumHoldingPeriod">Minimum Holding Period</Label>
                  <select
                    id="minimumHoldingPeriod"
                    value={formData.minimumHoldingPeriod}
                    onChange={(e) => handleInputChange('minimumHoldingPeriod', e.target.value)}
                    className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                  >
                    <option value="">6 month</option>
                    <option value="3months">3 Months</option>
                    <option value="6months">6 Months</option>
                    <option value="1year">1 Year</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-end">
              <Button variant="primary" size="lg" className="px-12">
                Done
              </Button>
            </div>
          </div>
        )}

        {/* Placeholder for other tabs */}
        {activeTab !== 'specific' && (
          <div className="text-center py-12 text-gray-500">
            <p>{tabs.find(t => t.id === activeTab)?.label} content coming soon...</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
