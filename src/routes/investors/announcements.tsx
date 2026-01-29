import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  Bell,
  Calendar,
  Clock,
  Eye,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react'

export const Route = createFileRoute('/investors/announcements')({
  component: RouteComponent,
})

// Extended announcements with read status and full content
const initialAnnouncements = [
  {
    id: 1,
    subject: 'New Investment Opportunity in Lekki',
    category: 'New Listing',
    created_at: '2025-01-26T10:30:00Z',
    message: `We are thrilled to bring you our latest high-yield investment opportunity located in the prime area of Lekki Phase 1. This 4-bedroom fully detached duplex project offers partners a unique chance to co-invest and earn significant returns.

Key Highlights:
• Projected Return on Investment (ROI): 35%
• Duration: 18 Months
• Minimum Investment: ₦5,000,000
• Location: Lekki Phase 1, Lagos

Construction is set to begin on February 1st, 2025. Don't miss out on this exclusive opportunity to grow your portfolio with NeedHomes.`,
    read: false,
  },
  {
    id: 2,
    subject: 'Q1 2025 Market Update',
    category: 'Market Update',
    created_at: '2025-01-20T14:15:00Z',
    message: `The first quarter of 2025 has started with a strong upward trend in the Lagos real estate market. Demand for residential properties in the Island axis continues to outstrip supply, driving rental yields higher.

Our analysts predict a 15% increase in property values by the end of Q2, making now an ideal time to enter the market. We are also seeing a shift towards sustainable and eco-friendly housing, which attracts premium tenants.

Stay tuned for our detailed report which will be sent to your email shortly.`,
    read: false,
  },
  {
    id: 3,
    subject: 'Platform Maintenance Notice',
    category: 'System',
    created_at: '2025-01-15T09:00:00Z',
    message: `Dear Partners,

To ensure we continue to provide you with the best possible service, our technical team will be conducting scheduled maintenance on the platform.

Maintenance Window:
Date: Saturday, Jan 20th, 2025
Time: 2:00 AM - 6:00 AM (WAT)

During this time, the dashboard and investment portal will be temporarily unavailable. We apologize for any inconvenience this may cause and appreciate your understanding.`,
    read: true,
  },
  {
    id: 4,
    subject: 'Partner Appreciation Event',
    category: 'Events',
    created_at: '2025-01-10T16:45:00Z',
    message: `We are delighted to invite you to our Annual Partner Appreciation Dinner. It has been a phenomenal year, and we couldn't have achieved our milestones without your support.

Event Details:
Venue: Eko Hotel & Suites, Victoria Island
Date: Friday, Feb 14th, 2025
Time: 6:00 PM Red Carpet

Please click the RSVP link in your email to confirm your attendance. We look forward to celebrating with you!`,
    read: true,
  },
  {
    id: 5,
    subject: 'Important Policy Update',
    category: 'Policy',
    created_at: '2025-01-05T11:20:00Z',
    message: `We have made some important updates to our Terms of Service, specifically concerning the withdrawal of investment capital and dividends.

Effective immediately, all withdrawal requests will be processed within 24 hours (previously 48 hours). Additionally, we have introduced a new automated payout feature for dividends.

Please log in to your dashboard to review the updated terms in the Settings section. Your continued use of the platform constitutes your agreement to these changes.`,
    read: false,
  },
  {
    id: 6,
    subject: 'New Partnership with Green Developers',
    category: 'Partnership',
    created_at: '2024-12-28T08:00:00Z',
    message: `We are excited to announce our strategic partnership with Green Developers, one of Nigeria's leading sustainable construction firms.

This partnership will enable us to offer more eco-friendly investment opportunities with enhanced returns. Together, we'll be developing solar-powered homes and energy-efficient office complexes across Lagos and Abuja.

Watch this space for upcoming green investment opportunities!`,
    read: true,
  },
]

type Announcement = typeof initialAnnouncements[0]

function RouteComponent() {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements)
  const [isLoading, setIsLoading] = useState(true)
  const [markingAsRead, setMarkingAsRead] = useState<number | null>(null)

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  // Helper: check if announcement is read
  const isAnnouncementRead = (announcement: Announcement) => {
    return announcement.read === true
  }

  // Mark as read handler (simulated)
  const handleMarkAsRead = async (announcement: Announcement) => {
    if (isAnnouncementRead(announcement)) return

    setMarkingAsRead(announcement.id)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    setAnnouncements(prev =>
      prev.map(a => (a.id === announcement.id ? { ...a, read: true } : a))
    )

    if (selectedAnnouncement?.id === announcement.id) {
      setSelectedAnnouncement({ ...announcement, read: true })
    }

    setMarkingAsRead(null)
  }

  const handleAnnouncementClick = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement)
    if (!isAnnouncementRead(announcement)) {
      handleMarkAsRead(announcement)
    }
  }

  const handleBackToList = () => {
    setSelectedAnnouncement(null)
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    } catch {
      return 'Invalid Date'
    }
  }

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    } catch {
      return 'Invalid Time'
    }
  }

  const isMarkingAsRead = (announcementId: number) => {
    return markingAsRead === announcementId
  }

  // --- Single Announcement View (Mobile Responsive) ---
  if (selectedAnnouncement) {
    const read = isAnnouncementRead(selectedAnnouncement)
    const isMarking = isMarkingAsRead(selectedAnnouncement.id)

    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleBackToList}
            className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 mb-6 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Announcements</span>
          </button>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header: Flex Col on Mobile, Row on Desktop */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 sm:p-6 text-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Bell className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full whitespace-nowrap">
                    {selectedAnnouncement.category}
                  </span>
                </div>

                {read ? (
                  <span className="flex items-center text-green-200 text-sm font-semibold">
                    <CheckCircle className="mr-2" /> Read
                  </span>
                ) : (
                  <button
                    className="w-full sm:w-auto cursor-pointer px-4 py-2 bg-white/20 rounded-lg text-sm font-semibold text-white hover:bg-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isMarking}
                    onClick={() => handleMarkAsRead(selectedAnnouncement)}
                  >
                    {isMarking ? (
                      <span className="flex items-center justify-center">
                        <span className="animate-spin mr-2 h-4 w-4 border-b-2 border-white rounded-full"></span>
                        Marking...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <CheckCircle className="mr-2" />
                        Mark as Read
                      </span>
                    )}
                  </button>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl font-bold mb-2 break-words">
                {selectedAnnouncement.subject}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(selectedAnnouncement.created_at)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatTime(selectedAnnouncement.created_at)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed text-base sm:text-lg whitespace-pre-wrap">
                  {selectedAnnouncement.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // --- Announcements List View (Mobile Responsive) ---
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Bell className="h-6 w-6 text-orange-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Announcements
            </h1>
          </div>
          <p className="text-gray-600 text-sm sm:text-base">
            Stay updated with important information.
          </p>
        </div>

        {isLoading && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-orange-200 p-4">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-600"></div>
                <div className="text-sm text-gray-600">
                  Loading announcements...
                </div>
              </div>
            </div>
            {/* Skeletons */}
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 animate-pulse"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && announcements.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Bell className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Announcements Yet
            </h3>
            <p className="text-gray-600">
              You're all caught up! New announcements will appear here when
              available.
            </p>
          </div>
        )}

        {!isLoading && announcements.length > 0 && (
          <div className="space-y-4">
            {announcements.map((announcement) => {
              const read = isAnnouncementRead(announcement)
              const isMarking = isMarkingAsRead(announcement.id)

              return (
                <div
                  key={announcement.id}
                  className={`bg-white rounded-xl border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-all cursor-pointer group relative ${read ? 'opacity-75' : ''
                    }`}
                  onClick={() => handleAnnouncementClick(announcement)}
                >
                  {/* Card Container: Stack vertical on mobile, row on desktop */}
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">

                    {/* Icon Section */}
                    <div className="flex-shrink-0 flex items-center justify-between w-full sm:w-auto">
                      <div
                        className={`w-12 h-12 ${read
                          ? 'bg-gray-400'
                          : 'bg-gradient-to-br from-orange-500 to-orange-600'
                          } rounded-lg flex items-center justify-center`}
                      >
                        <Bell className="h-6 w-6 text-white" />
                      </div>

                      {/* Mobile-only Read Badge */}
                      {read && (
                        <div className="sm:hidden bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Read
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        {/* Text Info */}
                        <div className="flex-1">
                          <h3
                            className={`text-lg font-semibold ${read ? 'text-gray-600' : 'text-gray-900'
                              } group-hover:text-orange-600 transition-colors pr-0 sm:pr-20`}
                          >
                            {announcement.subject}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-4 mt-1 mb-3 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(announcement.created_at)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatTime(announcement.created_at)}</span>
                            </div>
                          </div>
                          <p className="text-gray-600 line-clamp-2 text-sm sm:text-base">
                            {announcement.message}
                          </p>
                        </div>

                        {/* Actions Section: Bottom on mobile, Right on Desktop */}
                        <div className="mt-4 sm:mt-0 sm:ml-4 flex flex-row sm:flex-col justify-end sm:items-end gap-2 flex-shrink-0">
                          {!read && (
                            <button
                              className="cursor-pointer flex items-center px-3 py-1 bg-orange-50 text-orange-600 rounded-lg text-sm font-semibold hover:bg-orange-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={isMarking}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleMarkAsRead(announcement)
                              }}
                            >
                              {isMarking ? (
                                <span className="flex items-center">
                                  <span className="animate-spin mr-1 h-3 w-3 border-b-2 border-orange-600 rounded-full"></span>
                                  Marking...
                                </span>
                              ) : (
                                <>
                                  <CheckCircle className="mr-1 h-4 w-4" />
                                  Mark as Read
                                </>
                              )}
                            </button>
                          )}

                          {/* Eye Icon: Desktop only */}
                          <div className="hidden sm:block p-2 text-gray-400 group-hover:text-orange-600 group-hover:bg-orange-50 rounded-lg transition-colors">
                            <Eye className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Read Badge (Absolute position) */}
                  {read && (
                    <div className="hidden sm:flex absolute top-4 right-4 bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-semibold items-center">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Read
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
