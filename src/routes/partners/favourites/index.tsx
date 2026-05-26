import { createFileRoute } from "@tanstack/react-router";
import FavouritesPage from "@/components/favorites/FavouritesPage";

export const Route = createFileRoute("/partners/favourites/")({
  component: () => <FavouritesPage role="partner" />,
});
