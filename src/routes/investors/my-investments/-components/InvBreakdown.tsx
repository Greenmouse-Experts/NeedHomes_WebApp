import apiClient from "@/api/simpleApi";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  Home,
  Layers,
  PiggyBank,
  Building2,
  Hammer,
  ChevronRight,
} from "lucide-react";

const MODEL_STYLE: Record<
  string,
  { image: string; hoverBorder: string; footerHover: string }
> = {
  FRACTIONAL_OWNERSHIP: {
    image: "/investments/fractional.png",
    hoverBorder: "hover:border-indigo-200",
    footerHover: "group-hover:text-indigo-600",
  },
  LAND_BANKING: {
    image: "/investments/land_banking.png",
    hoverBorder: "hover:border-amber-200",
    footerHover: "group-hover:text-amber-600",
  },
  SAVE_TO_OWN: {
    image: "/investments/save_to_own.png",
    hoverBorder: "hover:border-pink-200",
    footerHover: "group-hover:text-pink-600",
  },
  OUTRIGHT_PURCHASE: {
    image: "/investments/outright_purchase.png",
    hoverBorder: "hover:border-teal-200",
    footerHover: "group-hover:text-teal-600",
  },
  CO_DEVELOPMENT: {
    image: "/investments/co_dev.png",
    hoverBorder: "hover:border-orange-200",
    footerHover: "group-hover:text-orange-600",
  },
};

function CardShell({
  model,
  onClick,
  children,
}: {
  model: ModelBreakdown["model"];
  onClick: () => void;
  children: React.ReactNode;
}) {
  const s = MODEL_STYLE[model];
  return (
    <button
      onClick={onClick}
      className={`relative overflow-hidden text-left w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md ${s.hoverBorder} transition-all group`}
    >
      <img
        src={s.image}
        alt=""
        aria-hidden
        className="pointer-events-none select-none absolute -top-3 -right-3 w-32 h-32 object-contain opacity-10 group-hover:opacity-20 group-hover:scale-105 transition-all duration-300"
      />
      <div className="relative">
        {children}
        <div
          className={`flex items-center gap-1 text-sm font-medium text-gray-500 ${s.footerHover} transition-colors border-t border-gray-100 pt-3`}
        >
          View Investments <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </button>
  );
}

type ModelBreakdown =
  | {
      model: "FRACTIONAL_OWNERSHIP";
      activeSlots: number;
      currentValue: number;
      roi: number;
    }
  | {
      model: "LAND_BANKING";
      reservedLands: number;
      estimatedAppreciation: number;
    }
  | {
      model: "SAVE_TO_OWN";
      targetPropertyTitle: string;
      progress: number;
      amountSaved: number;
      targetAmount: number;
    }
  | {
      model: "OUTRIGHT_PURCHASE";
      propertiesOwned: number;
      developmentStage: string;
    }
  | {
      model: "CO_DEVELOPMENT";
      activeProjects: number;
      developmentStage: string;
    };

interface BreakdownData {
  models: ModelBreakdown[];
}

function fmt(kobo: number) {
  const n = kobo / 100;
  if (n >= 1_000_000_000) return `₦${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `₦${(n / 1_000).toFixed(0)}K`;
  return `₦${n.toLocaleString()}`;
}

function ModelCard({
  item,
  onClick,
}: {
  item: ModelBreakdown;
  onClick: () => void;
}) {
  switch (item.model) {
    case "FRACTIONAL_OWNERSHIP":
      return (
        <CardShell model={item.model} onClick={onClick}>
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2.5 bg-indigo-100 rounded-xl shrink-0">
              <Layers className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="font-bold text-gray-900 leading-tight">
                Fractional Investment
              </p>
              <span className="inline-block mt-1 text-xs font-medium bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                {item.activeSlots} Active Slots
              </span>
            </div>
          </div>
          <div className="space-y-1 mb-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              Current Value
            </p>
            <p className="text-xl font-black text-gray-900">
              {fmt(item.currentValue)}
            </p>
            <p className="text-xs text-gray-400 uppercase tracking-wide mt-2">
              ROI
            </p>
            <p
              className={`text-sm font-bold ${item.roi >= 0 ? "text-green-600" : "text-red-500"}`}
            >
              {item.roi >= 0 ? "+" : ""}
              {item.roi.toFixed(1)}%
            </p>
          </div>
        </CardShell>
      );

    case "LAND_BANKING":
      return (
        <CardShell model={item.model} onClick={onClick}>
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2.5 bg-amber-100 rounded-xl shrink-0">
              <Home className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="font-bold text-gray-900 leading-tight">
                Land Banking
              </p>
              <span className="inline-block mt-1 text-xs font-medium bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                {item.reservedLands} Lands Reserved
              </span>
            </div>
          </div>
          <div className="space-y-1 mb-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              Estimated Appreciation
            </p>
            <p
              className={`text-xl font-black ${item.estimatedAppreciation >= 0 ? "text-green-600" : "text-red-500"}`}
            >
              {item.estimatedAppreciation >= 0 ? "+" : ""}
              {item.estimatedAppreciation.toFixed(1)}%
            </p>
            <div className="mt-2 flex gap-0.5 items-end h-8">
              {[3, 5, 4, 7, 6, 8, 7].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-green-200 rounded-sm"
                  style={{ height: `${h * 10}%` }}
                />
              ))}
            </div>
          </div>
        </CardShell>
      );

    case "SAVE_TO_OWN":
      return (
        <CardShell model={item.model} onClick={onClick}>
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2.5 bg-pink-100 rounded-xl shrink-0">
              <PiggyBank className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <p className="font-bold text-gray-900 leading-tight">
                Save to Own
              </p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide mt-1">
                Target Property
              </p>
              <p className="text-xs font-semibold text-gray-700 line-clamp-1">
                {item.targetPropertyTitle}
              </p>
            </div>
          </div>
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Progress</span>
              <span>{item.progress.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-pink-500 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(item.progress, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1.5">
              <span>{fmt(item.amountSaved)} saved</span>
              <span>of {fmt(item.targetAmount)}</span>
            </div>
          </div>
        </CardShell>
      );

    case "OUTRIGHT_PURCHASE":
      return (
        <CardShell model={item.model} onClick={onClick}>
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2.5 bg-teal-100 rounded-xl shrink-0">
              <Building2 className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="font-bold text-gray-900 leading-tight">
                Outright Purchase
              </p>
              <span className="inline-block mt-1 text-xs font-medium bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">
                {item.propertiesOwned}{" "}
                {item.propertiesOwned === 1 ? "Property" : "Properties"} Owned
              </span>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              Development Stage
            </p>
            <p className="text-sm font-semibold text-gray-800 capitalize mt-0.5">
              {item.developmentStage.replace(/_/g, " ")}
            </p>
          </div>
        </CardShell>
      );

    case "CO_DEVELOPMENT":
      return (
        <CardShell model={item.model} onClick={onClick}>
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2.5 bg-orange-100 rounded-xl shrink-0">
              <Hammer className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="font-bold text-gray-900 leading-tight">
                Property Co-development
              </p>
              <span className="inline-block mt-1 text-xs font-medium bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                {item.activeProjects} Active{" "}
                {item.activeProjects === 1 ? "Project" : "Projects"}
              </span>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              Development Stage
            </p>
            <p className="text-sm font-semibold text-gray-800 capitalize mt-0.5">
              {item.developmentStage.replace(/_/g, " ")}
            </p>
          </div>
        </CardShell>
      );
  }
}

export default function InvBreakdown() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery<{ data: BreakdownData }>({
    queryKey: ["investor-portfolio-breakdown"],
    queryFn: async () => {
      const resp = await apiClient.get(
        "/analytics/investor/portfolio-breakdown",
      );
      return resp.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const models = data?.data?.models ?? [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse"
          >
            <div className="flex gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-xl" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-2" />
            <div className="h-3 bg-gray-100 rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  if (models.length === 0) return null;

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900">Your Investments</h3>
        <p className="text-sm text-gray-500">
          Manage and track your investments across all categories
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {models.map((item) => (
          <ModelCard
            key={item.model}
            item={item}
            onClick={() =>
              navigate({
                to: "/investors/my-investments/list/",
                search: { investmentModel: item.model },
              })
            }
          />
        ))}
      </div>
    </div>
  );
}
