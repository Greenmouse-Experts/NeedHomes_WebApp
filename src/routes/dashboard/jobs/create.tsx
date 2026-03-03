import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/jobs/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/jobs/create"!</div>
}
