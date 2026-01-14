import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/investors')({
  component: InvestorsLayout,
})

function InvestorsLayout() {
  return <Outlet />
}
