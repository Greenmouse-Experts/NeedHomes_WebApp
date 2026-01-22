import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/partners/$partnerId')({
  component: PartnerLayout,
})

function PartnerLayout() {
  return <Outlet />
}
