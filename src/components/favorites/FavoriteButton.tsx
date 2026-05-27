import apiClient from "@/api/simpleApi";
import { extract_message } from "@/helpers/apihelpers";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { toast } from "sonner";

export default function FavoriteButton({
  propertyId,
  size = "sm",
}: {
  propertyId: string;
  size?: "sm" | "md";
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
        const resp = await apiClient.delete(`/favorites/${propertyId}`);
        return resp.data;
      } else {
        const resp = await apiClient.post(`/favorites/${propertyId}`);
        return resp.data;
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
