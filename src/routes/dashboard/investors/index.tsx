import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Search,
  Filter,
  Calendar,
  List,
  Grid,
  MoreVertical,
  Plus,
  ChevronDown,
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import { DropdownMenu, DropdownMenuItem } from '@/components/ui/DropdownMenu'

export const Route = createFileRoute('/dashboard/investors/')({
  component: InvestorsPage,
})

const investors = [
  {
    id: 'CUS-83927XJ',
    name: 'Emeka Okafor',
    phone: '+234 803 456 7890',
    email: 'emeka@gmail.com',
    location: '12, Allen Avenue, Ikeja, Lagos',
    dateJoined: '22/5/2009',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emeka',
  },
  {
    id: 'ACC-10294QW',
    name: 'Aisha Bello',
    phone: '+234 706 123 4567',
    email: 'belloaisha@yahoo.com',
    location: '5, Garki Street, Area 11, Abuja',
    dateJoined: '22/5/2011',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha',
  },
  {
    id: 'USR-55982LM',
    name: 'Tunde Adeyemi',
    phone: '+234 812 987 6543',
    email: 'tundeade@outlook.com',
    location: '22, Aba Road, Port Harcourt',
    dateJoined: '25/5/2011',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tunde',
  },
  {
    id: 'KHST-87421ZP',
    name: 'Fatima Danjuma',
    phone: '+234 905 678 4321',
    email: 'fatjuma@mail.com',
    location: '10, Ring Road, Ibadan, Oyo',
    dateJoined: '22/5/2012',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima',
  },
  {
    id: 'B2B-44678NV',
    name: 'Chinedu Eze',
    phone: '+234 809 234 5678',
    email: 'chieze@gmail.com',
    location: '7, Ogui Road, Enugu',
    dateJoined: '22/5/2012',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chinedu',
  },
  {
    id: 'CLI-99037YT',
    name: 'Abubakar Sani',
    phone: '+234 701 876 5432',
    email: 'bubakasani@ymail.com',
    location: '18, Sabo Market Road, Yaba',
    dateJoined: '30/5/2009',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Abubakar',
  },
  {
    id: 'ORD-72854XD',
    name: 'Funke Ogunleye',
    phone: '+234 816 345 6789',
    email: 'funkeogun@live.com',
    location: '9, New Layout, Owerri, Imo',
    dateJoined: '22/5/2015',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Funke',
  },
  {
    id: 'MEM-67321AB',
    name: 'Ifeanyi Nwosu',
    phone: '+234 912 567 8901',
    email: 'inwosu@gmail.com',
    location: 'Iwo Road, Ibadan, Oyo',
    dateJoined: '28/5/2016',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ifeanyi',
  },
]

function InvestorsPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')

  const filteredInvestors = investors.filter(
    (investor) =>
      investor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investor.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investor.phone.includes(searchQuery)
  )

  return (
    <DashboardLayout title="Super Admin Dashboard" subtitle="Investors">
      {/* Toolbar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4 mb-4 md:mb-6">
        <div className="flex flex-col gap-3 md:gap-4">
          {/* View Toggle */}
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 md:p-2 transition-colors ${
                  viewMode === 'list'
                    ? 'bg-[var(--color-orange)] text-white'
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <List className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 md:p-2 transition-colors border-l border-gray-300 ${
                  viewMode === 'grid'
                    ? 'bg-[var(--color-orange)] text-white'
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <Grid className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </button>
            </div>
          </div>

          {/* Search and Filters */}
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
                  Action
                  <ChevronDown className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </Button>
              }
            >
              <DropdownMenuItem>Export</DropdownMenuItem>
              <DropdownMenuItem>Import</DropdownMenuItem>
              <DropdownMenuItem>Delete Selected</DropdownMenuItem>
            </DropdownMenu>
            <Button variant="primary" size="sm" className="gap-2 text-xs md:text-sm">
              <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Add Investors</span>
              <span className="sm:hidden">Add</span>
              <ChevronDown className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Investors Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          {filteredInvestors.map((investor) => (
            <div
              key={investor.id}
              className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-xl hover:border-[var(--color-orange)]/30 transition-all duration-300 relative group"
            >
              {/* Three Dots Menu */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu
                  trigger={
                    <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>
                  }
                >
                  <DropdownMenuItem
                    onClick={() =>
                      navigate({
                        to: '/dashboard/investors/$investorId',
                        params: { investorId: investor.id },
                      })
                    }
                  >
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenu>
              </div>

              {/* Profile Picture */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <Avatar className="w-24 h-24 ring-4 ring-gray-100 group-hover:ring-[var(--color-orange)]/20 transition-all duration-300">
                    <AvatarImage src={investor.avatar} alt={investor.name} className="object-cover" />
                    <AvatarFallback className="text-lg">
                      {investor.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>

              {/* Investor Name */}
              <h3 className="text-center font-bold text-gray-900 mb-1 text-base">{investor.name}</h3>
              <p className="text-center text-xs text-gray-500 mb-2 font-medium">{investor.id}</p>
              <p className="text-center text-xs text-gray-400 mb-4">Joined: {investor.dateJoined}</p>

              {/* Phone */}
              <div className="flex items-center gap-2.5 mb-3 bg-gray-50 rounded-lg p-2.5 group-hover:bg-orange-50/50 transition-colors">
                <div className="p-1.5 bg-green-100 rounded-lg">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-700 truncate font-medium">{investor.phone}</span>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2.5 mb-3 bg-gray-50 rounded-lg p-2.5 group-hover:bg-orange-50/50 transition-colors">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-700 truncate font-medium">{investor.email}</span>
              </div>

              {/* Location */}
              <div className="flex items-start gap-2.5 bg-gray-50 rounded-lg p-2.5 group-hover:bg-orange-50/50 transition-colors">
                <div className="p-1.5 bg-purple-100 rounded-lg flex-shrink-0">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-700 font-medium line-clamp-2">{investor.location}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-xs md:text-sm whitespace-nowrap">Profile</TableHead>
                  <TableHead className="font-semibold text-xs md:text-sm whitespace-nowrap hidden md:table-cell">Investors ID</TableHead>
                  <TableHead className="font-semibold text-xs md:text-sm whitespace-nowrap hidden lg:table-cell">Phone Number</TableHead>
                  <TableHead className="font-semibold text-xs md:text-sm whitespace-nowrap hidden lg:table-cell">Email Address</TableHead>
                  <TableHead className="font-semibold text-xs md:text-sm whitespace-nowrap hidden xl:table-cell">Location</TableHead>
                  <TableHead className="font-semibold text-xs md:text-sm whitespace-nowrap hidden md:table-cell">Date Joined</TableHead>
                  <TableHead className="font-semibold text-xs md:text-sm w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvestors.map((investor) => (
                  <TableRow key={investor.id}>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2 md:gap-3">
                        <Avatar className="w-8 h-8 md:w-10 md:h-10">
                          <AvatarImage src={investor.avatar} alt={investor.name} />
                          <AvatarFallback className="text-xs">
                            {investor.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 text-xs md:text-sm truncate">{investor.name}</div>
                          <div className="text-xs text-gray-500 md:hidden">{investor.id}</div>
                          <div className="text-xs text-gray-500 md:hidden">{investor.phone}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600 text-xs md:text-sm hidden md:table-cell">{investor.id}</TableCell>
                    <TableCell className="text-gray-600 text-xs md:text-sm hidden lg:table-cell">{investor.phone}</TableCell>
                    <TableCell className="text-gray-600 text-xs md:text-sm hidden lg:table-cell truncate max-w-[200px]">{investor.email}</TableCell>
                    <TableCell className="text-gray-600 text-xs md:text-sm hidden xl:table-cell truncate max-w-[200px]">{investor.location}</TableCell>
                    <TableCell className="text-gray-600 text-xs md:text-sm hidden md:table-cell">{investor.dateJoined}</TableCell>
                    <TableCell>
                      <DropdownMenu
                        trigger={
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                          </button>
                        }
                      >
                        <DropdownMenuItem
                          onClick={() =>
                            navigate({
                              to: '/dashboard/investors/$investorId',
                              params: { investorId: investor.id },
                            })
                          }
                        >
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

