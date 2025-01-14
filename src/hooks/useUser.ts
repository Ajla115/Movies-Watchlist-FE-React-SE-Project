import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  getNotificationStatus,
  loginUserApi,
  toggleNotificationStatus,
} from "../api/userApi";
import { useState } from "react";

export const useGetNotificationStatus = (userId: string) => {
  const { data, error, isLoading } = useQuery<boolean, Error>({
    queryKey: ["notificationStatus", userId],
    queryFn: () => getNotificationStatus(userId),
    enabled: !!userId,
  });
  if (error) {
    toast.error("Failed to fetch notification status.");
  }
  return { data, isLoading, error };
};

export const useLoginUser = () => {
  return useMutation({
    mutationFn: loginUserApi,
    onError: () => {
      toast.error("Failed to log in. Please try again.");
    },
  });
};

export const useNotificationToggle = (userId: string) => {
  const queryClient = useQueryClient();
  const [emailEnabled, setEmailEnabled] = useState<boolean>(false);

  const toggleNotification = useMutation({
    mutationFn: () => toggleNotificationStatus(userId),
    onSuccess: () => {
      setEmailEnabled((prev) => !prev);
      queryClient.invalidateQueries({
        queryKey: ["notificationStatus", userId],
      });
      toast.success("Notification status updated!");
    },
    onError: (error: Error) => {
      console.error("Failed to update notification status:", error);
      toast.error("Failed to update notification status.");
    },
  });

  return { emailEnabled, toggleNotification };
};
