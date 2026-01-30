import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/outright-purchase')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/outright-purchase"!</div>
}
