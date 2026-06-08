# Authentication and API Integration

This document details how authentication, KYC gating, and API communication are handled in the NeedHomes WebApp.

## API Client

**Location:** `src/api/simpleApi.ts`

We use a customized Axios instance for all network requests.

### Features
1. **Base URL:** Automatically set to the staging or production backend.
2. **Auth Header:** An interceptor automatically attaches the `Authorization: Bearer <token>` header by reading the token from the Jotai auth store.
3. **Token Refresh:** If a request fails with a `401 Unauthorized` error, the client attempts to refresh the token via `POST /auth/refresh`. If successful, the original request is retried. If the refresh fails, the user is logged out.
4. **Standard Response Envelopes:**
   - **Single Item:** `{ message, data: T, statusCode, path }`
   - **Paginated:** `{ message, data: { data: T, meta: { total, page, limit, totalPages } }, statusCode, path }`

## Authentication Store

**Location:** `src/store/authStore.ts`

We use **Jotai** for managing auth state, with persistence to `localStorage` under the key `"user"`.

### Key Hooks/Functions
- `useAuth()`: Hook to get and set the current user/token record.
- `get_user_value()`: Synchronous helper to read the current auth state outside of React (e.g., in Axios interceptors).
- `show_logout()`: Triggers the global logout confirmation modal.

## KYC Gating

NeedHomes requires users to complete Know Your Customer (KYC) verification before accessing investment features.

### Implementation
- KYC state is stored in Jotai and persisted to `localStorage` under `"kyc"`.
- **Gating Logic:** In the sidebars for the Investor and Partner portals, navigation links are disabled if `kyc.account_verification_status !== "VERIFIED"`.
- **Exceptions:** Routes like "Dashboard" and "Settings" are typically always enabled to allow users to update their profile or check status.

## Error Handling
- We use `sonner` for toast notifications on API errors.
- The `PageLoader` component handles the high-level error states for data-fetching operations.
