import { createFileRoute } from '@tanstack/react-router'
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

export const Route = createFileRoute('/dashboard/investors')({
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
  const [searchQuery, setSearchQuery] = useState('')

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
          </div>

          {/* View Toggle and Add Button */}
          <div className="flex items-center gap-2 w-full justify-between">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button className="p-1.5 md:p-2 hover:bg-gray-100 border-r border-gray-300">
                <List className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-600" />
              </button>
              <button className="p-1.5 md:p-2 hover:bg-gray-100">
                <Grid className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-600" />
              </button>
            </div>
            <Button variant="primary" size="sm" className="gap-2 text-xs md:text-sm">
              <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Add Investors</span>
              <span className="sm:hidden">Add</span>
              <ChevronDown className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
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
      </div>
    </DashboardLayout>
  )
}

