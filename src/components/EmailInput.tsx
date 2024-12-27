// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { TextField, Button, Box } from "@mui/material";

// const EmailInput: React.FC = () => {
//   const [email, setEmail] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = () => {
//     if (email) {
//       navigate(`/tasks?email=${email}`);
//     }
//   };

//   return (
//     <Box display="flex" flexDirection="column" gap={2} alignItems="center">
//       <TextField
//         type="email"
//         label="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         placeholder="Enter your email"
//         fullWidth
//         required
//       />
//       <Button
//         variant="contained"
//         color="primary"
//         onClick={handleSubmit}
//         disabled={!email}
//       >
//         View Your Movies
//       </Button>
//     </Box>
//   );
// };

// export default EmailInput;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/users";

const EmailInput: React.FC = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const loginUser = useMutation({
    mutationFn: (email: string) =>
      axios.post(`${API_BASE_URL}/login`, email, {
        headers: {
          "Content-Type": "text/plain",
        },
      }),
    onSuccess: (data) => {
      const userId = data.data;
      localStorage.setItem("userId", userId.toString());
      navigate(`/movies?userId=${userId}`);
    },
    onError: (error) => {
      console.error("Error logging in user:", error);
    },
  });

  const handleSubmit = () => {
    if (email) {
      loginUser.mutate(email);
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={2} alignItems="center">
      <TextField
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        fullWidth
        required
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={!email}
      >
        View Your Movies
      </Button>
    </Box>
  );
};

export default EmailInput;
