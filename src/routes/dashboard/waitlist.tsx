import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import apiClient, { type ApiResponseV2 } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";
import SearchBar from "@/routes/-components/Searchbar";
import { usePagination } from "@/helpers/pagination";
import { ClipboardList } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import ThemeProvider from "@/simpleComps/ThemeProvider";

export const Route = createFileRoute("/dashboard/waitlist")({
  component: WaitlistPage,
  validateSearch: (search: Record<string, unknown>) => ({
    search: (search.search as string) || "",
  }),
});

interface WaitlistEntry {
  id: string;
  email: string;
  createdAt: string;
}

function WaitlistPage() {
  const navigate = useNavigate();
  const { search: searchQuery } = Route.useSearch();
  const props = usePagination();

  const query = useQuery<ApiResponseV2<WaitlistEntry[]>>({
    queryKey: ["waitlist", props.page, searchQuery],
    queryFn: async () => {
      const params: any = { page: props.page };
      if (searchQuery) params.search = searchQuery;
      const resp = await apiClient.get("/waitlist/admin/entries", { params });
      return resp.data;
    },
  });

  const handleSearch = (value: string) => {
    navigate({ to: ".", search: (prev) => ({ ...prev, search: value }) });
  };

  const columns: columnType<WaitlistEntry>[] = [
    { key: "email", label: "Email" },
    {
      key: "createdAt",
      label: "Date Joined",
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <ThemeProvider>
      <DashboardLayout title="Super Admin Dashboard" subtitle="waitlist">
        <section className="bg-base-100 ring fade shadow rounded-t-box">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-1">
              <ClipboardList className="w-6 h-6 text-(--color-orange)" />
              <h2 className="text-xl font-semibold">Waitlist</h2>
            </div>
            <p className="text-sm text-gray-500">
              Users who have joined the waitlist
            </p>
          </div>

          <div className="p-4 border-b border-gray-200">
            <div className="max-w-md">
              <SearchBar value={searchQuery} onChange={handleSearch} />
            </div>
          </div>
        </section>

        <PageLoader query={query}>
          {(data) => (
            <div className="bg-white rounded-lg shadow-sm">
              <CustomTable
                //@ts-ignore
                data={data.data.data}
                columns={columns}
                ring={false}
                paginationProps={props}
              />
            </div>
          )}
        </PageLoader>
      </DashboardLayout>
    </ThemeProvider>
  );
}
