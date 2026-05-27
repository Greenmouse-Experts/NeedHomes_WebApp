import apiClient from "@/api/simpleApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { toast } from "sonner";

export default function PageFavoriteButton({
  propertyId,
}: {
  propertyId: string;
}) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["favorite-check", propertyId],
    queryFn: async () => {
      const resp = await apiClient.get(`/favorites/${propertyId}/check`);
      return resp.data as { data: { isFavorited: boolean } };
    },
    staleTime: 5 * 60 * 1000,
  });

  const isFavorited = data?.data?.isFavorited ?? false;

  const mutation = useMutation({
    mutationFn: async () => {
      if (isFavorited) {
        await apiClient.delete(`/favorites/${propertyId}`);
      } else {
        await apiClient.post(`/favorites/${propertyId}`);
      }
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["favorite-check", propertyId] });
      const prev = queryClient.getQueryData(["favorite-check", propertyId]);
      queryClient.setQueryData(["favorite-check", propertyId], {
        data: { isFavorited: !isFavorited },
      });
      return { prev };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(["favorite-check", propertyId], context?.prev);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  return (
    <button
      onClick={() => {
        const removing = isFavorited;
        toast.promise(mutation.mutateAsync(), {
          loading: removing ? "Removing from favorites…" : "Saving to favorites…",
          success: removing ? "Removed from favorites" : "Saved to favorites",
          error: "Failed to update favorites",
        });
      }}
      disabled={mutation.isPending || isLoading}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors w-full sm:w-auto ${
        isFavorited
          ? "border-red-300 text-red-600 bg-red-50 hover:bg-red-100"
          : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
      }`}
    >
      <Heart
        className={`w-4 h-4 transition-colors ${
          isFavorited ? "fill-red-500 text-red-500" : "text-gray-500"
        }`}
      />
      {isFavorited ? "Saved" : "Save"}
    </button>
  );
}
