import apiClient, { type ApiResponseV2 } from "@/api/simpleApi";
import QueryCompLayout from "@/components/layout/QueryCompLayout";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";
import { type Actions } from "@/components/tables/pop-up";
import { useQuery } from "@tanstack/react-query";

interface Property {
  id: string;
  propertyTitle: string;
  propertyType: string;
  investmentModel: string;
  location: string;
  basePrice: number;
  coverImage: string;
  published: boolean;
}

interface PromotionClick {
  id: string;
  ipAddress: string;
  userAgent: string;
  clickedAt: string;
  userId: string | null;
}

interface PromotedProperty {
  id: string;
  partnerId: string;
  propertyId: string;
  promoLink: string;
  clicks: number;
  conversions: number;
  createdAt: string;
  deletedAt: string | null;
  updatedAt: string;
  property: Property;
  promotionClicks: PromotionClick[];
}

export default function PromotedProps({ id }: { id?: string }) {
  const query = useQuery<ApiResponseV2<PromotedProperty[]>>({
    queryKey: ["promotedProps", id],
    queryFn: async () => {
      const response = await apiClient(`admin/partners/${id}/promotions`);
      return response.data;
    },
  });

  const columns: columnType<PromotedProperty>[] = [
    {
      key: "property",
      label: "Property",
      render: (_, item) => (
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="mask mask-squircle w-12 h-12">
              <img
                src={item.property.coverImage}
                alt={item.property.propertyTitle}
              />
            </div>
          </div>
          <div>
            <div className="font-bold">{item.property.propertyTitle}</div>
            <div className="text-xs opacity-50">{item.property.location}</div>
          </div>
        </div>
      ),
    },
    {
      key: "propertyType",
      label: "Type",
      render: (_, item) => item.property.propertyType,
    },
    {
      key: "clicks",
      label: "Clicks",
    },
    {
      key: "conversions",
      label: "Conversions",
    },
    {
      key: "promoLink",
      label: "Promo Link",
      render: (value) => (
        <span className="text-xs text-primary underline break-all line-clamp-2 min-w-120">
          {value}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Date Created",
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  const actions: Actions<PromotedProperty>[] = [
    {
      key: "view-property",
      label: "View Property",
      action: (item, nav) => {
        nav({
          to: "/dashboard/properties/$propertyId",
          params: { propertyId: item.propertyId },
        });
      },
    },
  ];

  return (
    <>
      <QueryCompLayout query={query}>
        {(data) => {
          const promotion_data = data.data.data;
          return (
            <CustomTable
              columns={columns}
              data={promotion_data}
              actions={actions}
              totalCount={promotion_data.length}
            />
          );
        }}
      </QueryCompLayout>
    </>
  );
}
