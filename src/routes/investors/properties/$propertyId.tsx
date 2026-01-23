import { createFileRoute, Link } from '@tanstack/react-router'
import { Bell, BedDouble, Maximize, Calendar } from 'lucide-react'

export const Route = createFileRoute('/investors/properties/$propertyId')({
  component: PropertyDetailsPage,
})

const propertyData: Record<string, any> = {
  '1': {
    id: 1,
    title: 'Fully Detached Duplex',
    location: '9, 10, Adeniji Street, Lagos',
    price: 'N 25,000,000',
    sku: 'CUS-83727XJ',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
    bedrooms: 4,
    swimmingPool: 1,
    area: '350 sqm',
    yearBuilt: 2025,
    type: 'Semi Detached',
    package: 'Outright Purchase',
    status: 'Published',
    dateAdded: 'Jan 15, 2024',
    description: 'A beautiful semi-detached duplex located in the heart of Lagos. This property features modern amenities, spacious rooms, and excellent finishing. Perfect for families looking for comfort and luxury.',
    features: [
      'Ventilated Living Room',
      'Modern Kitchen',
      'Car Garage',
      'Spacious Bedroom',
      'Good Drainage',
      'Constant Water Supply',
    ],
  },
  '2': {
    id: 2,
    title: '2BR Fully detached Duplex',
    location: '4, Adeniyi Coesent, Ogba',
    price: 'N 18,000,000',
    sku: 'CUS-83728XJ',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
    bedrooms: 2,
    swimmingPool: 0,
    area: '280 sqm',
    yearBuilt: 2024,
    type: 'Fully Detached',
    package: 'Installment',
    status: 'Published',
    dateAdded: 'Jan 10, 2024',
    description: 'Modern 2-bedroom fully detached duplex in Ogba. Features contemporary design with quality finishes and ample parking space.',
    features: [
      'Ventilated Living Room',
      'Modern Kitchen',
      'Car Garage',
      'Spacious Bedroom',
      'Good Drainage',
    ],
  },
}

function PropertyDetailsPage() {
  const { propertyId } = Route.useParams()

  const property = propertyData[propertyId] || {
    id: propertyId,
    title: 'Fully Detached Duplex',
    location: '9, 10, Adeniji Street, Lagos',
    price: 'N 25,000,000',
    sku: 'CUS-83727XJ',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
    bedrooms: 4,
    swimmingPool: 1,
    area: '350 sqm',
    yearBuilt: 2025,
    type: 'Semi Detached',
    package: 'Outright Purchase',
    status: 'Published',
    dateAdded: 'Jan 15, 2024',
    description: 'A beautiful semi-detached duplex located in the heart of Lagos. This property features modern amenities, spacious rooms, and excellent finishing. Perfect for families looking for comfort and luxury.',
    features: [
      'Ventilated Living Room',
      'Modern Kitchen',
      'Car Garage',
      'Spacious Bedroom',
      'Good Drainage',
      'Constant Water Supply',
    ],
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#2A2A2A] text-white flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo_white.png"
              alt="NeedHomes"
              className="h-8"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
              }}
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <Link to="/investors" className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-800 text-gray-400 text-sm transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span>Dashboard</span>
          </Link>
          <Link to="/investors/my-investments" className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-800 text-gray-400 text-sm transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>My Investment</span>
          </Link>
          <Link to="/investors/properties" className="flex items-center gap-2.5 p-2 rounded-lg bg-[var(--color-orange)] text-white text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span>Properties</span>
          </Link>
          <a href="#" className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-800 text-gray-400 text-sm transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span>Notifications</span>
          </a>
          <a href="#" className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-800 text-gray-400 text-sm transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Transaction</span>
          </a>
          <a href="#" className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-800 text-gray-400 text-sm transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>Announcement</span>
          </a>
          <Link to="/investors/settings" className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-800 text-gray-400 text-sm transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Setting</span>
          </Link>
        </nav>

        {/* Store Badge */}
        <div className="p-6">
          <div className="bg-white rounded-xl p-4 text-center">
            <div className="w-12 h-12 bg-orange-500 rounded-full mx-auto mb-3 flex items-center justify-center">
              <span className="text-2xl">🏪</span>
            </div>
            <h3 className="text-gray-900 font-bold text-sm mb-1">Create Store</h3>
            <p className="text-gray-500 text-xs mb-3">Account Setting</p>
            <button className="w-full bg-orange-500 text-white text-xs font-medium py-2 rounded-lg hover:bg-orange-600 transition-colors">
              Log Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Investor</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full"></div>
          </div>
        </header>

        <div className="space-y-6">
          {/* Property Image */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="relative h-80 overflow-hidden">
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Property Title and Price */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{property.title}</h2>
                <p className="text-gray-600 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {property.location}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-[var(--color-orange)]">{property.price}</p>
                <p className="text-sm text-gray-500">{property.sku}</p>
              </div>
            </div>

            {/* Property Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <BedDouble className="w-5 h-5 text-[var(--color-orange)]" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{property.bedrooms}</p>
                  <p className="text-xs text-gray-600">Bedroom</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{property.swimmingPool}</p>
                  <p className="text-xs text-gray-600">Swimming Pool</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Maximize className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{property.area}</p>
                  <p className="text-xs text-gray-600">Area</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{property.yearBuilt}</p>
                  <p className="text-xs text-gray-600">Year Built</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description and Property Information */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Description */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
              <p className="text-gray-600 leading-relaxed mb-6">{property.description}</p>

              {/* Features */}
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {property.features.map((feature: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[var(--color-orange)] rounded-full"></div>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Property Information */}
            <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Information</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Type</span>
                  <span className="text-sm font-medium text-gray-900">{property.type}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Package</span>
                  <span className="text-sm font-medium text-gray-900">{property.package}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className="inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                    {property.status}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Date Added</span>
                  <span className="text-sm font-medium text-gray-900">{property.dateAdded}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
