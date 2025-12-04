import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import {
  LayoutDashboard,
  Users,
  Handshake,
  Home,
  Eye,
  HomeIcon,
  Plus,
  Receipt,
  CreditCard,
  Megaphone,
  Settings,
  ChevronDown,
  ChevronRight,
  Search,
  Bell,
  Calendar,
  TrendingUp,
  CheckCircle2,
  ArrowUp,
  Eye as EyeIcon,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import { Separator } from '@/components/ui/Separator'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    userManagement: true,
    propertyManagement: true,
    transaction: true,
  })
  // Dashboard stats - using mock data for now
  const stats = { investors: 74, partners: 96, buildings: 67, units: 24 }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#2A2A2A] text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <img 
              src="/logo_white.png" 
              alt="NeedHomes" 
              className="h-10"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div className="hidden flex-col">
              <div className="w-8 h-8 border-2 border-[var(--color-orange)] rounded-t-lg"></div>
              <h1 className="text-lg font-bold">NEEDHOMES</h1>
              <p className="text-xs text-gray-400">PROPERTY MANAGEMENT</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {/* Dashboards */}
          <Link
            to="/dashboard"
            className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-orange)] text-white"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboards</span>
          </Link>

          {/* User Management */}
          <div>
            <button
              onClick={() => toggleSection('userManagement')}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 text-gray-300"
            >
              <span className="text-xs font-semibold uppercase">USER MANAGEMENT</span>
              {expandedSections.userManagement ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            {expandedSections.userManagement && (
              <div className="ml-4 mt-1 space-y-1">
                <Link
                  to="/dashboard/investors"
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 text-gray-400"
                >
                  <Users className="w-4 h-4" />
                  <span>Investors</span>
                </Link>
                <Link
                  to="/dashboard/partners"
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 text-gray-400"
                >
                  <Handshake className="w-4 h-4" />
                  <span>Partners</span>
                </Link>
              </div>
            )}
          </div>

          {/* Property Management */}
          <div>
            <button
              onClick={() => toggleSection('propertyManagement')}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 text-gray-300"
            >
              <span className="text-xs font-semibold uppercase">PROPERTY MANAGEMENT</span>
              {expandedSections.propertyManagement ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            {expandedSections.propertyManagement && (
              <div className="ml-4 mt-1 space-y-1">
                <Link
                  to="/dashboard/properties/listed"
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 text-gray-400"
                >
                  <Home className="w-4 h-4" />
                  <span>Listed Property</span>
                </Link>
                <Link
                  to="/dashboard/properties/viewed"
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 text-gray-400"
                >
                  <Eye className="w-4 h-4" />
                  <span>Viewed Property</span>
                </Link>
                <Link
                  to="/dashboard/properties/sold"
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 text-gray-400"
                >
                  <HomeIcon className="w-4 h-4" />
                  <span>Sold Property</span>
                </Link>
                <Link
                  to="/dashboard/properties/new"
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 text-gray-400"
                >
                  <Plus className="w-4 h-4" />
                  <span>New property</span>
                </Link>
              </div>
            )}
          </div>

          {/* Transaction */}
          <div>
            <button
              onClick={() => toggleSection('transaction')}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 text-gray-300"
            >
              <span className="text-xs font-semibold uppercase">TRANSACTION</span>
              {expandedSections.transaction ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            {expandedSections.transaction && (
              <div className="ml-4 mt-1 space-y-1">
                <Link
                  to="/dashboard/transactions/receipts"
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 text-gray-400"
                >
                  <Receipt className="w-4 h-4" />
                  <span>Receipt</span>
                </Link>
                <Link
                  to="/dashboard/transactions/payments"
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 text-gray-400"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Payments</span>
                </Link>
              </div>
            )}
          </div>

          {/* Announcement */}
          <Link
            to="/dashboard/announcements"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300"
          >
            <Megaphone className="w-5 h-5" />
            <span>ANNOUNCEMENT</span>
          </Link>

          {/* Setting */}
          <Link
            to="/dashboard/settings"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300"
          >
            <Settings className="w-5 h-5" />
            <span>SETTING</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Enter keyword"
                className="pl-10 w-64 border-gray-300"
              />
            </div>
            <div className="relative">
              <Bell className="w-6 h-6 text-gray-600 cursor-pointer" />
              <Badge className="absolute -top-1 -right-1 bg-green-500 text-white text-xs w-5 h-5 flex items-center justify-center p-0">
                6
              </Badge>
            </div>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
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
        </main>
      </div>
    </div>
  )
}
