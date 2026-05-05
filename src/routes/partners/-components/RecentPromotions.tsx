import apiClient, { type ApiResponseV2 } from "@/api/simpleApi";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";
import QueryCompLayout from "@/components/layout/QueryCompLayout";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface Property {
  id: string;
  propertyTitle: string;
  coverImage: string;
  location: string;
}

interface Promotion {
  id: string;
  propertyId: string;
  property: Property;
  promotionLink: string;
  clicks: number;
  conversions: number;
  amountEarned: number;
  amountEarnedNaira: number;
  createdAt: string;
}

const columns: columnType<Promotion>[] = [
  {
    key: "property",
    label: "Property",
    render: (property: Property) => (
      <div className="flex items-center gap-3">
        <div className="avatar">
          <div className="mask mask-squircle w-10 h-10">
            <img src={property.coverImage} alt={property.propertyTitle} />
          </div>
        </div>
        <div>
          <div className="font-semibold text-sm">{property.propertyTitle}</div>
          <div className="text-xs opacity-50">{property.location}</div>
        </div>
      </div>
    ),
  },
  { key: "clicks", label: "Clicks" },
  { key: "conversions", label: "Conversions" },
  {
    key: "amountEarnedNaira",
    label: "Commission",
    render: (amount: number) =>
      new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0,
      }).format(amount ?? 0),
  },
  {
    key: "createdAt",
    label: "Date",
    render: (date: string) => new Date(date).toLocaleDateString(),
  },
];

export default function RecentPromotions() {
  const query = useQuery<ApiResponseV2<Promotion[]>>({
    queryKey: ["promotions-recent"],
    queryFn: async () => {
      const resp = await apiClient.get("partners/promotions", {
        params: { limit: 10 },
      });
      return resp.data;
    },
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 md:p-6 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-base md:text-lg font-semibold text-gray-900">
          Recent Promotions
        </h3>
        <Link
          to="/partners/promotions"
          className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          View all <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <QueryCompLayout query={query}>
        {(data) => {
          const promotions: Promotion[] =
            (data.data as any)?.data ?? data.data ?? [];
          const latest = promotions.slice(0, 5);

          if (latest.length === 0) {
            return (
              <p className="p-6 text-sm text-gray-400 text-center">
                No promotions yet.
              </p>
            );
          }

          return (
            <CustomTable
              ring={false}
              data={latest}
              columns={columns}
              actions={[
                {
                  key: "copy",
                  label: "Copy Link",
                  action: (item: Promotion) => {
                    navigator.clipboard.writeText(item.promotionLink);
                    toast.success("Link copied to clipboard");
                  },
                },
              ]}
            />
          );
        }}
      </QueryCompLayout>
    </div>
  );
}
