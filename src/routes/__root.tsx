import { Outlet, createRootRoute, useLocation } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import Header from "@/components/Header";
import LogoutModal from "@/components/LogoutModal";
import CookieConsent from "@/components/CookieConsent";
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
  component: () => {
    const { url } = useLocation();
    const hideHeader =
      url.pathname.startsWith("/dashboard") ||
      url.pathname.startsWith("/investors") ||
      url.pathname.startsWith("/partners");
    return (
      <>
        <QueryClientProvider client={client}>
          <Toaster richColors position="top-right" />
          {/*<Head*/}
          {!hideHeader && <Header />}
          <LogoutModal />

          <Outlet />
          <CookieConsent />
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
    );
  },
});
