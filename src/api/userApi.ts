import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URLS } from '../constants';

const API_URL = API_BASE_URLS.USERS;

export const useNotificationToggle = () => {
  const [emailEnabled, setEmailEnabled] = useState<boolean>(true);
  const userId = localStorage.getItem("userId"); 

  
  useEffect(() => {
    const fetchNotificationStatus = async () => {
      if (!userId) return;

      try {
        const response = await axios.get(`${API_URL}/${userId}`);
        setEmailEnabled(response.data.emailEnabled);
      } catch (error) {
        console.error("Failed to fetch notification status:", error);
      }
    };

    fetchNotificationStatus();
  }, [userId]);

 
  const toggleNotification = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error("User ID not found");

      await axios.put(`${API_URL}/change-notification-status/${userId}`);
      setEmailEnabled((prev) => !prev); 
    },
    onError: (error) => {
      console.error("Failed to toggle notification status:", error);
    },
  });

  
  const loginUser = useMutation({
    mutationFn: (email: string) => axios.post(`${API_URL}/login`, { email }),
    onSuccess: (data: { data: number }) => {
      localStorage.setItem("userId", data.data.toString());
    },
    onError: (error) => {
      console.error("Failed to log in:", error);
    },
  });

  return {
    emailEnabled,
    toggleNotification,
    loginUser,
  };
};

