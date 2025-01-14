import React, { useEffect, useState } from "react";
import { Button, Typography, Box } from "@mui/material";
import { toast } from "react-toastify";
import { useNotificationToggle } from "../hooks/useUser"; 

interface NotificationButtonProps {
  userId: string;
}

const NotificationButton: React.FC<NotificationButtonProps> = ({ userId }) => {
  const { emailEnabled, toggleNotification } = useNotificationToggle(userId);

  const handleToggle = async () => {
    try {
      await toggleNotification.mutateAsync();
    } catch (error) {
      console.error("Error toggling notification:", error);
    }
  };

  return (
    <Box display="flex" alignItems="center" gap={2}>
      <Typography>
        Notifications: {emailEnabled ? "On" : "Off"}
      </Typography>
      <Button
        variant="contained"
        onClick={handleToggle}
        sx={{
          backgroundColor: "#52B788",
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "#2D6A4F",
          },
        }}
      >
        Change your notification status
      </Button>
    </Box>
  );
};

export default NotificationButton;

