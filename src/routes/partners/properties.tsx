import { createFileRoute, Link } from '@tanstack/react-router'
import { Building2, ChevronDown } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/partners/properties')({
  component: PartnerPropertiesPage,
})

const properties = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
    title: '2BR Fully detached Duplex',
    location: '4, Adeniyi Coesent, Ogba',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
    title: '2BR Fully detached Duplex',
    location: '4, Adeniyi Coesent, Ogba',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop',
    title: '2BR Fully detached Duplex',
    location: '4, Adeniyi Coesent, Ogba',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop',
    title: '2BR Fully detached Duplex',
    location: '4, Adeniyi Coesent, Ogba',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
    title: '2BR Fully detached Duplex',
    location: '4, Adeniyi Coesent, Ogba',
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
    title: '2BR Fully detached Duplex',
    location: '4, Adeniyi Coesent, Ogba',
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop',
    title: '2BR Fully detached Duplex',
    location: '4, Adeniyi Coesent, Ogba',
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop',
    title: '2BR Fully detached Duplex',
    location: '4, Adeniyi Coesent, Ogba',
  },
  {
    id: 9,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
    title: '2BR Fully detached Duplex',
    location: '4, Adeniyi Coesent, Ogba',
  },
  {
    id: 10,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
    title: '2BR Fully detached Duplex',
    location: '4, Adeniyi Coesent, Ogba',
  },
  {
    id: 11,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop',
    title: '2BR Fully detached Duplex',
    location: '4, Adeniyi Coesent, Ogba',
  },
  {
    id: 12,
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop',
    title: '2BR Fully detached Duplex',
    location: '4, Adeniyi Coesent, Ogba',
  },
]

function PartnerPropertiesPage() {
  const [selectedPropertyType, setSelectedPropertyType] = useState('all')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const propertyTypes = [
    { id: 'all', label: 'All Properties' },
    { id: 'outright-purchase', label: 'Outright Purchase' },
    { id: 'co-development', label: 'Co-Development' },
    { id: 'fractional-ownership', label: 'Fractional Ownership' },
    { id: 'land-banking', label: 'Land Banking' },
    { id: 'save-to-own', label: 'Save to Own' },
  ]
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Building2 className="h-6 w-6 text-green-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Properties</h1>
          </div>
          {/* Property Type Dropdown */}
          <div className="relative flex-1 md:flex-none">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between gap-2 bg-[var(--color-orange)] text-white px-4 md:px-6 py-2.5 rounded-lg font-medium hover:bg-orange-600 transition-colors w-full md:w-auto"
            >
              <span className="text-sm md:text-base">
                {propertyTypes.find(t => t.id === selectedPropertyType)?.label || 'All Properties'}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                {propertyTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setSelectedPropertyType(type.id)
                      setIsDropdownOpen(false)
                    }}
                    className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${selectedPropertyType === type.id ? 'bg-orange-50 text-[var(--color-orange)] font-medium' : 'text-gray-700'
                      }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <p className="text-gray-600 text-sm sm:text-base">
          Browse and manage your real estate partnership opportunities.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {properties.map((property) => (
          <Link
            key={property.id}
            to="/partners/properties/$propertyId"
            params={{ propertyId: property.id.toString() }}
            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{property.title}</h3>
              <p className="text-sm text-gray-500">{property.location}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
