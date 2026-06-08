# Frontend Architecture

This document provides an overview of the technical stack and architectural patterns used in the NeedHomes WebApp.

## Technical Stack

The application is built using a modern React ecosystem:

| Layer | Library / Version | Purpose |
|---|---|---|
| **Framework** | React 19 | Component-based UI library |
| **Routing** | TanStack Router | Type-safe, file-based routing |
| **Data Fetching** | TanStack Query | Server state management and caching |
| **Styling** | Tailwind CSS v4 + DaisyUI v5 | Utility-first CSS and component library |
| **State Management** | Jotai v2 | Atomic local state with persistence |
| **Form Management** | React Hook Form + Zod | Type-safe form handling and validation |
| **HTTP Client** | Axios | Custom instance with interceptors for auth |
| **Real-time** | Socket.IO | Bi-directional event-based communication |
| **Build Tool** | Vite 7 | Modern frontend build tool |

## Core Patterns

### 1. File-Based Routing
We use TanStack Router's file-based system. Routes are defined in `src/routes/`. The router automatically generates types in `src/routeTree.gen.ts`.
- **Layouts:** `route.tsx` or `__root.tsx` files define shared UI (sidebars, headers).
- **Pages:** `index.tsx` files represent the route's endpoint.
- **Private Components:** Folders prefixed with `-` (e.g., `-components/`) are ignored by the router.

### 2. Server State vs. Local State
- **Server State:** Handled exclusively by TanStack Query. We use `PageLoader` to wrap query results and handle loading/error states consistently.
- **Local State:** Small, isolated states use React `useState`. Global or persisted state (like Auth/KYC) uses **Jotai**.

### 3. UI Consistency
- **Shared Components:** Found in `src/components/` and `src/simpleComps/`.
- **PageLoader:** Standard wrapper for data-fetching pages.
- **Modals:** Managed via a ref-based system in `src/store/modals.ts`.
- **Toasts:** Handled by `sonner`.

### 4. Currency and Formatting
All prices from the API are in **kobo**. 
- **Display:** Always divide by 100 and use `Intl.NumberFormat` for Naira (NGN).
- **API Requests:** Always multiply by 100 before sending to the backend.

## Environment Configuration
The application uses environment variables prefixed with `VITE_`.
- `VITE_BACKEND_URL`: Points to the API server (Staging: `https://needhomes-backend-staging.onrender.com`).
