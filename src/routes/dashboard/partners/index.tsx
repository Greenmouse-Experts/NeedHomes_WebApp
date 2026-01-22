import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Search,
  Filter,
  Trash2,
  List,
  Grid,
  MoreVertical,
  Plus,
  ChevronDown,
  Phone,
  Mail,
} from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import { DropdownMenu, DropdownMenuItem } from '@/components/ui/DropdownMenu'

export const Route = createFileRoute('/dashboard/partners/')({
  component: PartnersPage,
})

const partners = [
  {
    id: '1',
    name: 'Benson Omotayo',
    phone: '+234 123 456 7890',
    email: 'stitchesncuts@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces',
  },
  {
    id: '2',
    name: 'Somto Chidinma',
    phone: '+234 123 456 7891',
    email: 'somtochidinma@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces',
  },
  {
    id: '3',
    name: 'Badmus King',
    phone: '+234 123 456 7892',
    email: 'badmusking@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces',
  },
  {
    id: '4',
    name: 'Adebayo Peters',
    phone: '+234 123 456 7893',
    email: 'adebayopeters@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=faces',
  },
  {
    id: '5',
    name: 'Sammie Chukwuma',
    phone: '+234 123 456 7894',
    email: 'sammiechukwuma@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=faces',
  },
  {
    id: '6',
    name: 'Emeka Okafor',
    phone: '+234 803 456 7890',
    email: 'emeka@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=200&h=200&fit=crop&crop=faces',
  },
  {
    id: '7',
    name: 'Aisha Bello',
    phone: '+234 706 123 4567',
    email: 'belloaisha@yahoo.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=faces',
  },
  {
    id: '8',
    name: 'Tunde Adeyemi',
    phone: '+234 812 987 6543',
    email: 'tundeade@outlook.com',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=faces',
  },
  {
    id: '9',
    name: 'Fatima Danjuma',
    phone: '+234 905 678 4321',
    email: 'fatjuma@mail.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces',
  },
  {
    id: '10',
    name: 'Chinedu Eze',
    phone: '+234 809 234 5678',
    email: 'chieze@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&h=200&fit=crop&crop=faces',
  },
  {
    id: '11',
    name: 'Abubakar Sani',
    phone: '+234 701 876 5432',
    email: 'bubakasani@ymail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces',
  },
  {
    id: '12',
    name: 'Funke Ogunleye',
    phone: '+234 816 345 6789',
    email: 'funkeogun@live.com',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=faces',
  },
  {
    id: '13',
    name: 'Ifeanyi Nwosu',
    phone: '+234 912 567 8901',
    email: 'inwosu@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=200&h=200&fit=crop&crop=faces',
  },
  {
    id: '14',
    name: 'Oluwaseun Adebayo',
    phone: '+234 815 234 5678',
    email: 'oluwaseun@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=200&h=200&fit=crop&crop=faces',
  },
  {
    id: '15',
    name: 'Chiamaka Okoro',
    phone: '+234 907 654 3210',
    email: 'chiamakaokoro@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=faces',
  },
]

function PartnersPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredPartners = partners.filter(
    (partner) =>
      partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.phone.includes(searchQuery)
  )

  return (
    <DashboardLayout title="Super Admin Dashboard" subtitle="Partners">
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
              <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
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
              <span className="hidden sm:inline">Add a New Partners</span>
              <span className="sm:hidden">Add Partner</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Partners Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          {filteredPartners.map((partner) => (
            <div
              key={partner.id}
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
                        to: '/dashboard/partners/$partnerId',
                        params: { partnerId: partner.id },
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
                    <AvatarImage src={partner.avatar} alt={partner.name} className="object-cover" />
                  </Avatar>
                </div>
              </div>

              {/* Partner Name */}
              <h3 className="text-center font-bold text-gray-900 mb-1 text-base">{partner.name}</h3>
              <p className="text-center text-xs text-gray-500 mb-4 font-medium">Partners</p>

              {/* Phone */}
              <div className="flex items-center gap-2.5 mb-3 bg-gray-50 rounded-lg p-2.5 group-hover:bg-orange-50/50 transition-colors">
                <div className="p-1.5 bg-green-100 rounded-lg">
                  <Phone className="w-4 h-4 text-green-600 flex-shrink-0" />
                </div>
                <span className="text-sm text-gray-700 truncate font-medium">{partner.phone}</span>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2.5 bg-gray-50 rounded-lg p-2.5 group-hover:bg-orange-50/50 transition-colors">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <Mail className="w-4 h-4 text-blue-600 flex-shrink-0" />
                </div>
                <span className="text-sm text-gray-700 truncate font-medium">{partner.email}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Profile
                  </th>
                  <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden md:table-cell">
                    Phone Number
                  </th>
                  <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden lg:table-cell">
                    Email Address
                  </th>
                  <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-10"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPartners.map((partner) => (
                  <tr key={partner.id} className="hover:bg-gray-50">
                    <td className="px-3 md:px-4 py-3 md:py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 md:gap-3">
                        <Avatar className="w-8 h-8 md:w-10 md:h-10">
                          <AvatarImage src={partner.avatar} alt={partner.name} className="object-cover" />
                        </Avatar>
                      </div>
                    </td>
                    <td className="px-3 md:px-4 py-3 md:py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900 text-xs md:text-sm">{partner.name}</div>
                        <div className="text-[10px] md:text-xs text-gray-500">Partners</div>
                        <div className="text-xs text-gray-600 md:hidden mt-1">{partner.phone}</div>
                        <div className="text-xs text-gray-600 md:hidden">{partner.email}</div>
                      </div>
                    </td>
                    <td className="px-3 md:px-4 py-3 md:py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="flex items-center gap-2 md:gap-2.5">
                        <div className="p-1 md:p-1.5 bg-green-100 rounded-lg">
                          <Phone className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-600" />
                        </div>
                        <span className="text-xs md:text-sm text-gray-700 font-medium">{partner.phone}</span>
                      </div>
                    </td>
                    <td className="px-3 md:px-4 py-3 md:py-4 whitespace-nowrap hidden lg:table-cell">
                      <div className="flex items-center gap-2 md:gap-2.5">
                        <div className="p-1 md:p-1.5 bg-blue-100 rounded-lg">
                          <Mail className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-600" />
                        </div>
                        <span className="text-xs md:text-sm text-gray-700 font-medium truncate max-w-[200px]">{partner.email}</span>
                      </div>
                    </td>
                    <td className="px-3 md:px-4 py-3 md:py-4 whitespace-nowrap">
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
                              to: '/dashboard/partners/$partnerId',
                              params: { partnerId: partner.id },
                            })
                          }
                        >
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredPartners.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No partners found matching your search.</p>
        </div>
      )}
    </DashboardLayout>
  )
}
