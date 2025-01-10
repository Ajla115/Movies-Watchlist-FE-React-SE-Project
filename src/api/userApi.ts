import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";
import { API_BASE_URL } from '../constants';


export const getNotificationStatus = async (userId: string): Promise<boolean> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/notification-status/${userId}`);
    return response.data.emailEnabled;
  } catch (error) {
    console.error("Failed to fetch notification status:", error);
    throw new Error("Unable to fetch notification status");
  }
};

export const useNotificationToggle = () => {
  const [emailEnabled, setEmailEnabled] = useState<boolean>(true);
  const userId = localStorage.getItem("userId"); 

  const fetchNotificationStatus = async () => {
    if (!userId) return;
    try {
      const status = await getNotificationStatus(userId);
      setEmailEnabled(status); 
    } catch (error) {
      console.error("Error fetching initial notification status:", error);
      toast.error("Failed to fetch notification status.");
    }
  };
  
  useEffect(() => {
    fetchNotificationStatus();
  }, [userId]);
  
  

 
  const toggleNotification = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error("User ID not found");

      await axios.put(`${API_BASE_URL}/users/change-notification-status/${userId}`);
      setEmailEnabled((prev) => !prev); 
    },
    onError: (error) => {
      console.error("Failed to toggle notification status:", error);
    },
  });

  
  const loginUser = useMutation({
    mutationFn: (email: string) => axios.post(`${API_BASE_URL}/users/login`, { email }),
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

