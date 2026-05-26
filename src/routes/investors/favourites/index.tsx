import { createFileRoute } from "@tanstack/react-router";
import FavouritesPage from "@/components/favorites/FavouritesPage";

export const Route = createFileRoute("/investors/favourites/")({
  component: () => <FavouritesPage role="investor" />,
});
