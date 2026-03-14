# Terms & Conditions System

## Overview

The terms system manages legal documents for four user types. Admins create and manage documents through the dashboard; users read them during signup. Content is stored as HTML (authored via a rich-text editor) and served through a public API.

---

## Term Types

| Type | Who it applies to |
|---|---|
| `INVESTOR_INDIVIDUAL` | Individual investor signups |
| `INVESTOR_CORPORATE` | Corporate investor signups |
| `PARTNER_REAL_ESTATE_AGENT` | Real estate agent partner signups |
| `PARTNER_PROPERTY_DEVELOPER` | Property developer partner signups |

Only one document can exist per type at a time.

---

## File Structure

```
src/
├── routes/
│   ├── terms/
│   │   └── $termsId.tsx              # Public-facing terms page (read-only)
│   └── dashboard/
│       └── terms/
│           ├── index.tsx             # Admin list view
│           ├── create.tsx            # Admin create form
│           ├── edit/
│           │   └── $termsId.tsx      # Admin edit form
│           └── view/
│               └── termsId.tsx       # Admin detail view
├── components/
│   └── terms/
│       └── RichTextEditor.tsx        # Shared TipTap WYSIWYG editor
```

---

## Admin Flows (`/dashboard/terms`)

### List — `index.tsx`
- Fetches all terms via `GET /terms`
- Displays each document as a card showing: type badge, version, title, content preview, last updated
- Actions per card: **View**, **Edit**, **Delete**
  - View → `/dashboard/terms/view/termsId?type=<TYPE>`
  - Edit → `/dashboard/terms/edit/<TYPE>`
  - Delete → `DELETE /terms?type=<TYPE>` with confirm dialog

### Create — `create.tsx`
- Form fields: Document Type (select), Version, Title, Content (rich text)
- Submits to `POST /terms`
- Navigates back to list on success
- Returns `409 Conflict` if a document for that type already exists

### Edit — `edit/$termsId.tsx`
- Route param `$termsId` = the terms type (e.g. `INVESTOR_INDIVIDUAL`)
- Fetches existing document via `GET /terms?type=<termsId>` on mount
- Pre-fills form fields including the rich-text editor content
- Type field is shown as read-only (cannot be changed after creation)
- Submits to `PATCH /terms?type=<termsId>`

### View — `view/termsId.tsx`
- Accepts `?type=<TYPE>` search param
- Fetches document and renders the HTML content with prose styling
- Includes an Edit shortcut button in the header

---

## Rich Text Editor (`RichTextEditor.tsx`)

Built on [TipTap](https://tiptap.dev/) with the following extensions:

| Extension | Toolbar controls |
|---|---|
| StarterKit | Bold, Italic, H2, H3, Bullet list, Numbered list, Undo, Redo |
| Underline | Underline |
| TextAlign | Align left, center, right |
| Placeholder | Empty state hint text |

**Important — async content loading:**
The editor uses a `useRef(initialized)` flag to load content exactly once after the initial empty state is replaced by fetched data (via React Hook Form's `reset()`). This prevents cursor-jump issues during editing while still correctly populating the editor on edit page load.

---

## Public Terms Pages (`/terms/$termsId`)

Accessible without authentication. The route param is the terms type.

- Fetches via `GET /terms?type=<termsId>`
- Renders with the same visual style as the static `/terms-and-conditions` page: dark header, prose content section, contact footer
- Shows loading skeleton while fetching, error message on failure
- Used during signup so users can review the terms applicable to their account type before agreeing

---

## Signup Integration

### Investor signup (`/signup`)
| Form tab | Terms link target |
|---|---|
| Individual | `/terms/INVESTOR_INDIVIDUAL` |
| Corporate | `/terms/INVESTOR_CORPORATE` |

### Partner signup (`/signup-partner`)
The terms link dynamically resolves based on the selected `partnerType` field:

| Selected partner type | Terms link target |
|---|---|
| `REAL_ESTATE_AGENT` | `/terms/PARTNER_REAL_ESTATE_AGENT` |
| `PROPERTY_DEVELOPER` | `/terms/PARTNER_PROPERTY_DEVELOPER` |

All terms links open in a new tab (`target="_blank"`).

---

## API Reference

Base path: `/terms`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/terms` | None | Fetch all terms documents |
| `GET` | `/terms?type=<TYPE>` | None | Fetch single document by type |
| `POST` | `/terms` | Admin | Create new document |
| `PATCH` | `/terms?type=<TYPE>` | Admin | Update document (title, content, version) |
| `DELETE` | `/terms?type=<TYPE>` | Admin | Delete document |

Admin requests use the Bearer token managed by `simpleApi.ts` interceptors.
