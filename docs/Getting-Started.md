# Getting Started

This guide explains how to set up and run the NeedHomes WebApp development environment.

## Prerequisites

- **Bun:** This project uses `bun` as its primary package manager and runtime. Ensure it is installed on your system.
- **Node.js:** While we use Bun, some tools may still rely on Node.js (v18+ recommended).

## Installation

Clone the repository and install dependencies using Bun:

```bash
bun install
```

## Development Server

To start the development server with Hot Module Replacement (HMR):

```bash
bun run dev
```
The application will be available at `http://localhost:3000` (or the next available port).

## Environment Variables

Create a `.env` file in the project root to override default settings.

| Variable | Default / Purpose |
|---|---|
| `VITE_BACKEND_URL` | `https://needhomes-backend-staging.onrender.com` |

Note: All frontend environment variables must be prefixed with `VITE_`.

## Available Scripts

| Command | Description |
|---|---|
| `bun run dev` | Starts the Vite development server. |
| `bun run build` | Creates a production-ready build in the `dist/` directory. |
| `bun run preview` | Serves the production build locally for testing. |
| `bun run test` | Runs the test suite using Vitest. |

## Project Portals

The app contains three main entry points:
- **Investors:** `/investors`
- **Partners:** `/partners`
- **Admin Dashboard:** `/dashboard`

## Deployment

The project is configured for deployment on **Netlify** (see `netlify.toml`). Production builds are automatically triggered by pushes to the main branch in supported CI/CD environments.
