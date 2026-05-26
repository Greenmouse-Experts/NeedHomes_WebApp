# NeedHomes WebApp — Agents Reference

This file is the canonical reference for AI agents and new contributors working on this codebase. Read it fully before making changes.

---

## Project Overview

NeedHomes is a Nigerian real estate investment platform. Users invest in properties via multiple models (outright purchase, land banking, fractional ownership, save-to-own, co-development). The frontend is a React SPA served by Vite.

**Three portals in one app:**
- `/investors` — Individual investors browse and invest in properties
- `/partners` — Real estate partners upload and manage listings
- `/dashboard` — Admin panel for property management, KYC, analytics

---

## Tech Stack

| Layer | Library / Version |
|---|---|
| Framework | React 19 |
| Routing | TanStack Router v1.132 (file-based) |
| Data fetching | TanStack React Query v5 |
| Styling | Tailwind CSS v4 + DaisyUI v5 |
| State | Jotai v2 (atoms with localStorage persistence) |
| Forms | React Hook Form v7 + Zod v4 |
| HTTP client | Axios (custom instance at `src/api/simpleApi.ts`) |
| Payments | Paystack Inline JS |
| Real-time | Socket.IO client (per-portal, connected in layout route) |
| Charts | Recharts |
| Rich text | Tiptap |
| Maps | Leaflet + React Leaflet |
| Notifications | Sonner (toast) |
| Icons | Lucide React + Heroicons |
| Build | Vite 7 |
| Tests | Vitest + Testing Library |

---

## Running the Project

```bash
npm run dev        # dev server on http://localhost:3000
npm run build      # production build
npm run preview    # preview production build
npm run test       # vitest run
```

---

## Environment Variables

| Variable | Purpose |
|---|---|
| `VITE_BACKEND_URL` | Backend base URL (falls back to `https://needhomes-backend-staging.onrender.com`) |

Create a `.env` file at the project root if needed. Prefix all frontend env vars with `VITE_`.

---

## API Client

**File:** `src/api/simpleApi.ts`

- Axios instance with `baseURL = https://needhomes-backend-staging.onrender.com/`
- Request interceptor: attaches `Authorization: Bearer <accessToken>` from Jotai store
- Response interceptor: on 401, silently refreshes token via `POST /auth/refresh` and retries the original request. On second failure, clears auth state.
- All API calls use this client — never raw `fetch` or a separate axios instance.

**Response types:**
```ts
// Single-item responses
ApiResponse<T>  → { message, data: T, statusCode, path }

// Paginated responses
ApiResponseV2<T> → { message, data: { data: T, meta: { total, page, limit, totalPages } }, statusCode, path }
```

---

## Authentication & Auth Store

**File:** `src/store/authStore.ts`

Auth state is a Jotai atom persisted to `localStorage` under the key `"user"`. KYC state is stored under `"kyc"`.

```ts
useAuth()         // → [AUTHRECORD | null, setter]
useKyc()          // → [USER_KYC | null, setter]
get_user_value()  // synchronous read outside React (for interceptors, beforeLoad)
get_kyc_value()   // synchronous KYC read
show_logout()     // triggers the logout confirmation modal
```

**KYC gating:** Nav links in both sidebars are disabled unless `kyc.account_verification_status === "VERIFIED"`. Use `alwaysEnabled: true` (investor sidebar) or check `link.id !== "dashboard" && link.id !== "settings"` (partner sidebar) to exempt a route.

---

## File-Based Routing

TanStack Router auto-generates route types from the file system. The plugin runs at build/dev time.

**Conventions:**
- `route.tsx` — layout file (renders `<Outlet />`), wraps child routes
- `index.tsx` — the actual page at that path
- `-components/` — private components folder, NOT a route segment (leading dash is excluded from routing)
- `$paramName` — dynamic segment, accessed via `Route.useParams()`

**Portal layouts:**
- `src/routes/investors/route.tsx` — investor layout (sidebar + header + socket)
- `src/routes/partners/route.tsx` — partner layout (sidebar + header + socket)
- `src/routes/dashboard/route.tsx` — admin layout

**Important:** After adding a new route file, the router plugin regenerates `src/routeTree.gen.ts` automatically on next dev/build. Never edit `routeTree.gen.ts` manually.

---

## Route Map

### Public routes
| Path | File |
|---|---|
| `/` | (index, marketing) |
| `/about-us` | `src/routes/about-us.tsx` |
| `/blogs` | `src/routes/blogs/` |
| `/careers` | `src/routes/careers/` |
| `/contact-us` | `src/routes/contact-us.tsx` |

### Investor portal (`/investors`)
| Path | Description |
|---|---|
| `/investors` | Dashboard |
| `/investors/properties` | Property listing with filters |
| `/investors/properties/$propertyId/outright` | Outright purchase detail |
| `/investors/properties/$propertyId/land-banking` | Land banking detail |
| `/investors/properties/$propertyId/fractional` | Fractional ownership detail |
| `/investors/properties/$propertyId/save-to-own` | Save-to-own detail |
| `/investors/properties/$propertyId/default` | Default/fallback detail |
| `/investors/my-investments` | Portfolio |
| `/investors/my-investments/$investmentId` | Investment detail |
| `/investors/resell` | Resell marketplace |
| `/investors/favourites` | Saved/favourited properties |
| `/investors/transactions` | Transaction history |
| `/investors/notifications` | Notifications |
| `/investors/announcements` | Announcements |
| `/investors/chat` | Chat with admin |
| `/investors/settings` | Account settings |

### Partner portal (`/partners`)
| Path | Description |
|---|---|
| `/partners` | Dashboard |
| `/partners/properties` | Property listings |
| `/partners/properties/$propertyId/default` | Property detail |
| `/partners/promotions` | Promotions |
| `/partners/favourites` | Saved properties |
| `/partners/transactions` | Transactions |
| `/partners/notifications` | Notifications |
| `/partners/announcements` | Announcements |
| `/partners/chat` | Chat |
| `/partners/settings` | Settings |

### Admin dashboard (`/dashboard`)
Manages: properties, investors, partners, KYC, transactions, investments, blogs, FAQs, jobs, exit requests, resell, sub-admins, subscriptions, notifications, announcements, settings.

---

## Pagination

**Hook:** `src/helpers/pagination.tsx` — reads `page` from URL search params  
**Component:** `src/simpleComps/SimplePaginator.tsx` — renders prev/next/page buttons

Usage pattern:
```tsx
const { page, setPagination } = usePagination();
const query = useQuery({ queryKey: ["key", page], queryFn: () => apiClient.get("/endpoint", { params: { page } }) });
// ...
<SimplePaginator />
```

The paginator reads page state directly from URL params — no props needed.

---

## Shared UI Patterns

### PageLoader
`src/components/layout/PageLoader.tsx` — wraps a React Query result, handles loading/error/empty states.

```tsx
<PageLoader query={query}>
  {(response) => {
    const items = response.data.data;
    return <div>...</div>;
  }}
</PageLoader>
```

### Modals
`src/store/modals.ts` + `src/components/modals/DialogModal.tsx`

```tsx
const { ref, showModal, closeModal } = useModal();
<Modal ref={ref} title="Title">...</Modal>
<button onClick={showModal}>Open</button>
```

### Toast notifications
```tsx
import { toast } from "sonner";
toast.success("Done");
toast.error("Failed");
toast.info("Info");
```

### Currency formatting
All prices from the API are in **kobo** (1 NGN = 100 kobo). Always divide by 100 before display.

```ts
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(amount / 100);
```

---

## Investment Models

| API value | Display name | Route suffix |
|---|---|---|
| `OUTRIGHT_PURCHASE` | Outright Purchase | `/outright` |
| `LAND_BANKING` | Land Banking | `/land-banking` |
| `FRACTIONAL_OWNERSHIP` | Fractional Ownership | `/fractional` |
| `SAVE_TO_OWN` | Save to Own | `/save-to-own` |
| `CO_DEVELOPMENT` | Co-Development | `/default` |

Availability field varies by model:
- `FRACTIONAL_OWNERSHIP` → `availableShares`
- `LAND_BANKING` → `availablePlots` (stored as string, cast to number)
- All others → `availableUnits`

---

## Favourites Feature

**API base path:** `/favorites`

| Method | Endpoint | Action |
|---|---|---|
| `GET` | `/favorites?page=&limit=` | Fetch paginated favourites |
| `POST` | `/favorites/:propertyId` | Add to favourites (409 if duplicate) |
| `DELETE` | `/favorites/:propertyId` | Remove from favourites |

**Key files:**
- `src/components/favorites/FavoriteButton.tsx` — heart toggle button; caches all favourite IDs under React Query key `["favorites-ids"]` (shared across all card instances — only one network fetch per page load); uses optimistic updates
- `src/components/favorites/FavouriteCard.tsx` — card for the favourites listing page; accepts `role: "investor" | "partner"` to determine link routing
- `src/components/favorites/FavouritesPage.tsx` — paginated page component; used by both portals via a `role` prop
- `src/routes/investors/favourites/index.tsx` — investor route
- `src/routes/partners/favourites/index.tsx` — partner route

The `FavoriteButton` is embedded in the investor `PropertyCard` as an absolute-positioned overlay. To add it to a detail page, import and render `<FavoriteButton propertyId={id} size="md" />`.

---

## Real-Time (Socket.IO)

Sockets are initialised in the layout route files and torn down on unmount. Events listened to:

| Event | Handler |
|---|---|
| `announcement:new` | Toast + link to announcements page |
| `notification:new` | Toast + link to notifications page |
| `chat:newMessage` | Toast info |
| `connected` | Logs user data |

The investor layout additionally uses a Jotai atom (`userNewChatCountAtom`) for the chat badge in the sidebar.

---

## State Management

- **Auth / KYC:** Jotai atoms in `src/store/authStore.ts` (persisted to localStorage)
- **Server state:** TanStack React Query (no Redux, no Zustand)
- **Chat badge:** Jotai atom in `src/store/userChatSocket.ts`
- **Pagination:** URL search params via `usePagination()` hook
- **Modals:** Ref-based via `useModal()` from `src/store/modals.ts`

---

## Path Aliases

`@/` resolves to `src/`. Configured in `vite.config.ts` and `tsconfig.json`.

---

## Key Constraints

- **Never edit `src/routeTree.gen.ts`** — auto-generated by TanStack Router plugin.
- **KYC gate:** All investor/partner nav links except Dashboard and Settings are disabled until the user's KYC is verified. Respect this when adding new routes — set `alwaysEnabled: false` in the investor sidebar navLinks array.
- **All prices are in kobo** — divide by 100 for display, multiply by 100 when sending to the API.
- **Partner property detail pages** all route to `/default` regardless of investment model (the partner view does not differentiate).
- **Pre-existing TS errors** exist in `outright/index.tsx` and `save-to-own/index.tsx` — these are unrelated to the favourites feature and were present before.
- **Paystack** is used for payments; the inline JS instance is created at module level (`new PaystackPop()`).
- **Maps** use Leaflet (not Google Maps, despite `@types/google.maps` being installed for autocomplete).
