import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
const client = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // PocketBase returns 404 when record not found
        if (error?.status === 404) return false;

        // Optional: stop after 2 retries
        return failureCount < 2;
      },
    },
  },
});
export const Route = createRootRoute({
  component: () => (
    <>
      <QueryClientProvider client={client}>
        <Toaster richColors position="top-right" />
        <Outlet />
      </QueryClientProvider>

      <TanStackDevtools
        config={{
          position: "bottom-right",
        }}
        plugins={[
          {
            name: "Tanstack Router",
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </>
  ),
});
