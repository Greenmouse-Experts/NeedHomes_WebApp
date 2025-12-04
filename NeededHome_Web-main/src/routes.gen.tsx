// Generouted, changes to this file will be overridden
import { Fragment } from "react";
import {
  Outlet,
  RouterProvider,
  createLazyRoute,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

import App from "./pages/_app";

const root = createRootRoute({ component: App || Outlet });
const _404 = createRoute({
  getParentRoute: () => root,
  path: "*",
  component: Fragment,
});
const home = createRoute({ getParentRoute: () => root, path: "home" }).lazy(
  () =>
    import("./pages/home/_layout").then((m) =>
      createLazyRoute("/home")({ component: m.default }),
    ),
);
const homeindex = createRoute({ getParentRoute: () => home, path: "/" }).lazy(
  () =>
    import("./pages/home/index").then((m) =>
      createLazyRoute("/home")({ component: m.default }),
    ),
);
const index = createRoute({
  getParentRoute: () => root,
  path: "/",
  // @ts-ignore
  loader: (...args) => import("./pages/index").then((m) => m.Loader(...args)),
}).lazy(() =>
  import("./pages/index").then((m) =>
    createLazyRoute("/")({ component: m.default }),
  ),
);

const config = root.addChildren([home.addChildren([homeindex]), index, _404]);

const router = createRouter({ routeTree: config });
export const routes = config;
export const Routes = () => <RouterProvider router={router} />;

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
