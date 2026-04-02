import ThemeProvider from "@/simpleComps/ThemeProvider";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/investors/properties")({
  component: PropertiesLayout,
});

function PropertiesLayout() {
  return (
    <ThemeProvider className="space-y-6">
      <Outlet />
    </ThemeProvider>
  );
}
