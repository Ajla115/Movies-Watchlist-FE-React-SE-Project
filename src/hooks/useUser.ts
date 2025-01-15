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
  
    const toggleNotification = useMutation({
      mutationFn: () => toggleNotificationStatus(userId),
      onSuccess: () => {
        toast.success("Notification status is being changed.");
        queryClient.invalidateQueries({
          queryKey: ["notificationStatus", userId],
        });
      },
      onError: (error: Error) => {
        console.error("Failed to update notification status:", error);
        toast.error("Failed to update notification status.");
      },
    });
  
    return { toggleNotification };
  };

