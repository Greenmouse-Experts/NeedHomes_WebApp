import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/save-to-own')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/save-to-own"!</div>
}
