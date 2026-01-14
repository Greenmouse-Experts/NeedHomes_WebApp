import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { MoreVertical } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/Button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'
import { DropdownMenu, DropdownMenuItem } from '@/components/ui/DropdownMenu'

export const Route = createFileRoute('/dashboard/investors/$investorId')({
  component: InvestorDetailsPage,
})

// Dummy investor data
const investorsData = {
  'CUS-83927XJ': {
    id: 'CUS-83927XJ',
    name: 'Emeka Okafor',
    phone: '+234 803 456 7890',
    email: 'emeka@gmail.com',
    location: 'Lagos',
    dateJoined: '22/5/2009',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emeka',
    properties: [
      {
        sku: 'CUS-83927XJ',
        description: '4BR Apartment, 10, Adeniji Street, Lagos',
        package: 'Outright',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=100&h=100&fit=crop',
        price: 'N 10,000,000',
        quantity: 10,
        status: 'On-going',
      },
      {
        sku: 'CUS-83928XJ',
        description: '3BR Apartment, 15, Victoria Island, Lagos',
        package: 'Installment',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=100&h=100&fit=crop',
        price: 'N 8,500,000',
        quantity: 5,
        status: 'Completed',
      },
    ],
  },
  'ACC-10294QW': {
    id: 'ACC-10294QW',
    name: 'Aisha Bello',
    phone: '+234 706 123 4567',
    email: 'belloaisha@yahoo.com',
    location: 'Abuja',
    dateJoined: '22/5/2011',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha',
    properties: [
      {
        sku: 'ACC-10294QW',
        description: '5BR Duplex, 20, Garki Street, Abuja',
        package: 'Outright',
        image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=100&h=100&fit=crop',
        price: 'N 15,000,000',
        quantity: 8,
        status: 'On-going',
      },
    ],
  },
  'USR-55982LM': {
    id: 'USR-55982LM',
    name: 'Tunde Adeyemi',
    phone: '+234 812 987 6543',
    email: 'tundeade@outlook.com',
    location: 'Port Harcourt',
    dateJoined: '25/5/2011',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tunde',
    properties: [
      {
        sku: 'USR-55982LM',
        description: '4BR Apartment, 22, Aba Road, Port Harcourt',
        package: 'Outright',
        image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=100&h=100&fit=crop',
        price: 'N 9,200,000',
        quantity: 6,
        status: 'Completed',
      },
    ],
  },
  'KHST-87421ZP': {
    id: 'KHST-87421ZP',
    name: 'Fatima Danjuma',
    phone: '+234 905 678 4321',
    email: 'fatjuma@mail.com',
    location: 'Ibadan, Oyo',
    dateJoined: '22/5/2012',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima',
    properties: [
      {
        sku: 'KHST-87421ZP',
        description: '3BR Apartment, 10, Ring Road, Ibadan',
        package: 'Outright',
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=100&h=100&fit=crop',
        price: 'N 7,500,000',
        quantity: 12,
        status: 'On-going',
      },
    ],
  },
  'B2B-44678NV': {
    id: 'B2B-44678NV',
    name: 'Chinedu Eze',
    phone: '+234 809 234 5678',
    email: 'chieze@gmail.com',
    location: 'Enugu',
    dateJoined: '22/5/2012',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chinedu',
    properties: [
      {
        sku: 'B2B-44678NV',
        description: '5BR Duplex, 7, Ogui Road, Enugu',
        package: 'Installment',
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=100&h=100&fit=crop',
        price: 'N 12,000,000',
        quantity: 7,
        status: 'Completed',
      },
    ],
  },
  'CLI-99037YT': {
    id: 'CLI-99037YT',
    name: 'Abubakar Sani',
    phone: '+234 701 876 5432',
    email: 'bubakasani@ymail.com',
    location: 'Yaba',
    dateJoined: '30/5/2009',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Abubakar',
    properties: [
      {
        sku: 'CLI-99037YT',
        description: '2BR Apartment, 18, Sabo Market Road, Yaba',
        package: 'Outright',
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=100&h=100&fit=crop',
        price: 'N 6,000,000',
        quantity: 15,
        status: 'On-going',
      },
    ],
  },
}

type PropertyTab = 'all' | 'completed' | 'uncompleted'

function InvestorDetailsPage() {
  const { investorId } = Route.useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<PropertyTab>('all')

  const investor = investorsData[investorId as keyof typeof investorsData]

  if (!investor) {
    return (
      <DashboardLayout title="Super Admin Dashboard" subtitle="Investor Details">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600">Investor not found</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate({ to: '/dashboard/investors' })}
          >
            Back to Investors
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  const filteredProperties = investor.properties.filter((property) => {
    if (activeTab === 'completed') return property.status === 'Completed'
    if (activeTab === 'uncompleted') return property.status !== 'Completed'
    return true
  })

  return (
    <DashboardLayout title="Super Admin Dashboard" subtitle="Investors">
      {/* Investor Profile Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-700">Investors</h3>
          <Button variant="primary" size="sm">
            KYC: Approved
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-xs whitespace-nowrap">Profile</TableHead>
                <TableHead className="font-semibold text-xs whitespace-nowrap">KYC</TableHead>
                <TableHead className="font-semibold text-xs whitespace-nowrap">Phone Number</TableHead>
                <TableHead className="font-semibold text-xs whitespace-nowrap">Email Address</TableHead>
                <TableHead className="font-semibold text-xs whitespace-nowrap">Location</TableHead>
                <TableHead className="font-semibold text-xs whitespace-nowrap">Date Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={investor.avatar} alt={investor.name} />
                      <AvatarFallback className="text-xs">
                        {investor.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="font-medium text-gray-900 text-sm">{investor.name}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-orange-500 text-sm font-medium">See KYC</span>
                </TableCell>
                <TableCell className="text-gray-600 text-sm">{investor.phone}</TableCell>
                <TableCell className="text-gray-600 text-sm">{investor.email}</TableCell>
                <TableCell className="text-gray-600 text-sm">{investor.location}</TableCell>
                <TableCell className="text-gray-600 text-sm">{investor.dateJoined}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Properties Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 md:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Investors</h3>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === 'all'
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              All Properties
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === 'completed'
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Completed Properties
            </button>
            <button
              onClick={() => setActiveTab('uncompleted')}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === 'uncompleted'
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Uncompleted Properties
            </button>
          </div>

          {/* Properties Table */}
          <div className="overflow-x-auto">
            {filteredProperties.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No properties found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-xs whitespace-nowrap">
                      SKU
                    </TableHead>
                    <TableHead className="font-semibold text-xs whitespace-nowrap">
                      Property Description
                    </TableHead>
                    <TableHead className="font-semibold text-xs whitespace-nowrap">
                      Package
                    </TableHead>
                    <TableHead className="font-semibold text-xs whitespace-nowrap">
                      Image
                    </TableHead>
                    <TableHead className="font-semibold text-xs whitespace-nowrap">
                      Price
                    </TableHead>
                    <TableHead className="font-semibold text-xs whitespace-nowrap">
                      Quantity
                    </TableHead>
                    <TableHead className="font-semibold text-xs whitespace-nowrap">
                      Status
                    </TableHead>
                    <TableHead className="font-semibold text-xs w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProperties.map((property, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-xs text-gray-600">
                        {property.sku}
                      </TableCell>
                      <TableCell className="text-xs text-gray-900 max-w-[240px]">
                        {property.description}
                      </TableCell>
                      <TableCell className="text-xs text-gray-600">
                        {property.package}
                      </TableCell>
                      <TableCell>
                        <img
                          src={property.image}
                          alt="Property"
                          className="w-12 h-12 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell className="text-xs text-gray-900 font-medium">
                        {property.price}
                      </TableCell>
                      <TableCell className="text-xs text-gray-600">
                        {property.quantity}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            property.status === 'Completed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {property.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu
                          trigger={
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <MoreVertical className="w-4 h-4 text-gray-400" />
                            </button>
                          }
                        >
                          <DropdownMenuItem>View Property</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
