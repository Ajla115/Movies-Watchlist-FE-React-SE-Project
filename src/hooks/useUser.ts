import { useMutation } from '@tanstack/react-query';
import { User } from '../types/User';
import axios from 'axios';

const API_BASE_URL = '/api/users';

export const useUser = () => {
  const loginUser = useMutation({
    mutationFn: (email: string) => 
      axios.post(`${API_BASE_URL}/login`, { email }),
    onSuccess: (data: { data: number }) => {
      // Handle successful login, e.g., save user ID
      localStorage.setItem('userId', data.data.toString());
    },
  });

  const toggleNotifications = useMutation({
    mutationFn: (userId: number) =>
      axios.put(`${API_BASE_URL}/change-notification-status/${userId}`)
  });

  return { loginUser, toggleNotifications };
};
