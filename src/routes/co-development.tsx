import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/co-development')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/co-development"!</div>
}
