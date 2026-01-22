import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Bell,
  ChevronDown,
  Send,
  CheckCircle2,
} from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/Textarea'

export const Route = createFileRoute('/dashboard/announcements')({
  component: AnnouncementsPage,
})

const announcements = [
  {
    id: '1',
    message: 'Samuel Ogunde Lawrence have successfully invested in fully detached story building',
    timestamp: '3m Ago',
    read: true,
  },
  {
    id: '2',
    message: 'Samuel Ogunde Lawrence have successfully invested in fully detached story building',
    timestamp: '1 Hour Ago',
    read: true,
  },
  {
    id: '3',
    message: 'Samuel Ogunde Lawrence have successfully invested in fully detached story building',
    timestamp: '15 Hours Ago',
    read: true,
  },
  {
    id: '4',
    message: 'Amina Hassan have successfully invested in luxury apartment complex',
    timestamp: '2 Days Ago',
    read: true,
  },
  {
    id: '5',
    message: 'David Okonkwo have successfully invested in commercial property',
    timestamp: '6 Days Ago',
    read: true,
  },
  {
    id: '6',
    message: 'Grace Okafor have successfully invested in residential estate',
    timestamp: '1 Week Ago',
    read: false,
  },
  {
    id: '7',
    message: 'Michael Adeyemi have successfully invested in office building',
    timestamp: '3 Weeks Ago',
    read: true,
  },
  {
    id: '8',
    message: 'Fatima Danjuma have successfully invested in mixed-use development',
    timestamp: '3 Weeks Ago',
    read: true,
  },
  {
    id: '9',
    message: 'Chinedu Eze have successfully invested in industrial property',
    timestamp: '1 Month Ago',
    read: true,
  },
]

const userTypes = [
  { value: 'all', label: 'All Users' },
  { value: 'investors', label: 'Investors' },
  { value: 'partners', label: 'Partners' },
  { value: 'both', label: 'Investors & Partners' },
]

function AnnouncementsPage() {
  const [selectedUserType, setSelectedUserType] = useState('all')
  const [announcementText, setAnnouncementText] = useState('')

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle send notification logic here
    console.log('Sending notification:', { selectedUserType, announcementText })
    setAnnouncementText('')
  }

  return (
    <DashboardLayout title="Super Admin Dashboard" subtitle="Announcements">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Announcements List */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-4 md:p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg md:text-xl font-bold text-gray-900">Announcement</h2>
              <span className="text-xs md:text-sm text-gray-500 bg-white px-2 md:px-3 py-1 rounded-full border border-gray-200">
                {announcements.length} Total
              </span>
            </div>
          </div>
          
          <div className="overflow-y-auto flex-1 max-h-[calc(100vh-300px)]">
            <div className="divide-y divide-gray-100">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="p-3 md:p-5 hover:bg-gradient-to-r hover:from-orange-50/50 hover:to-transparent transition-all duration-200 relative group cursor-pointer"
                >
                  <div className="flex items-start gap-3 md:gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 ${
                        announcement.read 
                          ? 'bg-[var(--color-orange)]/10' 
                          : 'bg-[var(--color-orange)]'
                      }`}>
                        <Bell className={`w-5 h-5 md:w-6 md:h-6 ${
                          announcement.read 
                            ? 'text-[var(--color-orange)]' 
                            : 'text-white'
                        }`} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-relaxed mb-2 ${
                        announcement.read 
                          ? 'text-gray-700' 
                          : 'text-gray-900 font-medium'
                      }`}>
                        {announcement.message}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 font-medium">{announcement.timestamp}</span>
                        {!announcement.read && (
                          <span className="text-xs px-2 py-0.5 bg-[var(--color-orange)]/10 text-[var(--color-orange)] rounded-full font-medium">
                            New
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status Indicator */}
                    <div className="flex-shrink-0 pt-1">
                      {announcement.read ? (
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm"></div>
                      ) : (
                        <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-orange)] animate-pulse shadow-sm"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Send Notification Form */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 md:p-6">
          <div className="mb-4 md:mb-6 pb-3 md:pb-4 border-b border-gray-200">
            <div className="flex items-center gap-2 md:gap-3 mb-2">
              <div className="p-1.5 md:p-2 bg-[var(--color-orange)]/10 rounded-lg">
                <Send className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-orange)]" />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900">SEND NOTIFICATION</h2>
            </div>
            <p className="text-xs md:text-sm text-gray-500 ml-8 md:ml-11">Create and send announcements to users</p>
          </div>

          <form onSubmit={handleSendNotification} className="space-y-6">
            {/* User Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="userType" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                User Type
                <span className="text-red-500">*</span>
              </Label>
              <Select
                id="userType"
                options={userTypes}
                value={selectedUserType}
                onChange={(e) => setSelectedUserType(e.target.value)}
                className="w-full"
                required
              />
            </div>

            {/* Announcement Textarea */}
            <div className="space-y-2">
              <Label htmlFor="announcement" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                Announcement
                <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="announcement"
                placeholder="Type in your announcement..."
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                rows={10}
                className="resize-none min-h-[200px]"
                required
              />
              <p className="text-xs text-gray-500">
                {announcementText.length} characters
              </p>
            </div>

            {/* Send Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full gap-2 h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all"
              disabled={!announcementText.trim() || !selectedUserType}
            >
              <Send className="w-5 h-5" />
              Send Notification
            </Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
