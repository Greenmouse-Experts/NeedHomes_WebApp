import { createFileRoute, Outlet } from '@tanstack/react-router'
import {
  Users,
  Handshake,
  Home,
  HomeIcon,
  Calendar,
  TrendingUp,
  CheckCircle2,
  ArrowUp,
  Eye as EyeIcon,
  ChevronDown,
} from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Separator } from '@/components/ui/Separator'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardIndexPage,
})

function DashboardIndexPage() {
  return (
    <DashboardLayout title="Super Admin Dashboard">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              74 Investors
            </CardTitle>
            <Users className="w-5 h-5 text-[var(--color-orange)]" />
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              96 Partners
            </CardTitle>
            <Handshake className="w-5 h-5 text-[var(--color-orange)]" />
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              67 Building
            </CardTitle>
            <HomeIcon className="w-5 h-5 text-[var(--color-orange)]" />
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              24 Units
            </CardTitle>
            <Home className="w-5 h-5 text-[var(--color-orange)]" />
          </CardHeader>
        </Card>
      </div>

      {/* Welcome Banner */}
      <Card className="mb-6 bg-gradient-to-r from-gray-800 to-[var(--color-orange)] text-white relative overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">July 14, 2025</span>
          </div>
          <h2 className="text-2xl font-bold mb-1">Welcome, Admin 👋</h2>
          <p className="text-gray-200">Have a great day!</p>
          <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
            <div className="absolute top-10 right-10 w-4 h-4 bg-white rounded-full"></div>
            <div className="absolute top-20 right-20 w-2 h-2 bg-white rounded-full"></div>
            <div className="absolute top-32 right-32 w-3 h-3 bg-white rounded-full"></div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Today Revenue Trend</CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-2xl font-bold text-green-600">24.6%</span>
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 border border-gray-300 rounded-lg px-3 py-2">
                <Calendar className="w-4 h-4" />
                <span>Jan 2024 - Dec 2024</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-2">
              {/* Simple bar chart representation */}
              {[40, 60, 45, 80, 65, 90, 75, 85, 70, 95, 88, 100].map((height, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-[var(--color-orange)] to-[var(--color-orange-light)] rounded-t"
                  style={{ height: `${height}%` }}
                ></div>
              ))}
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[var(--color-orange)] rounded"></div>
                <span>N125.2k 12.5%</span>
                <span className="text-gray-400">NOV 1, 2023</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wallet */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Wallet</CardTitle>
              <select className="text-sm border border-gray-300 rounded px-2 py-1">
                <option>Monthly</option>
              </select>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Total Balance */}
            <Card className="bg-[var(--color-orange)] text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs opacity-90">TOTAL BALANCE</p>
                    <p className="text-2xl font-bold">N 120,000</p>
                  </div>
                  <EyeIcon className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>

            {/* Income/Expense */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium">INCOME</span>
                </div>
                <span className="font-bold text-green-600">N 100,000</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <ArrowUp className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-medium">EXPENSE</span>
                </div>
                <span className="font-bold text-red-600">N 20,000</span>
              </div>
            </div>

            <Separator />

            {/* Recent Transactions */}
            <div>
              <h3 className="text-sm font-semibold mb-3">RECENT</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-600">
                        + N 200,000
                      </p>
                      <p className="text-xs text-gray-500">Incoming payment</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">12-02-25</p>
                    <Badge className="bg-green-100 text-green-700 text-xs">
                      Successful
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
