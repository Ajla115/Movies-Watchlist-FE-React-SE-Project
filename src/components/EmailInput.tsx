
import React, { useState } from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URLS } from '../constants';

const API_URL = API_BASE_URLS.USERS;

const EmailInput: React.FC = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const loginUser = useMutation({
    mutationFn: (email: string) =>
      axios.post(`${API_URL}/login`, email, {
        headers: {
          "Content-Type": "text/plain",
        },
      }),
    onSuccess: (data) => {
      const userId = data.data;
      localStorage.setItem("userId", userId.toString());
      navigate(`/movies?userId=${userId}`);
    },
    onError: () => {
      toast.error("Failed to log in. Please try again.");
    },
  });

  const handleSubmit = () => {
    if (email) {
      loginUser.mutate(email);
    }
  };

  return (
    <Paper
      elevation={4}
      sx={{
        width: "100%",
        maxWidth: 400,
        padding: 4,
        borderRadius: 4,
        border: "2px solid #006400",
        backgroundColor: "rgba(0, 100, 0, 0.05)",
      }}
    >
      <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
        <Typography
          variant="h5"
          component="h1"
          sx={{ fontWeight: "bold", textAlign: "center", color: "#006400" }}
        >
          Welcome to Movie Watchlist
        </Typography>
        <Typography
          variant="body1"
          sx={{ textAlign: "center", color: "#2E7D32" }}
        >
          Manage your movies efficiently and effortlessly.
        </Typography>
        <TextField
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          fullWidth
          required
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!email}
          fullWidth
          sx={{
            backgroundColor: "#2E7D32",
            "&:hover": {
              backgroundColor: "#006400",
            },
          }}
        >
          View Your Movies
        </Button>
      </Box>
    </Paper>
  );
};

export default EmailInput;
