import { createFileRoute, Link } from '@tanstack/react-router'
import { Bell, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/store/authStore'
import { InvestorSidebar } from '@/components/investors/InvestorSidebar'

export const Route = createFileRoute('/investors/properties')({
  component: InvestorPropertiesPage,
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

function InvestorPropertiesPage() {
  const [authRecord] = useAuth()
  const user = authRecord?.user
  const [selectedPropertyType, setSelectedPropertyType] = useState('all')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const propertyTypes = [
    { id: 'all', label: 'All Properties' },
    { id: 'outright-purchase', label: 'Outright Purchase' },
    { id: 'co-development', label: 'Co-Development' },
    { id: 'fractional-ownership', label: 'Fractional Ownership' },
    { id: 'land-banking', label: 'Land Banking' },
    { id: 'save-to-own', label: 'Save to Own' },
  ]
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <InvestorSidebar
        activePage="properties"
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <main className="md:ml-64 flex-1 p-4 md:p-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Properties</h1>
          </div>
          <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto">
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
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors hidden md:block">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full hidden md:block"></div>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {properties.map((property) => (
            <Link
              key={property.id}
              to="/investors/properties/$propertyId"
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
      </main>
    </div>
  )
}
