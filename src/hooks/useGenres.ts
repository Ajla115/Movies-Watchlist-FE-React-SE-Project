import { useQuery } from '@tanstack/react-query';
import { Genre } from '../types/Genre';
import axios from 'axios';

const API_BASE_URL = '/api/genres';

export const useGenres = () => {
  const { data: genres, isLoading } = useQuery<Genre[]>({
    queryKey: ['genres'],
    queryFn: async () => {
      const response = await axios.get(API_BASE_URL);
      return response.data;
    }
  });

  return { genres, isLoading };
};
