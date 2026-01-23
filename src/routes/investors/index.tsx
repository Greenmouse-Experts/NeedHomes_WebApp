import { createFileRoute, Link } from '@tanstack/react-router'
import { Calendar, Bell } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { InvestorSidebar } from '@/components/investors/InvestorSidebar'
import { useState } from 'react'
import { useAuth } from '@/store/authStore'

export const Route = createFileRoute('/investors/')({
  component: InvestorDashboard,
})

const recentProperties = [
  { id: '01', type: '4BR Duplex', amount: 'N 10,000,000', date: '24-02-25', status: 'Approved' },
  { id: '02', type: 'Semi Detached', amount: 'N 10,000,000', date: '24-02-25', status: 'Pending' },
  { id: '03', type: 'Fully Detached', amount: 'N 10,000,000', date: '24-02-25', status: 'Approved' },
  { id: '04', type: '4BR Duplex', amount: 'N 10,000,000', date: '24-02-25', status: 'Declined' },
  { id: '05', type: 'Semi Detached', amount: 'N 10,000,000', date: '24-02-25', status: 'Approved' },
  { id: '06', type: 'Semi Detached', amount: 'N 10,000,000', date: '24-02-25', status: 'Approved' },
]

const monthlyData = [
  { month: 'Jan', value: 40000 },
  { month: 'Feb', value: 25000 },
  { month: 'Mar', value: 30000 },
  { month: 'Apr', value: 50000 },
  { month: 'May', value: 20000 },
  { month: 'Jun', value: 35000 },
  { month: 'Jul', value: 28000 },
  { month: 'Aug', value: 55000 },
  { month: 'Sep', value: 32000 },
  { month: 'Oct', value: 45000 },
  { month: 'Nov', value: 38000 },
  { month: 'Dec', value: 42000 },
]

function InvestorDashboard() {
  const maxValue = Math.max(...monthlyData.map(d => d.value))
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [authRecord] = useAuth()
  const user = authRecord?.user

  const getCurrentDate = () => {
    const date = new Date()
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
    return date.toLocaleDateString('en-US', options)
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <InvestorSidebar
        activePage="dashboard"
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

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
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-2xl p-8 relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 w-64 h-64 opacity-20">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <path fill="white" d="M40,-65C50,-55,55,-40,58,-25C61,-10,62,5,58,18C54,31,45,42,35,50C25,58,14,63,0,63C-14,63,-28,58,-40,50C-52,42,-62,31,-65,18C-68,5,-64,-10,-58,-25C-52,-40,-44,-55,-32,-65C-20,-75,-10,-80,0,-80C10,-80,30,-75,40,-65Z" transform="translate(100 100)" />
              </svg>
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-white/90 mb-3">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">{getCurrentDate()}</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Welcome, Lord Xylarz</h2>
              <p className="text-white/90">Have a great day!</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">10</p>
                  <p className="text-sm text-gray-500 font-medium">Total Property</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">N 20,000,000</p>
                  <p className="text-sm text-gray-500 font-medium">Total Amount Paid</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Property */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Property</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">#</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Property Type</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date Added</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentProperties.map((property) => (
                        <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-900">{property.id}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{property.type}</td>
                          <td className="px-6 py-4 text-sm text-gray-900 font-medium">{property.amount}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{property.date}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${property.status === 'Approved'
                                ? 'bg-green-100 text-green-700'
                                : property.status === 'Pending'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                                }`}
                            >
                              {property.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Wallet */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Wallet</h3>
                  <button className="text-sm text-gray-500 hover:text-gray-700 font-medium">Monthly ▼</button>
                </div>

                {/* Balance */}
                <div className="p-6 bg-gradient-to-br from-gray-700 to-gray-900 text-white">
                  <p className="text-xs text-gray-300 font-semibold mb-2 tracking-wide">TOTAL BALANCE</p>
                  <div className="flex items-center justify-between">
                    <p className="text-3xl font-bold">N 120,000</p>
                    <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Income/Withdraw */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                      <p className="text-xs text-gray-600 font-semibold mb-1">INCOME</p>
                      <p className="text-lg font-bold text-gray-900">N 100,000</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                      <p className="text-xs text-gray-600 font-semibold mb-1">WITHDRAW</p>
                      <p className="text-lg font-bold text-gray-900">N 20,000</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button variant="outline" className="w-full">
                      Deposit
                    </Button>
                    <Button className="w-full bg-[var(--color-orange)] hover:bg-[var(--color-orange-dark)] text-white">
                      Withdraw
                    </Button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="p-6 border-t border-gray-200">
                  <h4 className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">Recent</h4>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">Payment for Vendor reg</p>
                      <p className="text-xs text-gray-500 mt-1">01-02-25</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">+ N 200,000</p>
                      <p className="text-xs text-green-600 font-medium mt-1">Successful</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Analysis */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Analysis</h3>
            <div className="flex items-end justify-between h-64 gap-2 md:gap-4">
              {monthlyData.map((data) => (
                <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex items-end justify-center" style={{ height: '200px' }}>
                    <div
                      className="w-full bg-gradient-to-t from-gray-600 to-gray-800 rounded-t-lg hover:from-[var(--color-orange)] hover:to-orange-600 transition-all duration-300 cursor-pointer"
                      style={{ height: `${(data.value / maxValue) * 100}%`, minHeight: '8px' }}
                      title={`${data.month}: N ${data.value.toLocaleString()}`}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">{data.month}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-gray-400 px-2">
              <span>N0M</span>
              <span>N10M</span>
              <span>N20M</span>
              <span>N30M</span>
              <span>N40M</span>
              <span>N50M</span>
              <span>N60M</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
