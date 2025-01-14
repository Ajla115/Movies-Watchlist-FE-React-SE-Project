import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  getNotificationStatus,
  loginUserApi,
  toggleNotificationStatus,
} from "../api/userApi";
import { useEffect, useState } from "react";


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

  // Fetch the initial notification status when the hook is used
  useEffect(() => {
    const fetchNotificationStatus = async () => {
      try {
        const status = await getNotificationStatus(userId);
        setEmailEnabled(status);
      } catch (error) {
        console.error("Failed to fetch initial notification status:", error);
        toast.error("Failed to load notification status.");
      }
    };

    if (userId) {
      fetchNotificationStatus();
    }
  }, [userId]);

  const toggleNotification = useMutation({
    mutationFn: () => toggleNotificationStatus(userId),
    onSuccess: async () => {
      try {
        const currentStatus = await getNotificationStatus(userId);
        toast.success(
          `Notification status was ${currentStatus ? "On" : "Off"} and now it is being updated.`
        );
        setEmailEnabled(!currentStatus); // Toggle the local state after showing the toast
        queryClient.invalidateQueries({
          queryKey: ["notificationStatus", userId],
        });
      } catch (error) {
        console.error("Failed to refetch notification status after toggle:", error);
        toast.error("Failed to update notification status.");
      }
    },
    onError: (error: Error) => {
      console.error("Failed to update notification status:", error);
      toast.error("Failed to update notification status.");
    },
  });

  return { emailEnabled, toggleNotification };
};


