import React from "react";
import { Switch, Typography, Box } from "@mui/material";
import { toast } from "react-toastify";
import { useNotificationToggle } from "../api/userApi";

interface NotificationToggleProps {
  userId: string;
}

const NotificationToggle: React.FC<NotificationToggleProps> = ({ }) => {
  const { emailEnabled, toggleNotification } = useNotificationToggle();

  const handleToggle = async () => {
    try {
      await toggleNotification.mutateAsync();
      toast.success(
        `Notifications ${emailEnabled ? "disabled" : "enabled"} successfully!`
      );
    } catch (error) {
      toast.error("Failed to update notification status.");
    }
  };

  return (
    <Box display="flex" alignItems="center" gap={2}>
      <Typography>
        Notifications: {emailEnabled ? "On" : "Off"}
      </Typography>
      <Switch
  checked={emailEnabled}
  onChange={handleToggle}
  sx={{
    "& .MuiSwitch-switchBase.Mui-checked": {
      color: "#2D6A4F", 
    },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
      backgroundColor: "#2D6A4F", 
    },
    "& .MuiSwitch-track": {
      backgroundColor: "#e0e0e0", 
    },
  }}
/>
    </Box>
  );
};

export default NotificationToggle;
