import { createFileRoute } from '@tanstack/react-router'
import { Bell, Check, Clock, Info, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/partners/notifications')({
    component: RouteComponent,
})

type NotificationType = 'alert' | 'update' | 'success' | 'info'

interface Notification {
    id: string
    title: string
    message: string
    type: NotificationType
    date: string
    isRead: boolean
}

const mockNotifications: Notification[] = [
    {
        id: '1',
        title: 'Investment Successful',
        message: 'Your investment of N5,000,000 in "4BR Fully Detached Duplex" has been successfully processed.',
        type: 'success',
        date: '2 hours ago',
        isRead: false,
    },
    {
        id: '2',
        title: 'New Property Alert',
        message: 'A new property matching your preferences has been listed in Lekki Phase 1.',
        type: 'info',
        date: '5 hours ago',
        isRead: false,
    },
    {
        id: '3',
        title: 'KYC Verification Required',
        message: 'Please update your identification document to complete your KYC verification.',
        type: 'alert',
        date: '1 day ago',
        isRead: true,
    },
    {
        id: '4',
        title: 'System Maintenance',
        message: 'Scheduled maintenance will occur on Saturday, Jan 28th from 2:00 AM to 4:00 AM.',
        type: 'update',
        date: '2 days ago',
        isRead: true,
    },
    {
        id: '5',
        title: 'Dividend Payout',
        message: 'You have received a dividend payout of N250,000 from your co-development investment.',
        type: 'success',
        date: '3 days ago',
        isRead: true,
    },
]

function RouteComponent() {
    const [filter, setFilter] = useState<'all' | 'unread'>('all')
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)

    const handleMarkAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
        )
    }

    const handleMarkAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    }

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'unread') return !n.isRead
        return true
    })

    const getIcon = (type: NotificationType) => {
        switch (type) {
            case 'alert':
                return <AlertTriangle className="w-5 h-5 text-red-500" />
            case 'success':
                return <CheckCircle2 className="w-5 h-5 text-green-500" />
            case 'update':
                return <Clock className="w-5 h-5 text-blue-500" />
            case 'info':
            default:
                return <Info className="w-5 h-5 text-[var(--color-orange)]" />
        }
    }

    const getBgColor = (type: NotificationType) => {
        switch (type) {
            case 'alert':
                return 'bg-red-50'
            case 'success':
                return 'bg-green-50'
            case 'update':
                return 'bg-blue-50'
            case 'info':
            default:
                return 'bg-orange-50'
        }
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900">Notifications</h1>
                    <p className="text-sm text-gray-500 mt-1">Stay updated with your latest activities</p>
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                    <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Bell className="w-5 h-5 text-gray-600" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
                    </button>
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full"></div>
                </div>
            </header>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filter === 'all'
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter('unread')}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filter === 'unread'
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            Unread
                        </button>
                    </div>
                    <button
                        onClick={handleMarkAllAsRead}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--color-orange)] hover:bg-orange-50 rounded-lg transition-colors"
                    >
                        <Check className="w-4 h-4" />
                        Mark all as read
                    </button>
                </div>

                {/* List */}
                <div className="divide-y divide-gray-100">
                    {filteredNotifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            No notifications found.
                        </div>
                    ) : (
                        filteredNotifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-4 md:p-6 flex items-start gap-4 hover:bg-gray-50 transition-colors ${!notification.isRead ? 'bg-blue-50/30' : ''
                                    }`}
                            >
                                <div className={`p-2 rounded-full flex-shrink-0 ${getBgColor(notification.type)}`}>
                                    {getIcon(notification.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                                        <h3 className={`text-sm md:text-base font-semibold ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'
                                            }`}>
                                            {notification.title}
                                        </h3>
                                        <span className="text-xs text-gray-500 whitespace-nowrap flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {notification.date}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {notification.message}
                                    </p>
                                </div>
                                {!notification.isRead && (
                                    <button
                                        onClick={() => handleMarkAsRead(notification.id)}
                                        className="p-1 hover:bg-gray-200 rounded-full transition-colors self-center"
                                        title="Mark as read"
                                    >
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
