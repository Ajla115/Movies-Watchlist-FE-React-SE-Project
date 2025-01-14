import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAsWatchedApi } from "../api/movieApi";
import { toast } from "react-toastify";


export const useMarkAsWatched = (movieTitle: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, movieId }: { userId: string; movieId: string }) =>
      markAsWatchedApi(userId, movieId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      toast.success(`"${movieTitle}" marked as watched successfully!`);
    },
    onError: (error: any) => {
      if (error.response?.status === 400) {
        toast.warning(error.response.data);
      } else {
        console.error("Error marking movie as watched:", error);
        toast.error("Failed to mark the movie as watched");
      }
    },
  });
};
