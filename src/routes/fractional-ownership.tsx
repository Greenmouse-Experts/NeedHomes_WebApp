import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/fractional-ownership')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/fractional-ownership"!</div>
}
