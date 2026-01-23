import { createFileRoute, Link } from '@tanstack/react-router'
import { Bell, CheckCircle2 } from 'lucide-react'
import { InvestorSidebar } from '@/components/investors/InvestorSidebar'
import { useState } from 'react'
import { useAuth } from '@/store/authStore'

export const Route = createFileRoute('/investors/my-investments')({
  component: MyInvestmentsPage,
})

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

const transactions = [
  {
    id: 1,
    type: 'Transferred Successfully',
    date: '01-01-2025',
    amount: '+N 12,000,000',
    status: 'Successful',
  },
  {
    id: 2,
    type: 'Debited Successfully',
    date: '12 - 01 - 2025',
    amount: '+N 12,000,000',
    status: 'Successful',
  },
  {
    id: 3,
    type: 'Transferred Successfully',
    date: '01 - 01 - 2025',
    amount: '+N 12,000,000',
    status: 'Successful',
  },
  {
    id: 4,
    type: 'Transferred Successfully',
    date: '12 - 01 - 2025',
    amount: '+N 12,000,000',
    status: 'Successful',
  },
]

function MyInvestmentsPage() {
  const maxValue = Math.max(...monthlyData.map(d => d.value))
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [authRecord] = useAuth()
  const user = authRecord?.user

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <InvestorSidebar
        activePage="my-investments"
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

          {/* Investment Analysis and Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Investment Analysis */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Investment Analysis</h3>

              <div className="flex items-center justify-center mb-6">
                <div className="relative w-64 h-64">
                  <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="#4B5563"
                      strokeWidth="40"
                      strokeDasharray="502.65"
                      strokeDashoffset="0"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="#F97316"
                      strokeWidth="40"
                      strokeDasharray="502.65"
                      strokeDashoffset="377"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="50"
                      fill="white"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 font-medium">Total</p>
                      <p className="text-sm font-bold text-gray-900">100%</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#F97316]"></div>
                    <span className="text-sm text-gray-600">Active (25%)</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#4B5563]"></div>
                    <span className="text-sm text-gray-600">Inactive (75%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Transactions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Transactions</h3>

              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{transaction.type}</p>
                      <p className="text-xs text-gray-500 mt-1">{transaction.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{transaction.amount}</p>
                      <p className="text-xs text-green-600 font-medium mt-1">{transaction.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
