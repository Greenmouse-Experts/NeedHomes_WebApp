# Real-Time and Sockets

NeedHomes uses **Socket.IO** to provide real-time updates and notifications across all three portals.

## Implementation Details

### Connection Lifecycle
Sockets are typically initialized within the top-level layout routes (`route.tsx`) for each portal:
- **Investor Portal:** `src/routes/investors/route.tsx`
- **Partner Portal:** `src/routes/partners/route.tsx`

The connection is established when the user enters the portal and is cleanly torn down when they leave (on component unmount).

## Supported Events

The frontend listens for the following global events:

| Event Name | Purpose | Action Taken |
|---|---|---|
| `announcement:new` | New platform-wide announcement | Displays a toast and provides a link to the announcements page. |
| `notification:new` | Targeted user notification | Displays a toast and provides a link to the notifications page. |
| `chat:newMessage` | New message in a support/admin chat | Displays an info toast. |
| `connected` | Successful socket handshake | Logs user data for debugging. |

## Feature Integrations

### 1. Chat Badge
In the Investor portal, the `userNewChatCountAtom` (a Jotai atom found in `src/store/userChatSocket.ts`) is updated via socket events to show a real-time message count badge in the sidebar.

### 2. Live Notifications
We use the `sonner` toast library to immediately inform users of new notifications or announcements, regardless of their current page within the portal.

## Admin-to-User Communication
The admin dashboard (`/dashboard`) includes tools for triggering these events on the backend, enabling real-time support and platform updates.
