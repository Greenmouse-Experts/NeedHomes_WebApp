import apiClient, { type ApiResponseV2 } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import { useQuery } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import SimplePaginator from "@/simpleComps/SimplePaginator";
import { usePagination } from "@/helpers/pagination";
import FavouriteCard, { type FavoriteItem } from "./FavouriteCard";

export default function FavouritesPage({
  role,
}: {
  role: "investor" | "partner";
}) {
  const { page } = usePagination();

  const query = useQuery<ApiResponseV2<FavoriteItem[]>>({
    queryKey: ["favorites", page],
    queryFn: async () => {
      const resp = await apiClient.get("/favorites", {
        params: { page, limit: 20 },
      });
      return resp.data;
    },
  });

  return (
    <ThemeProvider>
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-red-100 rounded-lg">
            <Heart className="h-6 w-6 text-red-500 fill-red-500" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Favourites
          </h1>
        </div>
        <p className="text-gray-600 text-sm sm:text-base">
          Properties you've saved for later.
        </p>
      </div>

      <PageLoader query={query}>
        {(response) => {
          const favorites = response.data.data ?? [];

          if (favorites.length === 0) {
            return (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Heart className="w-16 h-16 text-base-content/20 mb-4" />
                <h3 className="text-lg font-semibold text-base-content/60 mb-1">
                  No favourites yet
                </h3>
                <p className="text-sm text-base-content/40">
                  Save properties you're interested in and they'll appear here.
                </p>
                <SimplePaginator />
              </div>
            );
          }

          return (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6">
                {favorites.map((item) => (
                  <FavouriteCard key={item.id} item={item} role={role} />
                ))}
              </div>
              <SimplePaginator />
            </div>
          );
        }}
      </PageLoader>
    </ThemeProvider>
  );
}
