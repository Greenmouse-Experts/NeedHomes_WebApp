import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import apiClient, { type ApiResponseV2 } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";
import type { Actions } from "@/components/tables/pop-up";
import SearchBar from "@/routes/-components/Searchbar";
import { usePagination } from "@/helpers/pagination";
import { toast } from "sonner";
import { extract_message } from "@/helpers/apihelpers";
import { ClipboardList } from "lucide-react";

export const Route = createFileRoute("/dashboard/waitlist")({
  component: WaitlistPage,
  validateSearch: (search: Record<string, unknown>) => ({
    search: (search.search as string) || "",
  }),
});

interface WaitlistEntry {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  createdAt: string;
  [key: string]: any;
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
      const resp = await apiClient.get("admin/waitlist", { params });
      return resp.data;
    },
  });

  const handleSearch = (value: string) => {
    navigate({ to: ".", search: (prev) => ({ ...prev, search: value }) });
  };

  const columns: columnType<WaitlistEntry>[] = [
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    {
      key: "createdAt",
      label: "Date Joined",
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  const actions: Actions[] = [
    {
      key: "delete",
      label: "Remove",
      action: (item: WaitlistEntry) => {
        toast.promise(
          async () => {
            const resp = await apiClient.delete(`admin/waitlist/${item.id}`);
            return resp.data;
          },
          {
            loading: "Removing...",
            success: () => {
              query.refetch();
              return "Entry removed from waitlist";
            },
            error: extract_message,
          },
        );
      },
    },
  ];

  return (
    <>
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
              actions={actions}
              ring={false}
              paginationProps={props}
            />
          </div>
        )}
      </PageLoader>
    </>
  );
}
