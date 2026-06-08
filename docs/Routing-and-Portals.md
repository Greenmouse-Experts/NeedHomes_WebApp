# Routing and Portals

NeedHomes is divided into three distinct functional areas, or "portals," all contained within the same Single Page Application (SPA).

## Portals

### 1. Investor Portal (`/investors`)
Designed for individual users to browse properties, manage investments, and view their portfolio.
- **Layout:** `src/routes/investors/route.tsx`
- **Key Features:** Property marketplace, investment tracking, favorites, and wallet management.

### 2. Partner Portal (`/partners`)
For real estate developers and partners to list properties and manage their offerings.
- **Layout:** `src/routes/partners/route.tsx`
- **Key Features:** Listing management, promotion tools, and partner-specific analytics.

### 3. Admin Dashboard (`/dashboard`)
The administrative backend for platform operators.
- **Layout:** `src/routes/dashboard/route.tsx`
- **Key Features:** User management (KYC), property approval, transaction monitoring, and content management (Blogs, FAQs).

## Routing Technology

We use **TanStack Router** with file-based routing.

### Key Concepts
- **Automatic Type Generation:** The router plugin watches `src/routes/` and regenerates `src/routeTree.gen.ts`. This file should never be edited manually.
- **Dynamic Segments:** Files or folders named with a `$` prefix (e.g., `$propertyId`) create dynamic route parameters.
- **Layout Routes:** Files named `route.tsx` act as layouts for all child routes in their directory. They must render an `<Outlet />`.
- **Private Folders:** Folders starting with a dash (e.g., `-components/`) are ignored by the router, allowing for component co-location within the routes directory.

## Public Routes
Routes outside of the `/investors`, `/partners`, and `/dashboard` prefixes are public (e.g., `/`, `/about-us`, `/contact-us`). These are defined directly in the root of `src/routes/`.

## Shared Route Patterns
- **Pagination:** Most listing pages use the `usePagination()` hook from `src/helpers/pagination.tsx`, which synchronizes the current page with the URL's `page` search parameter.
- **Breadcrumbs/Headers:** Sidebars and headers are typically defined in the portal's `route.tsx` layout file.
