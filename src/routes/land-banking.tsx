import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/land-banking')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/land-banking"!</div>
}
