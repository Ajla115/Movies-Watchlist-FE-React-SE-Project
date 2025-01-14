import axios from "axios";
import { Movie, AddMovieDTO } from "../types/Movie";
import { API_BASE_URL } from '../constants';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";


export const getMoviesByUser = async (userId: string): Promise<Movie[]> => {
  const response = await axios.get(`${API_BASE_URL}/movies/get-all/user/${userId}`);
  return response.data;
};

export const addMovie = async (userId: string, movie: AddMovieDTO): Promise<Movie> => {
  const response = await axios.post(`${API_BASE_URL}/movies/add/user/${userId}`, movie);
  return response.data;
};

export const editMovie = async (movieId: string, movie: AddMovieDTO): Promise<Movie> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/movies/edit/${movieId}`, movie);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error editing movie:', error.response || error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};


export const deleteMovie = async (movieId: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/movies/delete/${movieId}`);
};

export const filterMoviesByStatus = async (userId: string, status: string): Promise<Movie[]> => {

    const response = await axios.get(`${API_BASE_URL}/movies/filter/status/user/${userId}`, {
      params: { status }
    });
    return response.data;
  };


export const filterMoviesByWatchlistOrder = async (userId: string, order: string): Promise<Movie[]> => {
  const response = await axios.get(`${API_BASE_URL}/movies/filter/watchlist/user/${userId}`, {
    params: { order },
  });
  return response.data;
};


export const filterMoviesByGenre = async (userId: string, genreName: string): Promise<Movie[]> => {
  const response = await axios.get(`${API_BASE_URL}/movies/filter/genre/user/${userId}`, {
    params: { genreName },
  });
  return response.data;
};

export const sortMoviesByWatchlistOrder = async (userId: string, order: string): Promise<Movie[]> => {
  const response = await axios.get(`${API_BASE_URL}/movies/sort/watchlist/user/${userId}`, {
    params: { order },
  });
  return response.data;
};

export const useMarkAsWatched = (movieTitle: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, movieId }: { userId: string; movieId: string }) => {
      await axios.put(`${API_BASE_URL}/movies/mark-watched/${userId}/${movieId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
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


export const getFilteredMovies = async (
  userId: string,
  filters: {
    genre?: string;
    status?: string;
    watchlistOrder?: string;
    sort?: string;
    categoryId?: string;
  }
): Promise<Movie[]> => {
  const queryParams: { [key: string]: string | undefined } = {};

  // Only add parameters that are defined
  if (filters.genre) queryParams.genre = filters.genre;
  if (filters.status) queryParams.status = filters.status;
  if (filters.watchlistOrder) queryParams.watchlistOrder = filters.watchlistOrder;
  if (filters.sort) queryParams.sort = filters.sort;
  if (filters.categoryId) queryParams.categoryId = filters.categoryId;

  const response = await axios.get(`${API_BASE_URL}/movies/filter/user/${userId}`, {
    params: queryParams, // Send query parameters only for defined filters
  });

  if (response.status !== 200) {
    throw new Error("Failed to fetch filtered movies");
  }

  return response.data;
};
