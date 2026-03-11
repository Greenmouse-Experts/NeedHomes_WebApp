import apiClient, { type ApiResponseV2 } from "@/api/simpleApi";
import QueryCompLayout from "@/components/layout/QueryCompLayout";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";
import type { Actions } from "@/components/tables/pop-up";
import { usePagination } from "@/helpers/pagination";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock } from "lucide-react";

const statusConfig: Record<
  string,
  { color: string; icon: typeof CheckCircle2 }
> = {
  SUCCESS: { color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  PENDING: { color: "bg-orange-100 text-orange-700", icon: Clock },
  FAILED: { color: "bg-red-100 text-red-700", icon: CheckCircle2 },
};

function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? statusConfig.PENDING;
  const Icon = config.icon;
  return (
    <div
      className={`${config.color} inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full`}
    >
      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
      <span className="text-sm font-medium whitespace-nowrap">{status}</span>
    </div>
  );
}

const columns: columnType<Transaction>[] = [
  { key: "reference", label: "Transaction ID" },
  {
    key: "createdAt",
    label: "Date",
    render: (value: string) =>
      new Date(value).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
  },
  {
    key: "amount",
    label: "Amount",
    render: (value: number) =>
      `₦${Number(value).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`,
  },
  { key: "type", label: "Type" },
  {
    key: "status",
    label: "Status",
    render: (value: string) => <StatusBadge status={value} />,
  },
];

const actions: Actions<Transaction>[] = [
  {
    key: "view-details",
    label: "View Details",
    action: (item, nav) => {
      nav({ to: `/dashboard/transactions/payments/${item.id}` });
    },
  },
];

export default function UserTransactions({ id }: { id: string }) {
  const props = usePagination();
  const query = useQuery<ApiResponseV2<Transaction[]>>({
    queryKey: ["user-transactions", id, props.page],
    queryFn: async () => {
      let resp = await apiClient.get(`admin/transactions?userId=${id}`, {
        params: {
          page: props.page,
        },
      });
      return resp.data;
    },
    enabled: !!id,
  });
  return (
    <QueryCompLayout query={query}>
      {(resp) => {
        const data: Transaction[] = resp.data.data ?? [];
        return (
          <CustomTable
            data={data}
            columns={columns}
            actions={actions}
            paginationProps={props}
            totalCount={data.length}
          />
        );
      }}
    </QueryCompLayout>
  );
}
