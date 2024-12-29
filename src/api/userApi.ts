import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const API_URL = "http://localhost:8080/api/users";

export const useNotificationToggle = () => {
  const [emailEnabled, setEmailEnabled] = useState<boolean>(true);
  const userId = localStorage.getItem("userId"); // Retrieve user ID from localStorage

  // Fetch the current notification status when the hook is used
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

  // Mutation to toggle the notification status
  const toggleNotification = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error("User ID not found");

      await axios.put(`${API_URL}/change-notification-status/${userId}`);
      setEmailEnabled((prev) => !prev); // Update the local state
    },
    onError: (error) => {
      console.error("Failed to toggle notification status:", error);
    },
  });

  
  // Mutation to log in a user
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

