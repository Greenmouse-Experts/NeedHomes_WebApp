import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Search,
  Filter,
  Calendar,
  ChevronDown,
  CheckCircle2,
  Clock,
  ArrowUpDown,
  MoreVertical,
  TrendingUp,
  Wallet,
  Building2,
  FileText,
  DollarSign,
  CreditCard,
} from 'lucide-react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'
import { DropdownMenu, DropdownMenuItem } from '@/components/ui/DropdownMenu'

export const Route = createFileRoute('/dashboard/transactions/payments')({
  component: PaymentsPage,
})

const payments = [
  {
    id: '1',
    transactionId: 'TRX215465789123',
    date: '12 Aug 2025 - 12:25 am',
    userName: 'Chukka Uzo',
    userType: 'Partners',
    amount: '₦25,000.00',
    transactionType: 'Refund',
    status: 'Refund',
  },
  {
    id: '2',
    transactionId: 'TRX215465789124',
    date: '12 Aug 2025 - 12:25 am',
    userName: 'Chukka Uzo',
    userType: 'Investor',
    amount: '₦25,000.00',
    transactionType: 'Payment',
    status: 'In-Progress',
  },
  {
    id: '3',
    transactionId: 'TRX215465789125',
    date: '12 Aug 2025 - 12:25 am',
    userName: 'Chukka Uzo',
    userType: 'Investor',
    amount: '₦25,000.00',
    transactionType: 'Payment',
    status: 'Completed',
  },
  {
    id: '4',
    transactionId: 'TRX215465789126',
    date: '11 Aug 2025 - 10:15 am',
    userName: 'Amina Hassan',
    userType: 'Investor',
    amount: '₦30,000.00',
    transactionType: 'Payment',
    status: 'Pending',
  },
  {
    id: '5',
    transactionId: 'TRX215465789127',
    date: '11 Aug 2025 - 09:30 am',
    userName: 'David Okonkwo',
    userType: 'Partners',
    amount: '₦20,000.00',
    transactionType: 'Payment',
    status: 'Completed',
  },
  {
    id: '6',
    transactionId: 'TRX215465789128',
    date: '10 Aug 2025 - 03:45 pm',
    userName: 'Grace Okafor',
    userType: 'Investor',
    amount: '₦35,000.00',
    transactionType: 'Payment',
    status: 'In-Progress',
  },
  {
    id: '7',
    transactionId: 'TRX215465789129',
    date: '10 Aug 2025 - 02:20 pm',
    userName: 'Michael Adeyemi',
    userType: 'Partners',
    amount: '₦28,000.00',
    transactionType: 'Refund',
    status: 'Refund',
  },
  {
    id: '8',
    transactionId: 'TRX215465789130',
    date: '09 Aug 2025 - 11:10 am',
    userName: 'Fatima Danjuma',
    userType: 'Investor',
    amount: '₦40,000.00',
    transactionType: 'Payment',
    status: 'Completed',
  },
]

function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRows, setSelectedRows] = useState<string[]>([])

  const filteredPayments = payments.filter(
    (payment) =>
      payment.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.userType.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleRowSelection = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    )
  }

  const toggleAllSelection = () => {
    if (selectedRows.length === filteredPayments.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(filteredPayments.map((p) => p.id))
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Completed: { color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
      'In-Progress': { color: 'bg-blue-100 text-blue-700', icon: Clock },
      Pending: { color: 'bg-orange-100 text-orange-700', icon: Clock },
      Refund: { color: 'bg-red-100 text-red-700', icon: CheckCircle2 },
      Payment: { color: 'bg-purple-100 text-purple-700', icon: Wallet },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.Pending
    const Icon = config.icon

    return (
      <div className={`${config.color} inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full`}>
        <Icon className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="text-sm font-medium whitespace-nowrap">{status}</span>
      </div>
    )
  }

  // Chart data
  const revenueData = [
    { month: 'Jan', income: 200, expenses: 150 },
    { month: 'Feb', income: 210, expenses: 160 },
    { month: 'Mar', income: 220, expenses: 170 },
    { month: 'Apr', income: 215, expenses: 165 },
    { month: 'May', income: 230, expenses: 180 },
    { month: 'Jun', income: 240, expenses: 190 },
    { month: 'Jul', income: 235, expenses: 185 },
    { month: 'Aug', income: 245, expenses: 195 },
    { month: 'Sep', income: 250, expenses: 200 },
    { month: 'Oct', income: 248, expenses: 198 },
    { month: 'Nov', income: 255, expenses: 205 },
    { month: 'Dec', income: 260, expenses: 210 },
  ]

  const incomeSummaryData = [
    { name: 'Investment', value: 1754, color: '#3B82F6' },
    { name: 'Partners', value: 873, color: '#EF671D' },
    { name: 'Projects', value: 685, color: '#6B7280' },
  ]

  const COLORS = ['#3B82F6', '#EF671D', '#6B7280']

  return (
    <DashboardLayout title="Super Admin Dashboard" subtitle="Payments">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-4 md:mb-6">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 md:p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h3 className="text-xs md:text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Investment</h3>
            <div className="p-1.5 md:p-2 bg-orange-100 rounded-lg">
              <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-orange)]" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xl md:text-2xl font-bold text-gray-900">₦ 1,002,432</p>
            <p className="text-[10px] md:text-xs text-gray-500">This Month</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Completed Projects</h3>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Building2 className="w-5 h-5 text-[var(--color-orange)]" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">260</p>
            <p className="text-xs text-gray-500">This Month</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Amount</h3>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Wallet className="w-5 h-5 text-[var(--color-orange)]" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">₦319,000</p>
            <p className="text-xs text-gray-500">This Month</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Pending Payments</h3>
            <div className="p-2 bg-orange-100 rounded-lg">
              <CreditCard className="w-5 h-5 text-[var(--color-orange)]" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">₦ 1,002</p>
            <p className="text-xs text-gray-500">This Month</p>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200 px-3 md:px-6 pt-3 md:pt-4">
            <div className="flex gap-1 overflow-x-auto">
              <button className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-gray-700 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300 whitespace-nowrap">
                All Transactions
              </button>
              <button className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-[var(--color-orange)] border-b-2 border-[var(--color-orange)] whitespace-nowrap">
                Income
              </button>
              <button className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-gray-700 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300 whitespace-nowrap">
                Payouts
              </button>
            </div>
          </div>

          {/* Toolbar */}
          <div className="p-3 md:p-4 border-b border-gray-200">
            <div className="flex flex-col gap-3 md:gap-4">
              <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full">
                <div className="relative flex-1 min-w-[200px] md:flex-initial md:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 text-sm"
                  />
                </div>
                <Button variant="outline" size="sm" className="gap-2 text-xs md:text-sm">
                  <Filter className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span className="hidden sm:inline">Filter</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-2 text-xs md:text-sm">
                  <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span className="hidden sm:inline">Filter</span>
                </Button>
                <DropdownMenu
                  trigger={
                    <Button variant="outline" size="sm" className="gap-2 text-xs md:text-sm">
                      Bulk Action
                      <ChevronDown className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </Button>
                  }
                >
                  <DropdownMenuItem>Export Selected</DropdownMenuItem>
                  <DropdownMenuItem>Delete Selected</DropdownMenuItem>
                  <DropdownMenuItem>Mark as Completed</DropdownMenuItem>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-gray-50 z-10">
                <TableRow className="bg-gray-50">
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === filteredPayments.length && filteredPayments.length > 0}
                      onChange={toggleAllSelection}
                      className="w-4 h-4 text-[var(--color-orange)] border-gray-300 rounded focus:ring-[var(--color-orange)]"
                    />
                  </TableHead>
                  <TableHead className="font-semibold whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      Transaction ID
                      <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 cursor-pointer" />
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      Date and Time
                      <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 cursor-pointer" />
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      User Name
                      <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 cursor-pointer" />
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      User Type
                      <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 cursor-pointer" />
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      Amount
                      <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 cursor-pointer" />
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      Transaction Type
                      <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 cursor-pointer" />
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      Status
                      <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 cursor-pointer" />
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      Action
                      <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 cursor-pointer" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id} className="hover:bg-gray-50">
                    <TableCell className="whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(payment.id)}
                        onChange={() => toggleRowSelection(payment.id)}
                        className="w-4 h-4 text-[var(--color-orange)] border-gray-300 rounded focus:ring-[var(--color-orange)]"
                      />
                    </TableCell>
                    <TableCell className="font-mono text-sm text-gray-900 whitespace-nowrap">{payment.transactionId}</TableCell>
                    <TableCell className="text-gray-600 whitespace-nowrap">{payment.date}</TableCell>
                    <TableCell className="font-medium text-gray-900 whitespace-nowrap">{payment.userName}</TableCell>
                    <TableCell className="text-gray-600 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        payment.userType === 'Investor' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {payment.userType}
                      </span>
                    </TableCell>
                    <TableCell className="font-semibold text-gray-900 whitespace-nowrap">{payment.amount}</TableCell>
                    <TableCell className="text-gray-600 whitespace-nowrap">{payment.transactionType}</TableCell>
                    <TableCell className="whitespace-nowrap">{getStatusBadge(payment.status)}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      <DropdownMenu
                        trigger={
                          <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                          </button>
                        }
                      >
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">20 Items per page</span>
              <span className="text-sm text-gray-600">1-20 of 200 items</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                &lt;
              </button>
              <span className="text-sm text-gray-600 px-3">1 of 44 pages</span>
              <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Revenue Trend Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 md:mb-6">
            <div>
              <h3 className="text-base md:text-lg font-bold text-gray-900">Today Revenue Trend</h3>
              <div className="flex items-center gap-2 mt-1">
                <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-600" />
                <span className="text-xs md:text-sm font-semibold text-green-600">24.6%</span>
              </div>
            </div>
            <DropdownMenu
              trigger={
                <Button variant="outline" size="sm" className="gap-2 text-xs md:text-sm">
                  <span className="hidden sm:inline">Jan 2024 - Dec 2024</span>
                  <span className="sm:hidden">2024</span>
                  <ChevronDown className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </Button>
              }
            >
              <DropdownMenuItem>Jan 2024 - Dec 2024</DropdownMenuItem>
              <DropdownMenuItem>Jan 2023 - Dec 2023</DropdownMenuItem>
              <DropdownMenuItem>Jan 2022 - Dec 2022</DropdownMenuItem>
            </DropdownMenu>
          </div>
          
          {/* Chart */}
          <div className="h-48 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF671D" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#EF671D" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6B7280"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="#6B7280"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${value}K`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    padding: '8px'
                  }}
                  formatter={(value: number) => [`₦${value}K`, '']}
                />
                <Area 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorIncome)"
                  name="Income"
                />
                <Area 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#EF671D" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorExpenses)"
                  name="Expenses"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-600">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[var(--color-orange)]"></div>
              <span className="text-sm text-gray-600">Expenses</span>
            </div>
          </div>
        </div>

        {/* Income Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 md:mb-6">
            <h3 className="text-base md:text-lg font-bold text-gray-900">Income Summary</h3>
            <DropdownMenu
              trigger={
                <Button variant="outline" size="sm" className="gap-2 text-xs md:text-sm">
                  Sort by
                  <ChevronDown className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </Button>
              }
            >
              <DropdownMenuItem>Amount</DropdownMenuItem>
              <DropdownMenuItem>Date</DropdownMenuItem>
              <DropdownMenuItem>Type</DropdownMenuItem>
            </DropdownMenu>
          </div>

          {/* Pie Chart */}
          <div className="h-40 md:h-48 mb-4 md:mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={incomeSummaryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {incomeSummaryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    padding: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Statistics */}
          <div className="space-y-2 md:space-y-3">
            <div className="flex items-center justify-between p-2.5 md:p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 bg-blue-100 rounded-lg">
                  <Building2 className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                </div>
                <span className="text-xs md:text-sm font-medium text-gray-700">Investment</span>
              </div>
              <span className="text-base md:text-lg font-bold text-blue-600">1,754</span>
            </div>
            <div className="flex items-center justify-between p-2.5 md:p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 bg-orange-100 rounded-lg">
                  <Wallet className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-orange)]" />
                </div>
                <span className="text-xs md:text-sm font-medium text-gray-700">Partners</span>
              </div>
              <span className="text-base md:text-lg font-bold text-[var(--color-orange)]">873</span>
            </div>
            <div className="flex items-center justify-between p-2.5 md:p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 bg-gray-100 rounded-lg">
                  <FileText className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                </div>
                <span className="text-xs md:text-sm font-medium text-gray-700">Projects</span>
              </div>
              <span className="text-base md:text-lg font-bold text-gray-600">685</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
