import axios from "axios";
import { Movie, AddMovieDTO } from "../types/Movie";
import { API_BASE_URL } from '../constants';


export const getMoviesByUser = async (userId: string): Promise<Movie[]> => {
  const response = await axios.get(`${API_BASE_URL}/movies/user/${userId}`);
  return response.data;
};

export const addMovie = async (userId: string, movie: AddMovieDTO): Promise<Movie> => {
  console.log('Adding movie with data:', movie); 
  const response = await axios.post(`${API_BASE_URL}/movies/user/${userId}`, movie);
  return response.data;
};

export const editMovie = async (movieId: string, movie: AddMovieDTO): Promise<Movie> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/movies/${movieId}`, movie);
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

export const markAsWatched = async (userId: string, movieId: string): Promise<string> => {
  const response = await axios.put(`${API_BASE_URL}/movies/mark-watched/${userId}/${movieId}`);
  return response.data;
};

