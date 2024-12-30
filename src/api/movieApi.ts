import axios from "axios";
import { Movie, AddMovieDTO } from "../types/Movie";
import { API_BASE_URLS } from '../constants';

const API_URL = API_BASE_URLS.MOVIES;

export const getMoviesByUser = async (userId: string): Promise<Movie[]> => {
  const response = await axios.get(`${API_URL}/user/${userId}`);
  return response.data;
};

export const addMovie = async (userId: string, movie: AddMovieDTO): Promise<Movie> => {
  console.log('Adding movie with data:', movie); 
  const response = await axios.post(`${API_URL}/user/${userId}`, movie);
  return response.data;
};

export const editMovie = async (movieId: string, movie: AddMovieDTO): Promise<Movie> => {
  try {
    const response = await axios.put(`${API_URL}/${movieId}`, movie);
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
  await axios.delete(`${API_URL}/delete/${movieId}`);
};

export const filterMoviesByStatus = async (userId: string, status: string): Promise<Movie[]> => {

    const response = await axios.get(`${API_URL}/filter/status/user/${userId}`, {
      params: { status }
    });
    return response.data;
  };


export const filterMoviesByWatchlistOrder = async (userId: string, order: string): Promise<Movie[]> => {
  const response = await axios.get(`${API_URL}/filter/watchlist/user/${userId}`, {
    params: { order },
  });
  return response.data;
};


export const filterMoviesByGenre = async (userId: string, genreName: string): Promise<Movie[]> => {
  const response = await axios.get(`${API_URL}/filter/genre/user/${userId}`, {
    params: { genreName },
  });
  return response.data;
};

export const sortMoviesByWatchlistOrder = async (userId: string, order: string): Promise<Movie[]> => {
  const response = await axios.get(`${API_URL}/sort/watchlist/user/${userId}`, {
    params: { order },
  });
  return response.data;
};

export const markAsWatched = async (userId: string, movieId: string): Promise<string> => {
  const response = await axios.put(`${API_URL}/mark-watched/${userId}/${movieId}`);
  return response.data;
};

