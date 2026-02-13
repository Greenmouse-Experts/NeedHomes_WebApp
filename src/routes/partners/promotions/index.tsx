import apiClient, { type ApiResponse } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Building2 } from "lucide-react";
import { toast } from "sonner";

interface Property {
  id: string;
  propertyTitle: string;
  basePrice: number;
  totalPrice: number;
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
  createdAt: string;
}

export const Route = createFileRoute("/partners/promotions/")({
  component: RouteComponent,
});

function RouteComponent() {
  const query = useQuery<ApiResponse<Promotion[]>>({
    queryKey: ["promotions-partner"],
    queryFn: async () => {
      let resp = await apiClient.get("partners/promotions");
      return resp.data;
    },
  });

  const columns: columnType<Promotion>[] = [
    {
      key: "property",
      label: "Property",
      render: (property: Property) => (
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="mask mask-squircle w-12 h-12">
              <img src={property.coverImage} alt={property.propertyTitle} />
            </div>
          </div>
          <div>
            <div className="font-bold">{property.propertyTitle}</div>
            <div className="text-sm opacity-50">{property.location}</div>
          </div>
        </div>
      ),
    },
    {
      key: "promotionLink",
      label: "Link",
      render: (link: string) => (
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="link link-primary text-xs truncate max-w-xs block"
        >
          {link}
        </a>
      ),
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
      key: "createdAt",
      label: "Date Created",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <>
      <div className="">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 rounded-lg">
              <Building2 className="h-6 w-6 text-green-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Promotions
            </h1>
          </div>
          {/* Property Type Dropdown */}
        </div>
        <p className="text-gray-600 text-sm sm:text-base">
          Browse and manage your Promotions.
        </p>
      </div>
      <PageLoader query={query}>
        {(data) => {
          const promotions = data.data;
          return (
            <div className="mt-4">
              <CustomTable
                data={promotions}
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
            </div>
          );
        }}
      </PageLoader>
    </>
  );
}
