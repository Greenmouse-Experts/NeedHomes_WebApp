import apiClient from "@/api/simpleApi";
import { extract_message } from "@/helpers/apihelpers";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { toast } from "sonner";

async function fetchAllFavoriteIds(): Promise<Set<string>> {
  const ids = new Set<string>();
  let page = 1;
  while (true) {
    const resp = await apiClient.get("/favorites", {
      params: { page, limit: 100 },
    });
    const { data, meta } = resp.data.data;
    data.forEach((fav: any) => ids.add(fav.property.id));
    if (page >= meta.totalPages) break;
    page++;
  }
  return ids;
}

export default function FavoriteButton({
  propertyId,
  size = "sm",
}: {
  propertyId: string;
  size?: "sm" | "md";
}) {
  const queryClient = useQueryClient();

  const { data: favoriteIds, isLoading } = useQuery({
    queryKey: ["favorites-ids"],
    queryFn: fetchAllFavoriteIds,
    staleTime: 5 * 60 * 1000,
  });

  const isFavorited = favoriteIds?.has(propertyId) ?? false;

  const mutation = useMutation({
    mutationFn: async () => {
      if (isFavorited) {
        const resp = await apiClient.delete(`/favorites/${propertyId}`);
        return resp.data;
      } else {
        const resp = await apiClient.post(`/favorites/${propertyId}`);
        return resp.data;
      }
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["favorites-ids"] });
      const prev = queryClient.getQueryData<Set<string>>(["favorites-ids"]);
      const next = new Set(prev);
      if (isFavorited) {
        next.delete(propertyId);
      } else {
        next.add(propertyId);
      }
      queryClient.setQueryData(["favorites-ids"], next);
      return { prev };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(["favorites-ids"], context?.prev);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  const btnSize = size === "md" ? "btn-md" : "btn-sm";

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const removing = isFavorited;
        toast.promise(mutation.mutateAsync(), {
          loading: removing ? "Removing from favorites…" : "Adding to favorites…",
          success: extract_message,
          error: extract_message,
        });
      }}
      disabled={mutation.isPending || isLoading}
      className={`btn btn-circle ${btnSize} ${
        isFavorited
          ? "bg-red-500 hover:bg-red-600 border-red-500 text-white"
          : "btn-ghost bg-base-100/80 backdrop-blur hover:bg-base-100"
      }`}
      title={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={`${size === "md" ? "w-5 h-5" : "w-4 h-4"} ${
          isFavorited ? "fill-current" : "text-base-content/70"
        }`}
      />
    </button>
  );
}
