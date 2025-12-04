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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:flex-initial lg:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar className="w-4 h-4" />
              Filter
            </Button>
            <DropdownMenu
              trigger={
                <Button variant="outline" size="sm" className="gap-2">
                  Action
                  <ChevronDown className="w-4 h-4" />
                </Button>
              }
            >
              <DropdownMenuItem>Export</DropdownMenuItem>
              <DropdownMenuItem>Import</DropdownMenuItem>
              <DropdownMenuItem>Delete Selected</DropdownMenuItem>
            </DropdownMenu>
          </div>

          {/* View Toggle and Add Button */}
          <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button className="p-2 hover:bg-gray-100 border-r border-gray-300">
                <List className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100">
                <Grid className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <Button variant="primary" size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Investors
              <ChevronDown className="w-4 h-4" />
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
                <TableHead className="font-semibold">Profile</TableHead>
                <TableHead className="font-semibold">Investors ID</TableHead>
                <TableHead className="font-semibold">Phone Number</TableHead>
                <TableHead className="font-semibold">Email Address</TableHead>
                <TableHead className="font-semibold">Location</TableHead>
                <TableHead className="font-semibold">Date Joined</TableHead>
                <TableHead className="font-semibold w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvestors.map((investor) => (
                <TableRow key={investor.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={investor.avatar} alt={investor.name} />
                        <AvatarFallback>
                          {investor.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-gray-900">{investor.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">{investor.id}</TableCell>
                  <TableCell className="text-gray-600">{investor.phone}</TableCell>
                  <TableCell className="text-gray-600">{investor.email}</TableCell>
                  <TableCell className="text-gray-600">{investor.location}</TableCell>
                  <TableCell className="text-gray-600">{investor.dateJoined}</TableCell>
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

