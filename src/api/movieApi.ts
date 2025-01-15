import axios from "axios";
import { Movie, AddMovieDTO } from "../types/Movie";
import { API_BASE_URL } from '../constants';

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

  if (filters.genre) queryParams.genre = filters.genre;
  if (filters.status) queryParams.status = filters.status;
  if (filters.watchlistOrder) queryParams.watchlistOrder = filters.watchlistOrder;
  if (filters.sort) queryParams.sort = filters.sort;
  if (filters.categoryId) queryParams.categoryId = filters.categoryId;

  const response = await axios.get(`${API_BASE_URL}/movies/filter/user/${userId}`, {
    params: queryParams, 
  });

  if (response.status !== 200) {
    throw new Error("Failed to fetch filtered movies");
  }

  return response.data;
};


export const deleteMovie = async (movieId: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/movies/delete/${movieId}`);
};


export const markAsWatchedApi = async (userId: string, movieId: string): Promise<void> => {
  await axios.put(`${API_BASE_URL}/movies/mark-watched/${userId}/${movieId}`);
};

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
