import { createFileRoute } from '@tanstack/react-router'
import { Bell, Download, Search, Filter, ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export const Route = createFileRoute('/investors/transactions')({
  component: RouteComponent,
})

const transactions = [
  {
    id: 'TRX-83729',
    type: 'deposit',
    description: 'Wallet Deposit via Bank Transfer',
    amount: 'N 5,000,000',
    date: 'Jan 26, 2025',
    time: '10:30 AM',
    status: 'successful',
  },
  {
    id: 'TRX-83730',
    type: 'investment',
    description: 'Investment in 4BR Duplex',
    amount: 'N 2,500,000',
    date: 'Jan 25, 2025',
    time: '02:15 PM',
    status: 'successful',
  },
  {
    id: 'TRX-83731',
    type: 'withdrawal',
    description: 'Withdrawal to GTBank ****1234',
    amount: 'N 100,000',
    date: 'Jan 24, 2025',
    time: '09:00 AM',
    status: 'pending',
  },
  {
    id: 'TRX-83732',
    type: 'deposit',
    description: 'Wallet Deposit via Card',
    amount: 'N 500,000',
    date: 'Jan 23, 2025',
    time: '04:45 PM',
    status: 'failed',
  },
  {
    id: 'TRX-83733',
    type: 'dividend',
    description: 'Dividend Payout - Jan 2025',
    amount: 'N 50,000',
    date: 'Jan 22, 2025',
    time: '12:00 PM',
    status: 'successful',
  },
]

function RouteComponent() {
  const [searchTerm, setSearchTerm] = useState('')

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'successful':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Successful</span>
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>
      case 'failed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Failed</span>
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>
    }
  }

  const getTypeIcon = (type: string) => {
    if (type === 'deposit' || type === 'dividend') {
      return <div className="p-2 bg-green-100 rounded-full"><ArrowDownLeft className="w-4 h-4 text-green-600" /></div>
    }
    return <div className="p-2 bg-red-100 rounded-full"><ArrowUpRight className="w-4 h-4 text-red-600" /></div>
  }

  const filteredTransactions = transactions.filter(t =>
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and view your financial history</p>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
          </button>
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full"></div>
        </div>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search transactions..."
              className="pl-9 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="flex items-center gap-2 text-gray-600">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button variant="outline" className="flex items-center gap-2 text-gray-600">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Transaction</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(trx.type)}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{trx.description}</p>
                        <p className="text-xs text-gray-500 capitalize">{trx.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-500 font-mono">{trx.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{trx.date}</div>
                    <div className="text-xs text-gray-500">{trx.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-bold ${trx.type === 'deposit' || trx.type === 'dividend' ? 'text-green-600' : 'text-gray-900'}`}>
                      {trx.amount}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(trx.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination (Visual Only) */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredTransactions.length}</span> of <span className="font-medium">{filteredTransactions.length}</span> results</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled>Next</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
