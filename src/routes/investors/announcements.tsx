import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Bell,
  Calendar,
  Clock,
  Eye,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import apiClient, { type ApiResponseV2 } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";

export const Route = createFileRoute("/investors/announcements")({
  component: RouteComponent,
});

// Extended announcements with read status and full content

type Announcement = (typeof initialAnnouncements)[0];

function RouteComponent() {
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);

  type AnnouncementCreate = {
    id: string;
    content: string;
    target: "ALL_USERS";
    createdBy: string;
    createdAt: string;
    deletedAt: string | null;
  };
  const query = useQuery<ApiResponseV2<AnnouncementCreate>>({
    queryKey: ["announcements"],
    queryFn: async () => {
      const response = await apiClient.get("/announcements/mine");
      return response.data;
    },
  });

  // Simulate loading

  // Helper: check if announcement is read

  // Mark as read handler (simulated)

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "Invalid Time";
    }
  };

  // --- Single Announcement View (Mobile Responsive) ---

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
        <PageLoader query={query}>
          {(data) => {
            const announcementsList = data.data.data;
            return (
              <>
                {announcementsList.length > 0 ? (
                  <div className="space-y-4">
                    {announcementsList.map((announcement) => {
                      // Map API data to local UI structure
                      const uiAnnouncement: Announcement = {
                        id: Number(announcement.id),
                        subject: "Announcement", // API doesn't provide subject, using placeholder
                        category: "General",
                        created_at: announcement.createdAt,
                        message: announcement.content,
                        read: false, // API doesn't provide read status, defaulting to false
                      };

                      const read = isAnnouncementRead(uiAnnouncement);
                      const isMarking = isMarkingAsRead(uiAnnouncement.id);

                      return (
                        <div
                          key={uiAnnouncement.id}
                          className={`bg-white rounded-xl border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-all cursor-pointer group relative ${
                            read ? "opacity-75" : ""
                          }`}
                          onClick={() =>
                            handleAnnouncementClick(uiAnnouncement)
                          }
                        >
                          {/* Card Container: Stack vertical on mobile, row on desktop */}
                          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                            {/* Icon Section */}
                            <div className="shrink-0 flex items-center justify-between w-full sm:w-auto">
                              <div
                                className={`w-12 h-12 ${
                                  read
                                    ? "bg-gray-400"
                                    : "bg-linear-to-br from-orange-500 to-orange-600"
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
                                    className={`text-lg font-semibold ${
                                      read ? "text-gray-600" : "text-gray-900"
                                    } group-hover:text-orange-600 transition-colors pr-0 sm:pr-20`}
                                  >
                                    {uiAnnouncement.subject}
                                  </h3>
                                  <div className="flex flex-wrap items-center gap-x-4 mt-1 mb-3 text-sm text-gray-500">
                                    <div className="flex items-center space-x-1">
                                      <Calendar className="h-3 w-3" />
                                      <span>
                                        {formatDate(uiAnnouncement.created_at)}
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Clock className="h-3 w-3" />
                                      <span>
                                        {formatTime(uiAnnouncement.created_at)}
                                      </span>
                                    </div>
                                  </div>
                                  <p className="text-gray-600 line-clamp-2 text-sm sm:text-base">
                                    {uiAnnouncement.message}
                                  </p>
                                </div>

                                {/* Actions Section: Bottom on mobile, Right on Desktop */}
                                <div className="mt-4 sm:mt-0 sm:ml-4 flex flex-row sm:flex-col justify-end sm:items-end gap-2 shrink-0">
                                  {!read && (
                                    <button
                                      className="cursor-pointer flex items-center px-3 py-1 bg-orange-50 text-orange-600 rounded-lg text-sm font-semibold hover:bg-orange-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                      disabled={isMarking}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleMarkAsRead(uiAnnouncement);
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
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                    <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No announcements found.</p>
                  </div>
                )}
              </>
            );
          }}
        </PageLoader>
      </div>
    </div>
  );
}
