import { createFileRoute } from '@tanstack/react-router'
import { Bell, Calendar, ArrowRight, Search } from 'lucide-react'
import { useRef, useState } from 'react'
import Modal, { type ModalHandle } from '@/components/modals/DialogModal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export const Route = createFileRoute('/investors/announcements')({
  component: RouteComponent,
})

const announcements = [
  {
    id: 1,
    title: 'New Investment Opportunity in Lekki',
    category: 'New Listing',
    date: 'Jan 26, 2025',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    summary: 'We are excited to announce a new co-development opportunity in the heart of Lekki Phase 1 with projected returns of 35%.',
    content: `
      <p>We are thrilled to bring you our latest high-yield investment opportunity located in the prime area of Lekki Phase 1. This 4-bedroom fully detached duplex project offers partners a unique chance to co-invest and earn significant returns.</p>
      <p class="mt-4"><strong>Key Highlights:</strong></p>
      <ul class="list-disc pl-5 mt-2 space-y-1">
        <li>Projected Return on Investment (ROI): 35%</li>
        <li>Duration: 18 Months</li>
        <li>Minimum Investment: N5,000,000</li>
        <li>Location: Lekki Phase 1, Lagos</li>
      </ul>
      <p class="mt-4">Construction is set to begin on February 1st, 2025. Don't miss out on this exclusive opportunity to grow your portfolio with NeedHomes.</p>
    `
  },
  {
    id: 2,
    title: 'Q1 2025 Market Update',
    category: 'Market Update',
    date: 'Jan 20, 2025',
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80',
    summary: 'Read our latest analysis on the real estate market trends in Lagos and what to expect in the coming months.',
    content: `
      <p>The first quarter of 2025 has started with a strong upward trend in the Lagos real estate market. Demand for residential properties in the Island axis continues to outstrip supply, driving rental yields higher.</p>
      <p class="mt-4">Our analysts predict a 15% increase in property values by the end of Q2, making now an ideal time to enter the market. We are also seeing a shift towards sustainable and eco-friendly housing, which attracts premium tenants.</p>
      <p class="mt-4">Stay tuned for our detailed report which will be sent to your email shortly.</p>
    `
  },
  {
    id: 3,
    title: 'Platform Maintenance Notice',
    category: 'System',
    date: 'Jan 15, 2025',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    summary: 'Our platform will undergo scheduled maintenance to improve performance and security. Service will be interrupted briefly.',
    content: `
      <p>Dear Partners,</p>
      <p class="mt-2">To ensure we continue to provide you with the best possible service, our technical team will be conducting scheduled maintenance on the platform.</p>
      <p class="mt-4"><strong>Maintenance Window:</strong></p>
      <p>Date: Saturday, Jan 20th, 2025</p>
      <p>Time: 2:00 AM - 6:00 AM (WAT)</p>
      <p class="mt-4">During this time, the dashboard and investment portal will be temporarily unavailable. We apologize for any inconvenience this may cause and appreciate your understanding.</p>
    `
  },
  {
    id: 4,
    title: 'Partner Appreciation Event',
    category: 'Events',
    date: 'Jan 10, 2025',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80',
    summary: 'Join us for our annual partner appreciation dinner at the Eko Hotel & Suites. RSVP required.',
    content: `
      <p>We are delighted to invite you to our Annual Partner Appreciation Dinner. It has been a phenomenal year, and we couldn't have achieved our milestones without your support.</p>
      <p class="mt-4"><strong>Event Details:</strong></p>
      <p>Venue: Eko Hotel & Suites, Victoria Island</p>
      <p>Date: Friday, Feb 14th, 2025</p>
      <p>Time: 6:00 PM Red Carpet</p>
      <p class="mt-4">Please click the RSVP link in your email to confirm your attendance. We look forward to celebrating with you!</p>
    `
  },
  {
    id: 5,
    title: 'Important Policy Update',
    category: 'Policy',
    date: 'Jan 05, 2025',
    summary: 'We have updated our terms of service regarding investment withdrawals. Please review the changes to ensure compliance.',
    content: `
      <p>We have made some important updates to our Terms of Service, specifically concerning the withdrawal of investment capital and dividends.</p>
      <p class="mt-4">Effective immediately, all withdrawal requests will be processed within 24 hours (previously 48 hours). Additionally, we have introduced a new automated payout feature for dividends.</p>
      <p class="mt-4">Please log in to your dashboard to review the updated terms in the Settings section. Your continued use of the platform constitutes your agreement to these changes.</p>
    `
  },
]

function RouteComponent() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<typeof announcements[0] | null>(null)
  const modalRef = useRef<ModalHandle>(null)

  const handleReadMore = (announcement: typeof announcements[0]) => {
    setSelectedAnnouncement(announcement)
    modalRef.current?.open()
  }

  const filteredAnnouncements = announcements.filter(a =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.summary.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Announcements</h1>
          <p className="text-sm text-gray-500 mt-1">Latest news and updates from NeedHomes</p>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
          </button>
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full"></div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="w-full max-w-md relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search announcements..."
          className="pl-9 bg-white shadow-sm border-gray-200"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAnnouncements.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
            <div className={`h-48 overflow-hidden relative group ${!item.image ? 'bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center' : ''}`}>
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                    <Bell className="w-8 h-8 text-white/80" />
                  </div>
                </div>
              )}
              <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm">
                  {item.category}
                </span>
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                <Calendar className="w-3 h-3" />
                {item.date}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 hover:text-[var(--color-orange)] transition-colors cursor-pointer" onClick={() => handleReadMore(item)}>
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                {item.summary}
              </p>
              <div className="mt-auto">
                <Button
                  variant="ghost"
                  className="p-0 h-auto text-[var(--color-orange)] hover:text-[var(--color-orange-dark)] hover:bg-transparent flex items-center gap-1 text-sm font-medium"
                  onClick={() => handleReadMore(item)}
                >
                  Read More <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Announcement Detail Modal */}
      <Modal ref={modalRef} title={selectedAnnouncement?.category}>
        {selectedAnnouncement && (
          <div className="space-y-6">
            {/* Image */}
            <div className={`w-full h-64 rounded-xl overflow-hidden ${!selectedAnnouncement.image ? 'bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center' : ''}`}>
              {selectedAnnouncement.image ? (
                <img
                  src={selectedAnnouncement.image}
                  alt={selectedAnnouncement.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Bell className="w-16 h-16 text-white/50" />
              )}
            </div>

            {/* Header Info */}
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <Calendar className="w-4 h-4" />
                {selectedAnnouncement.date}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedAnnouncement.title}</h2>
            </div>

            {/* Content */}
            <div
              className="prose prose-orange max-w-none text-gray-600"
              dangerouslySetInnerHTML={{ __html: selectedAnnouncement.content }}
            />
          </div>
        )}
      </Modal>
    </div>
  )
}
