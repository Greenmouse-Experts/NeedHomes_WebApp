import apiClient from "@/api/simpleApi";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

const MODEL_IMAGE: Record<string, string> = {
  FRACTIONAL_OWNERSHIP: "/investments/fractional.png",
  LAND_BANKING: "/investments/land_banking.png",
  SAVE_TO_OWN: "/investments/save_to_own.png",
  OUTRIGHT_PURCHASE: "/investments/outright_purchase.png",
  CO_DEVELOPMENT: "/investments/co_dev.png",
};

type ModelBreakdown =
  | { model: "FRACTIONAL_OWNERSHIP"; activeSlots: number; currentValue: number; roi: number }
  | { model: "LAND_BANKING"; reservedLands: number; estimatedAppreciation: number }
  | { model: "SAVE_TO_OWN"; targetPropertyTitle: string; progress: number; amountSaved: number; targetAmount: number }
  | { model: "OUTRIGHT_PURCHASE"; propertiesOwned: number; developmentStage: string }
  | { model: "CO_DEVELOPMENT"; activeProjects: number; developmentStage: string };

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

const MODEL_META: Record<string, { label: string; accent: string }> = {
  FRACTIONAL_OWNERSHIP: { label: "Fractional Investment", accent: "text-indigo-600" },
  LAND_BANKING:         { label: "Land Banking",          accent: "text-amber-600"  },
  SAVE_TO_OWN:          { label: "Save to Own",           accent: "text-pink-600"   },
  OUTRIGHT_PURCHASE:    { label: "Outright Purchase",     accent: "text-teal-600"   },
  CO_DEVELOPMENT:       { label: "Co-Development",        accent: "text-orange-600" },
};

function ModelSubtitle({ item }: { item: ModelBreakdown }) {
  switch (item.model) {
    case "FRACTIONAL_OWNERSHIP":
      return <>{item.activeSlots} Active Slots · {fmt(item.currentValue)} · ROI {item.roi >= 0 ? "+" : ""}{item.roi.toFixed(1)}%</>;
    case "LAND_BANKING":
      return <>{item.reservedLands} Lands Reserved · +{item.estimatedAppreciation.toFixed(1)}% appreciation</>;
    case "SAVE_TO_OWN":
      return <>{item.progress.toFixed(0)}% saved · {fmt(item.amountSaved)} of {fmt(item.targetAmount)}</>;
    case "OUTRIGHT_PURCHASE":
      return <>{item.propertiesOwned} {item.propertiesOwned === 1 ? "Property" : "Properties"} · {item.developmentStage.replace(/_/g, " ")}</>;
    case "CO_DEVELOPMENT":
      return <>{item.activeProjects} Active {item.activeProjects === 1 ? "Project" : "Projects"} · {item.developmentStage.replace(/_/g, " ")}</>;
  }
}

function ModelCard({ item, onClick }: { item: ModelBreakdown; onClick: () => void }) {
  const meta = MODEL_META[item.model];
  const img = MODEL_IMAGE[item.model];

  return (
    <button
      onClick={onClick}
      className="text-left w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:border-gray-300 transition-all group"
    >
      <div className="h-36 bg-gray-50 overflow-hidden flex items-center justify-center">
        <img
          src={img}
          alt={meta.label}
          className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <p className={`font-bold text-sm ${meta.accent}`}>{meta.label}</p>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
          <ModelSubtitle item={item} />
        </p>
        <div className="flex items-center gap-1 text-xs font-medium text-gray-400 group-hover:text-gray-700 transition-colors mt-3 pt-3 border-t border-gray-100">
          View Investments <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </button>
  );
}

export default function InvBreakdown() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery<{ data: BreakdownData }>({
    queryKey: ["investor-portfolio-breakdown"],
    queryFn: async () => {
      const resp = await apiClient.get("/analytics/investor/portfolio-breakdown");
      return resp.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const models = data?.data?.models ?? [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse">
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
        <p className="text-sm text-gray-500">Manage and track your investments across all categories</p>
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
