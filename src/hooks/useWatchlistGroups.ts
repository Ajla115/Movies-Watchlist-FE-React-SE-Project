import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { WatchlistGroup } from "../types/WatchlistGroup";
import { Movie } from "../types/Movie";
import {
  getAllWatchlistGroups,
  getMoviesByCategory,
  addWatchlistGroup,
  deleteWatchlistGroup,
  editWatchlistGroup,
} from "../api/watchlistGroupApi";

export const useWatchlistGroups = () => {
  const { data, isLoading, error } = useQuery<WatchlistGroup[]>({
    queryKey: ["categories"],
    queryFn: getAllWatchlistGroups,
  });

  return {
    categories: data || [],
    isLoading,
    error,
  };
};

export const useMoviesByCategory = (userId: string, groupId: string) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId || !groupId) return;

    const fetchMovies = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const moviesData = await getMoviesByCategory(userId, groupId);
        setMovies(moviesData);
      } catch (err: any) {
        console.error("Error fetching movies by category:", err);
        setError(err);
        toast.error("Failed to fetch movies by category");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [userId, groupId]);

  return { movies, isLoading, error };
};

export const useAddCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addWatchlistGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add category.");
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      deleteMovies,
    }: {
      groupId: number;
      deleteMovies: boolean;
    }) => deleteWatchlistGroup(groupId, deleteMovies),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      toast.success("Category deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete category.");
    },
  });
};

export const useEditCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupId, newName }: { groupId: number; newName: string }) =>
      editWatchlistGroup(groupId, newName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category renamed successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to rename category.");
    },
  });
};
