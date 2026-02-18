import ChatPage from "@/routes/-components/Chatpage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/partners/chat/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ChatPage></ChatPage>;
}
