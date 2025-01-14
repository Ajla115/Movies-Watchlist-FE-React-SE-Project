import axios from "axios";
import { API_BASE_URL } from "../constants";

export const getNotificationStatus = async (
  userId: string
): Promise<boolean> => {
  const response = await axios.get(
    `${API_BASE_URL}/users/notification-status/${userId}`
  );
  return response.data.emailEnabled;
};

export const toggleNotificationStatus = async (
  userId: string
): Promise<void> => {
  if (!userId) throw new Error("User ID not found");
  await axios.put(`${API_BASE_URL}/users/change-notification-status/${userId}`);
};

export const loginUserApi = async (email: string): Promise<number> => {
  const response = await axios.post(`${API_BASE_URL}/users/login`, { email });
  return response.data;
};
