import type { PROPERTY_DATA } from "@/types";
import { Link } from "@tanstack/react-router";
import { MapPin, Home, TrendingUp, Calendar, ArrowRight } from "lucide-react";
import FavoriteButton from "@/components/favorites/FavoriteButton";

export default function PropertyCard({
  item: property,
}: {
  item: PROPERTY_DATA;
}) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amount);
  };
  const route = (propType: typeof property.investmentModel) => {
    return "/partners/properties/$propertyId/default";
    // switch (propType) {
    //   //@ts-ignore
    //   case "OUTRIGHT_PURCHASE":
    //     return "/partners/properties/$propertyId/outright";
    //   //@ts-ignore
    //   case "LAND_BANKING":
    //     return "/investors/properties/$propertyId/land-banking";
    //   case "FRACTIONAL_OWNERSHIP":
    //     return "/partners/properties/$propertyId/fractional";
    //   default:
    //     return "/partners/properties/$propertyId/default";
    // }
  };
  const link = route(property.investmentModel);
  return (
    <Link
      to={link}
      params={{ propertyId: property.id }}
      className="card card-compact bg-base-100 shadow-sm hover:shadow-xl transition-all duration-300 border border-base-200 group h-full"
    >
      <figure className="relative h-56 overflow-hidden">
        <img
          src={property.coverImage}
          alt={property.propertyTitle}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 z-10">
          <FavoriteButton propertyId={property.id} />
        </div>
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <div className="badge badge-neutral border-none bg-base-100/90 backdrop-blur text-neutral font-bold text-[10px] uppercase tracking-wider">
            {property.investmentModel.replace(/_/g, " ")}
          </div>
          {property.premiumProperty && (
            <div className="badge badge-warning font-bold text-[10px] uppercase tracking-wider">
              Premium
            </div>
          )}
        </div>
      </figure>

      <div className="card-body p-6">
        <div className="flex flex-col gap-1">
          <h2 className="card-title text-lg font-bold group-hover:text-primary transition-colors line-clamp-1">
            {property.propertyTitle}
          </h2>
          <div className="flex items-center text-base-content/60 text-sm">
            <MapPin className="w-3.5 h-3.5 mr-1 shrink-0" />
            <span className="line-clamp-1">{property.location}</span>
          </div>
        </div>

        <div className="divider my-2 opacity-50"></div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-base-content/40 tracking-widest">
              Property Type
            </span>
            <div className="flex items-center text-sm font-semibold">
              <Home className="w-4 h-4 mr-2 text-primary" />
              {property.propertyType}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-base-content/40 tracking-widest">
              Development
            </span>
            <div className="flex items-center text-sm font-semibold">
              <TrendingUp className="w-4 h-4 mr-2 text-primary" />
              {property.developmentStage}
            </div>
          </div>
        </div>

        <div className="card-actions mt-auto pt-4 border-t border-base-200 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-base-content/40 tracking-widest">
              Starting From
            </span>
            <span className="text-xl font-black text-primary">
              {formatCurrency(
                property.basePrice / 100 || property.totalPrice / 100,
              )}
            </span>
          </div>

          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-base-content/40">
              <Calendar className="w-3 h-3" />
              {property.availableUnits} Slots Left
            </div>
            <div className="btn btn-ghost btn-xs text-primary group-hover:translate-x-1 transition-transform p-0 mt-1">
              Details <ArrowRight className="w-3 h-3 ml-1" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
