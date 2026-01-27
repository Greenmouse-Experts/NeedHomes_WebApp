import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/coporate/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/coporate/"!</div>
}
