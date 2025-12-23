import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Search,
  Filter,
  Calendar,
  ChevronDown,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingDown,
  TrendingUp,
  ArrowUpDown,
  MoreVertical,
} from 'lucide-react'
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
import { Badge } from '@/components/ui/Badge'

export const Route = createFileRoute('/dashboard/transactions/receipts')({
  component: ReceiptsPage,
})

const receipts = [
  {
    id: '1',
    studentName: 'Janet Adebayo',
    orderDate: '12 Aug 2022 - 12:25 am',
    property: 'HR 101',
    trackingId: '9348fjr73',
    orderTotal: '₦25,000.00',
    status: 'Completed',
  },
  {
    id: '2',
    studentName: 'Samuel Johnson',
    orderDate: '12 Aug 2022 - 12:25 am',
    property: 'HR 101',
    trackingId: '9348fjr73',
    orderTotal: '₦25,000.00',
    status: 'In-Progress',
  },
  {
    id: '3',
    studentName: 'Francis Doe',
    orderDate: '12 Aug 2022 - 12:25 am',
    property: 'HR 101',
    trackingId: '9348fjr73',
    orderTotal: '₦25,000.00',
    status: 'Pending',
  },
  {
    id: '4',
    studentName: 'Christian Dior',
    orderDate: '12 Aug 2022 - 12:25 am',
    property: 'HR 101',
    trackingId: '9348fjr73',
    orderTotal: '₦25,000.00',
    status: 'Completed',
  },
  {
    id: '5',
    studentName: 'Amina Hassan',
    orderDate: '11 Aug 2022 - 10:15 am',
    property: 'HR 102',
    trackingId: '9348fjr74',
    orderTotal: '₦30,000.00',
    status: 'Completed',
  },
  {
    id: '6',
    studentName: 'David Okonkwo',
    orderDate: '11 Aug 2022 - 09:30 am',
    property: 'HR 103',
    trackingId: '9348fjr75',
    orderTotal: '₦20,000.00',
    status: 'Pending',
  },
  {
    id: '7',
    studentName: 'Grace Okafor',
    orderDate: '10 Aug 2022 - 03:45 pm',
    property: 'HR 104',
    trackingId: '9348fjr76',
    orderTotal: '₦35,000.00',
    status: 'In-Progress',
  },
  {
    id: '8',
    studentName: 'Michael Adeyemi',
    orderDate: '10 Aug 2022 - 02:20 pm',
    property: 'HR 105',
    trackingId: '9348fjr77',
    orderTotal: '₦28,000.00',
    status: 'Completed',
  },
]

function ReceiptsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRows, setSelectedRows] = useState<string[]>([])

  const filteredReceipts = receipts.filter(
    (receipt) =>
      receipt.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      receipt.trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      receipt.property.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleRowSelection = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    )
  }

  const toggleAllSelection = () => {
    if (selectedRows.length === filteredReceipts.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(filteredReceipts.map((r) => r.id))
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Completed: { color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
      'In-Progress': { color: 'bg-blue-100 text-blue-700', icon: Clock },
      Pending: { color: 'bg-orange-100 text-orange-700', icon: Clock },
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

  return (
    <DashboardLayout title="Super Admin Dashboard" subtitle="Receipts">
      {/* Stats Cards */}
      <div className="mb-4 md:mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-lg md:text-xl font-bold text-gray-900">Receipts</h2>
          <DropdownMenu
            trigger={
              <Button variant="outline" size="sm" className="gap-2 text-xs md:text-sm">
                This Week
                <ChevronDown className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </Button>
            }
          >
            <DropdownMenuItem>This Week</DropdownMenuItem>
            <DropdownMenuItem>This Month</DropdownMenuItem>
            <DropdownMenuItem>This Year</DropdownMenuItem>
            <DropdownMenuItem>All Time</DropdownMenuItem>
          </DropdownMenu>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {/* Card 1 - All Orders */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 md:p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h3 className="text-xs md:text-sm font-semibold text-gray-600 uppercase tracking-wide">All Orders</h3>
              <div className="p-1.5 md:p-2 bg-blue-100 rounded-lg">
                <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
              </div>
            </div>
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xl md:text-2xl font-bold text-gray-900">45</span>
                <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm">
                  <span className="text-gray-500">Pending:</span>
                  <span className="font-semibold text-orange-600">5</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">Completed</span>
                </div>
                <span className="text-lg font-bold text-green-600">32</span>
              </div>
            </div>
          </div>

          {/* Card 2 - Canceled & Returns */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Canceled & Returns</h3>
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-gray-900">30</span>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingDown className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-600">-20%</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">Returned:</span>
                  <span className="font-semibold text-orange-600">20</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-gray-600">Failed</span>
                </div>
                <span className="text-lg font-bold text-red-600">5</span>
              </div>
            </div>
          </div>

          {/* Card 3 - Projects & Students */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Projects & Students</h3>
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-gray-900">20%</span>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">+0.00%</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500 block">Uncompleted</span>
                  <span className="text-xs text-gray-500">Projects</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-600">Students</span>
                </div>
                <span className="text-lg font-bold text-purple-600">30</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Receipts Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Payment Receipts</h2>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4 mb-4 md:mb-6">
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto max-h-[500px] md:max-h-[600px] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-gray-50 z-10">
                <TableRow className="bg-gray-50">
                  <TableHead className="w-10 md:w-12">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === filteredReceipts.length && filteredReceipts.length > 0}
                      onChange={toggleAllSelection}
                      className="w-3.5 h-3.5 md:w-4 md:h-4 text-[var(--color-orange)] border-gray-300 rounded focus:ring-[var(--color-orange)]"
                    />
                  </TableHead>
                  <TableHead className="font-semibold text-xs md:text-sm whitespace-nowrap">
                    <div className="flex items-center gap-1.5 md:gap-2">
                      Student Name
                      <ArrowUpDown className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-400 cursor-pointer" />
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-xs md:text-sm whitespace-nowrap hidden md:table-cell">
                    <div className="flex items-center gap-1.5 md:gap-2">
                      Order Date
                      <ArrowUpDown className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-400 cursor-pointer" />
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-xs md:text-sm whitespace-nowrap hidden lg:table-cell">
                    <div className="flex items-center gap-1.5 md:gap-2">
                      Property
                      <ArrowUpDown className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-400 cursor-pointer" />
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-xs md:text-sm whitespace-nowrap hidden xl:table-cell">
                    <div className="flex items-center gap-1.5 md:gap-2">
                      Tracking ID
                      <ArrowUpDown className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-400 cursor-pointer" />
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-xs md:text-sm whitespace-nowrap">
                    <div className="flex items-center gap-1.5 md:gap-2">
                      Order Total
                      <ArrowUpDown className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-400 cursor-pointer" />
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-xs md:text-sm whitespace-nowrap hidden lg:table-cell">
                    <div className="flex items-center gap-1.5 md:gap-2">
                      Action
                      <ArrowUpDown className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-400 cursor-pointer" />
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-xs md:text-sm whitespace-nowrap">
                    <div className="flex items-center gap-1.5 md:gap-2">
                      Status
                      <ArrowUpDown className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-400 cursor-pointer" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReceipts.map((receipt) => (
                  <TableRow key={receipt.id} className="hover:bg-gray-50">
                    <TableCell className="whitespace-nowrap py-2 md:py-3">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(receipt.id)}
                        onChange={() => toggleRowSelection(receipt.id)}
                        className="w-3.5 h-3.5 md:w-4 md:h-4 text-[var(--color-orange)] border-gray-300 rounded focus:ring-[var(--color-orange)]"
                      />
                    </TableCell>
                    <TableCell className="font-medium text-gray-900 whitespace-nowrap text-xs md:text-sm py-2 md:py-3">
                      <div className="min-w-0">
                        <div>{receipt.studentName}</div>
                        <div className="text-xs text-gray-500 md:hidden mt-0.5">{receipt.orderDate}</div>
                        <div className="text-xs text-gray-500 md:hidden">{receipt.property}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600 whitespace-nowrap text-xs md:text-sm hidden md:table-cell">{receipt.orderDate}</TableCell>
                    <TableCell className="text-gray-600 whitespace-nowrap text-xs md:text-sm hidden lg:table-cell">{receipt.property}</TableCell>
                    <TableCell className="text-gray-600 font-mono text-xs md:text-sm whitespace-nowrap hidden xl:table-cell">{receipt.trackingId}</TableCell>
                    <TableCell className="font-semibold text-gray-900 whitespace-nowrap text-xs md:text-sm py-2 md:py-3">{receipt.orderTotal}</TableCell>
                    <TableCell className="whitespace-nowrap hidden lg:table-cell py-2 md:py-3">
                      <button className="px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors whitespace-nowrap">
                        Cancel Order
                      </button>
                    </TableCell>
                    <TableCell className="whitespace-nowrap py-2 md:py-3">{getStatusBadge(receipt.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
