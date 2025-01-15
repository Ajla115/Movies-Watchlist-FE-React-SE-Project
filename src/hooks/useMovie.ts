import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { markAsWatchedApi, deleteMovie, getMoviesByUser, addMovie, editMovie, getFilteredMovies } from "../api/movieApi";
import { Movie, AddMovieDTO } from "../types/Movie";
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

export const useDeleteMovie = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (movieId: string) => deleteMovie(movieId),
      onSuccess: () => {
        toast.success("Movie deleted successfully!");
        queryClient.invalidateQueries({ queryKey: ["movies"] });
      },
      onError: (error: any) => {
        console.error("Error deleting movie:", error);
        toast.error("Failed to delete the movie");
      },
    });
  };


  export const useGetMoviesByUser = (userId: string, filtersApplied: boolean) => {
    return useQuery<Movie[], Error>({
      queryKey: ["movies", userId],
      queryFn: () => getMoviesByUser(userId),
      enabled: !!userId && !filtersApplied, 
    });
  };

  export const useAddMovie = (userId: string) => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (newMovie: AddMovieDTO) => addMovie(userId, newMovie),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["movies", userId] });
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        toast.success("Movie added successfully!");
      },
      onError: (error: any) => {
        console.error("Error adding movie:", error);
        toast.error("Failed to add movie. Please try again.");
      },
    });
  };

  export const useEditMovie = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: ({ movieId, movieData }: { movieId: string; movieData: AddMovieDTO }) =>
        editMovie(movieId, movieData),
      onSuccess: () => {
        toast.success("Movie updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["movies"] });
        queryClient.invalidateQueries({ queryKey: ["categories"] });
      },
      onError: (error: any) => {
        console.error("Error updating movie:", error);
        toast.error("Failed to update the movie.");
      },
    });
  };

  export const useFilteredMovies = (
    userId: string,
    filters: {
      genre?: string;
      status?: string;
      watchlistOrder?: string;
      sort?: string;
      categoryId?: string;
    },
    filtersApplied: boolean
  ) => {
    return useQuery<Movie[], Error>({
      queryKey: [
        "movies",
        userId,
        filters.genre,
        filters.status,
        filters.watchlistOrder,
        filters.sort,
        filters.categoryId,
      ],
      queryFn: () => getFilteredMovies(userId, filters),
      enabled: filtersApplied && !!userId, 
    });
  };
  