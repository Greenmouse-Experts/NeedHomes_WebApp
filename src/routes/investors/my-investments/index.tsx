import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import InvStatistics from "./-components/InvStatistics";

export const Route = createFileRoute("/investors/my-investments/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            My Portfolio
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Overview of your real estate investments
          </p>
        </div>
        <Link
          to="/investors/properties"
          viewTransition
          className="flex items-center gap-2 px-4 py-2 bg-(--color-orange) text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Investment
        </Link>
      </div>

      <InvStatistics />
    </div>
  );
}
