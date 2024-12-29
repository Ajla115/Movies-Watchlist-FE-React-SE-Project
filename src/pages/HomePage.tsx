// import React from "react";
// import EmailInput from "../components/EmailInput";
// import { Container, Box, Paper, CardContent, Typography } from "@mui/material";

// const HomePage: React.FC = () => {
//   return (
//     <Container
//       maxWidth="sm"
//       sx={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         height: "100vh",
//         fontFamily: "'Poppins', sans-serif",
//         paddingX: { xs: 2, md: 4 },
//       }}
//     >
//       <Paper
//         elevation={4}
//         sx={{
//           width: "100%",
//           padding: { xs: 2, sm: 4 },
//           borderRadius: 4,
//           background: "linear-gradient(to right, #ffffff, #e3f2fd)",
//           boxShadow: 6,
//         }}
//       >
//         <CardContent>
//           <Box textAlign="center" mb={4}>
//             <Typography
//               variant="h4"
//               color="primary"
//               gutterBottom
//               sx={{
//                 fontWeight: "bold",
//                 color: "#1976d2",
//                 fontSize: { xs: "1.6rem", sm: "2rem" },
//               }}
//             >
//               Welcome to Movie Watchlist
//             </Typography>
//             <Typography
//               variant="body1"
//               color="textSecondary"
//               sx={{ fontSize: { xs: "1rem", sm: "1.2rem" }, color: "#616161" }}
//             >
//               Manage your movies efficiently and effortlessly.
//             </Typography>
//           </Box>
//           <EmailInput />
//         </CardContent>
//       </Paper>
//     </Container>
//   );
// };

// export default HomePage;
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
        backgroundColor: "#e8f5e9", // Light green background
        padding: 0,
        margin: 0,
      }}
    >
      <Box
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


