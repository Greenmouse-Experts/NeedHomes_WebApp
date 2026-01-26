import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/partners/my-investments')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/partners/my-investments"!</div>
}
