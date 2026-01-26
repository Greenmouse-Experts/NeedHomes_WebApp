import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/partners/properties/$propertyId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/partners/properties/$propertyId"!</div>
}
