import apiClient from "@/api/simpleApi";
import { useQuery } from "@tanstack/react-query";
import { Home, Layers, PiggyBank, Building2, Hammer } from "lucide-react";

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

function ModelCard({ item }: { item: ModelBreakdown }) {
  switch (item.model) {
    case "FRACTIONAL_OWNERSHIP":
      return (
        <div className="card bg-base-100 shadow-sm border border-base-200">
          <div className="card-body p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Layers className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-base-content/50 uppercase tracking-wider">Fractional</p>
                <span className="badge badge-sm badge-soft badge-info">{item.activeSlots} Active Slots</span>
              </div>
            </div>
            <p className="text-lg font-black">{fmt(item.currentValue)}</p>
            <p className="text-xs text-base-content/50">Current Value</p>
            <p className={`text-sm font-semibold mt-1 ${item.roi >= 0 ? "text-success" : "text-error"}`}>
              {item.roi >= 0 ? "+" : ""}{item.roi.toFixed(1)}% ROI
            </p>
          </div>
        </div>
      );

    case "LAND_BANKING":
      return (
        <div className="card bg-base-100 shadow-sm border border-base-200">
          <div className="card-body p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Home className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-base-content/50 uppercase tracking-wider">Land Banking</p>
                <span className="badge badge-sm badge-soft badge-warning">{item.reservedLands} Lands Reserved</span>
              </div>
            </div>
            <p className={`text-lg font-bold mt-1 ${item.estimatedAppreciation >= 0 ? "text-success" : "text-error"}`}>
              {item.estimatedAppreciation >= 0 ? "+" : ""}{item.estimatedAppreciation.toFixed(1)}%
            </p>
            <p className="text-xs text-base-content/50">Estimated Appreciation</p>
          </div>
        </div>
      );

    case "SAVE_TO_OWN":
      return (
        <div className="card bg-base-100 shadow-sm border border-base-200">
          <div className="card-body p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-pink-100 rounded-lg">
                <PiggyBank className="w-4 h-4 text-pink-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-base-content/50 uppercase tracking-wider">Save to Own</p>
                <p className="text-sm font-semibold line-clamp-1">{item.targetPropertyTitle}</p>
              </div>
            </div>
            <div className="w-full bg-base-200 rounded-full h-2 mb-1">
              <div
                className="bg-pink-500 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(item.progress, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-base-content/50">
              <span>{item.progress.toFixed(0)}% saved</span>
              <span>{fmt(item.amountSaved)} / {fmt(item.targetAmount)}</span>
            </div>
          </div>
        </div>
      );

    case "OUTRIGHT_PURCHASE":
      return (
        <div className="card bg-base-100 shadow-sm border border-base-200">
          <div className="card-body p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-teal-100 rounded-lg">
                <Building2 className="w-4 h-4 text-teal-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-base-content/50 uppercase tracking-wider">Outright Purchase</p>
                <span className="badge badge-sm badge-soft badge-success">
                  {item.propertiesOwned} {item.propertiesOwned === 1 ? "Property" : "Properties"} Owned
                </span>
              </div>
            </div>
            <p className="text-sm font-semibold capitalize mt-1">
              {item.developmentStage.replace(/_/g, " ")}
            </p>
            <p className="text-xs text-base-content/50">Development Stage</p>
          </div>
        </div>
      );

    case "CO_DEVELOPMENT":
      return (
        <div className="card bg-base-100 shadow-sm border border-base-200">
          <div className="card-body p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Hammer className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-base-content/50 uppercase tracking-wider">Co-Development</p>
                <span className="badge badge-sm badge-soft badge-warning">
                  {item.activeProjects} Active {item.activeProjects === 1 ? "Project" : "Projects"}
                </span>
              </div>
            </div>
            <p className="text-sm font-semibold capitalize mt-1">
              {item.developmentStage.replace(/_/g, " ")}
            </p>
            <p className="text-xs text-base-content/50">Development Stage</p>
          </div>
        </div>
      );
  }
}

export default function InvBreakdown() {
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
      <div className="flex items-center gap-2 text-sm text-base-content/40">
        <span className="loading loading-spinner loading-sm" /> Loading breakdown…
      </div>
    );
  }

  if (models.length === 0) return null;

  return (
    <div>
      <h3 className="font-bold text-base-content mb-3">Your Investments</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {models.map((item) => (
          <ModelCard key={item.model} item={item} />
        ))}
      </div>
    </div>
  );
}
