import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Filter, Printer } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";
import { useQuery } from "@tanstack/react-query";
import apiClient, { type ApiResponseV2 } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";

export const Route = createFileRoute("/dashboard/properties/promotions/")({
  component: RouteComponent,
});

interface Property {
  id: string;
  propertyTitle: string;
  basePrice: number;
  totalPrice: number;
  coverImage: string;
  location: string;
}

interface Partner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  referralCode: string;
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
  partner: Partner;
}

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
    key: "partner",
    label: "Partner",
    render: (partner: Partner) => (
      <div>
        <div className="font-bold">{`${partner.firstName} ${partner.lastName}`}</div>
        <div className="text-sm opacity-50">{partner.email}</div>
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
    key: "amountEarnedNaira",
    label: "Commission Earned",
    render: (amount: number) =>
      new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0,
      }).format(amount ?? 0),
  },
  {
    key: "createdAt",
    label: "Date Created",
    render: (date: string) => new Date(date).toLocaleDateString(),
  },
];

function RouteComponent() {
  const nav = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const query = useQuery<ApiResponseV2<Promotion[]>>({
    queryKey: ["promotions", searchQuery],
    queryFn: async () => {
      return (await apiClient.get("/admin/promotions")).data;
    },
  });

  return (
    <div className="bg-base-100">
      <div className="border-b ring fade rounded-t-box border-gray-200 shadow">
        <div className="flex items-center justify-between p-6 border-b fade">
          <h2 className="text-xl font-semibold">Property Promotions</h2>
          {/*<Button size="sm" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Promotion
          </Button>*/}
        </div>

        <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search promotions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print
            </Button>
          </div>
        </div>
      </div>
      <PageLoader query={query}>
        {(data) => {
          const dataList = data.data.data;

          return (
            <CustomTable
              ring={false}
              columns={columns}
              data={dataList}
              actions={[
                {
                  key: "view-property",
                  label: "View Property",
                  action: (item: Promotion) => {
                    return nav({
                      to: `/dashboard/properties/${item.propertyId}`,
                    });
                  },
                },
                {
                  key: "view-partner",
                  label: "View Partner",
                  action: (item: Promotion) => {
                    return nav({
                      to: `/dashboard/partners/${item.partner.id}`,
                    });
                  },
                },
              ]}
            />
          );
        }}
      </PageLoader>
    </div>
  );
}
