import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Movie } from '../types/Movie';
import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = '/api/movies';

export const useMovies = (userId: number) => {
  const queryClient = useQueryClient();

  const { data: movies, isLoading } = useQuery<Movie[]>({
    queryKey: ['movies', userId],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/user/${userId}`);
      return response.data;
    }
  });

  const createMovie = useMutation<AxiosResponse, Error, Omit<Movie, 'movieId'>>({
    mutationFn: (newMovie) =>
      axios.post(`${API_BASE_URL}/user/${userId}`, newMovie),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies', userId] });
    },
  });

  type EditMovieVariables = {
    movieId: number;
    updatedMovie: Partial<Movie>;
  };

  const editMovie = useMutation<AxiosResponse, Error, EditMovieVariables>({
    mutationFn: ({ movieId, updatedMovie }) =>
      axios.put(`${API_BASE_URL}/${movieId}`, updatedMovie),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies', userId] });
    },
  });

  const deleteMovie = useMutation<AxiosResponse, Error, number>({
    mutationFn: (movieId) =>
      axios.delete(`${API_BASE_URL}/${movieId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies', userId] });
    },
  });

  return {
    movies,
    isLoading,
    createMovie: createMovie.mutate,
    editMovie: editMovie.mutate,
    deleteMovie: deleteMovie.mutate,
  };
};
