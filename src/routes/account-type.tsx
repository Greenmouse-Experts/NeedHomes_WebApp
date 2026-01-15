import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/account-type')({
  component: AccountTypeSelection,
})

function AccountTypeSelection() {
  const navigate = useNavigate()

  const handleAccountTypeSelect = (type: 'investor' | 'partner') => {
    if (type === 'partner') {
      navigate({ to: '/signup-partner' })
    } else {
      navigate({ to: '/signup', search: { type } })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2a2a3a] via-[#3a3a4a] to-[#2a2a3a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 35px,
            rgba(255, 255, 255, 0.03) 35px,
            rgba(255, 255, 255, 0.03) 70px
          )`
        }} />
      </div>

      <div className="w-full max-w-5xl relative z-10">
        {/* Logo */}
        <div className="text-center mb-8 sm:mb-12">
          <Link to="/" className="inline-block">
            <img 
              src="/need_homes_logo.png" 
              alt="NEEDHOMES" 
              className="h-10 sm:h-12 mx-auto mb-6 sm:mb-8"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 sm:mb-3">Sign Up</h1>
          <p className="text-base sm:text-lg text-gray-300">Select the type of account you would like to create</p>
        </div>

        {/* Account Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10">
          {/* Investor Card */}
          <button
            onClick={() => handleAccountTypeSelect('investor')}
            className="cursor-pointer group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-750 hover:to-gray-850 transition-all duration-500 shadow-xl hover:shadow-2xl hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-[var(--color-orange)]/50"
          >
            {/* Image Container */}
            <div className="relative h-56 sm:h-64 lg:h-72 overflow-hidden">
              <img 
                src="/assets/Rectangle 21299(1).png"
                alt="Investor"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              
              {/* Floating icon */}
              <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md rounded-2xl p-3 group-hover:bg-[var(--color-orange)]/20 transition-colors duration-300">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-6 lg:p-8">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-[var(--color-orange)] transition-colors duration-300">
                Investor
              </h3>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                Build wealth effortlessly with strategic 
real estate investments
              </p>
            </div>

            {/* Hover overlay effect */}
            <div className="absolute inset-0 border-2 border-[var(--color-orange)] opacity-0 group-hover:opacity-100 rounded-2xl sm:rounded-3xl transition-opacity duration-300 pointer-events-none" />
          </button>

          {/* Partner Agent Card */}
          <button
            onClick={() => handleAccountTypeSelect('partner')}
            className="cursor-pointer group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-750 hover:to-gray-850 transition-all duration-500 shadow-xl hover:shadow-2xl hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-[var(--color-orange)]/50"
          >
            {/* Image Container */}
            <div className="relative h-56 sm:h-64 lg:h-72 overflow-hidden">
              <img 
                src="/assets/Rectangle 21299(2).png"
                alt="Partner Agent"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              
              {/* Floating icon */}
              <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md rounded-2xl p-3 group-hover:bg-[var(--color-orange)]/20 transition-colors duration-300">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-6 lg:p-8">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-[var(--color-orange)] transition-colors duration-300">
                Partner Agent
              </h3>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                Become a partner Agent in wealth creation while earning recurring income
              </p>
            </div>

            {/* Hover overlay effect */}
            <div className="absolute inset-0 border-2 border-[var(--color-orange)] opacity-0 group-hover:opacity-100 rounded-2xl sm:rounded-3xl transition-opacity duration-300 pointer-events-none" />
          </button>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-gray-300 text-sm sm:text-base">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="text-[var(--color-orange)] hover:text-[var(--color-orange-light)] font-semibold transition-colors duration-300 hover:underline"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
