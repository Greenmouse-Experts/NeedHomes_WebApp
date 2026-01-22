import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/properties/$propertyId')({
  component: PropertyLayout,
})

function PropertyLayout() {
  return <Outlet />
}
