import WorkInProgress from "@/components/WIP";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/transactions/payments/$id/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ThemeProvider>
      <WorkInProgress />
    </ThemeProvider>
  );
}
