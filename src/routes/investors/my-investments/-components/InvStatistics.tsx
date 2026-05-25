import InvOverviewCards from "./InvOverviewCards";
import InvGrowthChart from "./InvGrowthChart";
import InvBreakdown from "./InvBreakdown";

export default function InvStatistics() {
  return (
    <section className="space-y-6">
      <InvOverviewCards />
      <InvGrowthChart />
      <InvBreakdown />
    </section>
  );
}
