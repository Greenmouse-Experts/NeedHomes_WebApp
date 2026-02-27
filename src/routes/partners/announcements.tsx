import { createFileRoute } from "@tanstack/react-router";
import { Bell, Calendar, Clock, Eye, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import apiClient, { type ApiResponseV2 } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";

export const Route = createFileRoute("/partners/announcements")({
  component: RouteComponent,
});

function RouteComponent() {
  type AnnouncementCreate = {
    id: string;
    content: string;
    target: "ALL_USERS";
    createdBy: string;
    createdAt: string;
    deletedAt: string | null;
  };

  const query = useQuery<ApiResponseV2<AnnouncementCreate[]>>({
    queryKey: ["announcements"],
    queryFn: async () => {
      const response = await apiClient.get("/announcements/mine");
      return response.data;
    },
  });

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

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-8">
      <div className="mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2.5 bg-orange-500 rounded-xl shadow-sm shadow-orange-200">
                <Bell className="size-5 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                Announcements
              </h1>
            </div>
            <p className="text-gray-500 text-sm sm:text-base ml-1">
              Stay updated with the latest news and platform updates.
            </p>
          </div>
        </div>

        <PageLoader query={query}>
          {(data) => {
            const announcementsList = data.data.data;

            return (
              <div className="grid gap-4">
                {announcementsList.length > 0 ? (
                  announcementsList.map((announcement) => (
                    <div
                      key={announcement.id}
                      className="group relative bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 cursor-pointer ring fade"
                    >
                      <div className="flex items-start gap-5">
                        {/* Icon/Status Indicator */}
                        <div className="hidden sm:flex shrink-0 w-12 h-12 rounded-xl bg-gray-50 items-center justify-center group-hover:bg-orange-50 transition-colors duration-300">
                          <Bell className="size-10 text-gray-400 group-hover:text-orange-500" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-2">
                            <div className="flex items-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                              <Calendar className="h-3.5 w-3.5 mr-1.5" />
                              {formatDate(announcement.createdAt)}
                            </div>
                            <div className="flex items-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                              <Clock className="h-3.5 w-3.5 mr-1.5" />
                              {formatTime(announcement.createdAt)}
                            </div>
                          </div>

                          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-1">
                            Important Update
                          </h3>

                          <p className="text-gray-600 leading-relaxed text-sm sm:text-base line-clamp-2">
                            {announcement.content}
                          </p>

                          {/*<div className="mt-4 flex items-center text-sm font-semibold text-orange-600 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0">
                            View Details
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </div>*/}
                        </div>

                        <div className="shrink-0 self-center">
                          <div className="p-2 rounded-full bg-gray-50 text-gray-400 group-hover:bg-orange-100 group-hover:text-orange-600 transition-all">
                            <Eye className="h-5 w-5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                    <div className="inline-flex p-4 bg-gray-50 rounded-full mb-4">
                      <Bell className="h-8 w-8 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">
                      No updates yet
                    </h3>
                    <p className="text-gray-500 mt-1">
                      We'll notify you when something new arrives.
                    </p>
                  </div>
                )}
              </div>
            );
          }}
        </PageLoader>
      </div>
    </div>
  );
}
