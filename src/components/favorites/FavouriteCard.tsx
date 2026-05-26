import type { PROPERTY_DATA } from "@/types";
import { Link } from "@tanstack/react-router";
import {
  MapPin,
  Home,
  TrendingUp,
  Calendar,
  ArrowRight,
  Ban,
} from "lucide-react";
import FavoriteButton from "./FavoriteButton";

export interface FavoriteItem {
  id: string;
  createdAt: string;
  property: PROPERTY_DATA;
}

function getInvestorRoute(investmentModel: PROPERTY_DATA["investmentModel"]) {
  switch (investmentModel) {
    // @ts-ignore
    case "OUTRIGHT_PURCHASE":
      return "/investors/properties/$propertyId/outright";
    // @ts-ignore
    case "LAND_BANKING":
      return "/investors/properties/$propertyId/land-banking";
    case "FRACTIONAL_OWNERSHIP":
      return "/investors/properties/$propertyId/fractional";
    case "SAVE_TO_OWN":
      return "/investors/properties/$propertyId/save-to-own";
    default:
      return "/investors/properties/$propertyId/default";
  }
}

function getPartnerRoute(_investmentModel: PROPERTY_DATA["investmentModel"]) {
  return "/partners/properties/$propertyId/default";
}

export default function FavouriteCard({
  item,
  role,
}: {
  item: FavoriteItem;
  role: "investor" | "partner";
}) {
  const { property } = item;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amount / 100);

  const availabilityLabel = () => {
    if (property.investmentModel === "FRACTIONAL_OWNERSHIP") {
      return { count: property.availableShares ?? 0, unit: "Shares Left" };
    }
    if (property.investmentModel === "LAND_BANKING") {
      const plots =
        property.availablePlots != null ? Number(property.availablePlots) : 0;
      return { count: plots, unit: "Plots Left" };
    }
    return { count: property.availableUnits, unit: "Slots Left" };
  };

  const { count: availableCount, unit: availableUnit } = availabilityLabel();
  const soldOut = availableCount <= 0;

  const to =
    role === "investor"
      ? getInvestorRoute(property.investmentModel)
      : getPartnerRoute(property.investmentModel);

  return (
    <div className="relative group">
      <Link
        // @ts-ignore
        to={to}
        // @ts-ignore
        params={{ propertyId: property.id }}
        className={`card card-compact bg-base-100 shadow-sm border border-base-200 h-full transition-all duration-300 ${
          soldOut
            ? "opacity-60 grayscale pointer-events-none cursor-not-allowed"
            : "hover:shadow-xl"
        }`}
      >
        <figure className="relative h-56 overflow-hidden">
          <img
            src={property.coverImage}
            alt={property.propertyTitle}
            className={`w-full h-full object-cover transition-transform duration-700 ${
              !soldOut && "group-hover:scale-110"
            }`}
          />
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <div className="badge badge-neutral badge-soft font-semibold tracking-wider">
              {property.investmentModel.replace(/_/g, " ")}
            </div>
            {property.premiumProperty && (
              <div className="badge badge-warning font-bold text-[10px] uppercase tracking-wider">
                Premium
              </div>
            )}
            {soldOut && (
              <div className="badge badge-error font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                <Ban className="w-2.5 h-2.5" /> Sold Out
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
                {formatCurrency(property.basePrice || property.totalPrice)}
              </span>
            </div>

            <div className="flex flex-col items-end">
              {soldOut ? (
                <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-error">
                  <Ban className="w-3 h-3" />
                  No {availableUnit.replace(" Left", "")} Available
                </div>
              ) : (
                <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-base-content/40">
                  <Calendar className="w-3 h-3" />
                  {availableCount} {availableUnit}
                </div>
              )}
              {!soldOut && (
                <div className="btn btn-ghost btn-xs text-primary group-hover:translate-x-1 transition-transform p-0 mt-1">
                  Details <ArrowRight className="w-3 h-3 ml-1" />
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Favorite toggle — positioned outside the Link to avoid nested interactive elements */}
      <div className="absolute top-4 right-4 z-10">
        <FavoriteButton propertyId={property.id} />
      </div>
    </div>
  );
}
