import React from "react";
import { Container, Box } from "@mui/material";
import EmailInput from "../components/EmailInput";

const HomePage: React.FC = () => {
  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#e8f5e9",
        padding: 0,
        margin: 0,
      }}
    >
      <Box
       role="main"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 4,
        }}
      >
        <EmailInput />
      </Box>
    </Container>
  );
};

export default HomePage;


