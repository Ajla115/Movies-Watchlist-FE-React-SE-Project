// import React from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { getMoviesByUser, addMovie } from "../api/movieApi";
// import { Movie, AddMovieDTO } from "../types/Movie";
// import MovieList from "../components/MovieList";
// import { useLocation } from "react-router-dom";
// import { Box, Container, Typography } from "@mui/material";
// import LoadingSpinner from "../components/LoadingSpinner";
// import AddMovieModal from "../components/AddMovieModal";

// const MoviesPage: React.FC = () => {
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const userId = queryParams.get("userId") || "";
//   const queryClient = useQueryClient();

//   const { data, isLoading, error } = useQuery({
//     queryKey: ["movies", userId],
//     queryFn: () => getMoviesByUser(userId),
//     enabled: !!userId
//   });

//   const addMovieMutation = useMutation({
//     mutationFn: (newMovie: AddMovieDTO) => addMovie(userId, newMovie),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["movies", userId] });
//     },
//   });

//   const handleAddMovie = async (newMovie: AddMovieDTO) => {
//     try {
//       await addMovieMutation.mutateAsync(newMovie);
//     } catch (error) {
//       console.error("Error adding movie:", error);
//       throw error; // Re-throw to let AddMovieModal handle the error UI
//     }
//   };

//   const movies: Movie[] = data || [];

//   if (isLoading) {
//     return <LoadingSpinner />;
//   }

//   if (error) {
//     return (
//       <Container>
//         <Typography variant="h6" color="error" align="center" sx={{ mt: 4 }}>
//           Error loading movies. Please try again later.
//         </Typography>
//       </Container>
//     );
//   }

//   return (
//     <Container>
//       <Box sx={{ mt: 4, mb: 4 }}>
//         <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
//           <Typography variant="h4" component="h1">
//             My Movies
//           </Typography>
//           <AddMovieModal onAddMovie={handleAddMovie} />
//         </Box>
//         <MovieList movies={movies} />
//       </Box>
//     </Container>
//   );
// };

// export default MoviesPage;

// import React, { useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { getMoviesByUser, addMovie } from "../api/movieApi";
// import MovieList from "../components/MovieList";
// import AddMovieModal from "../components/AddMovieModal";
// import { Container, Box, Typography, FormControl, InputLabel, Select, MenuItem, Button } from "@mui/material";
// import { AddMovieDTO, Movie } from "../types/Movie";
// import LoadingSpinner from "../components/LoadingSpinner";
// import { useLocation } from "react-router-dom";
// import { SelectChangeEvent } from '@mui/material';
// import { filterMoviesByGenre, filterMoviesByStatus, filterMoviesByWatchlistOrder } from "../api/movieApi";
// import { sortMoviesByWatchlistOrder } from "../api/movieApi";


// const MoviesPage: React.FC = () => {
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const userId = queryParams.get("userId") || "";
//   const queryClient = useQueryClient();

//   const [genreFilter, setGenreFilter] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [watchlistOrderFilter, setWatchlistOrderFilter] = useState("");
//   const [movies, setMovies] = useState<Movie[]>([]); // Add this at the top of your component
//   // Add this state to manage sorting
// const [sortOption, setSortOption] = useState("default");



//   const handleGenreFilterChange = (value: string) => {
//     setGenreFilter(value);
//     if (value === "") {
//       // Fetch all movies for the user
//       fetchMovies();
//     } else {
//       // Fetch filtered movies by genre
//       fetchMoviesByGenre(value);
//     }
//   };
  
//   const handleStatusFilterChange = (value: string) => {
//     setStatusFilter(value);
//     if (value === "") {
//       // Fetch all movies for the user
//       fetchMovies();
//     } else {
//       // Fetch filtered movies by status
//       fetchMoviesByStatus(value);
//     }
//   };
  
//   const handleWatchlistOrderFilterChange = (value: string) => {
//     setWatchlistOrderFilter(value);
//     if (value === "") {
//       // Fetch all movies for the user
//       fetchMovies();
//     } else {
//       // Fetch filtered movies by watchlist order
//       fetchMoviesByWatchlistOrder(value);
//     }
//   };

//   const fetchSortedMovies = async (order: "asc" | "desc") => {
//     try {
//       const sortedMovies = await sortMoviesByWatchlistOrder(userId, order);
//       console.log("Sorted movies:", sortedMovies); // Debug to check the response
//       setMovies(sortedMovies); // Update the state with the sorted movies
//     } catch (error) {
//       console.error("Error fetching sorted movies:", error);
//     }
//   };
  
  
// // Add this function to handle sorting dropdown changes
// const handleSortingChange = async (value: string) => {
//   setSortOption(value);

//   if (value === "default") {
//     // Default alphabetical sorting
//     fetchMovies();
//   } else if (value === "asc") {
//     // Ascending watchlist order
//     fetchSortedMovies("asc");
//   } else if (value === "desc") {
//     // Descending watchlist order
//     fetchSortedMovies("desc");
//   }
// };

  
//   const fetchMovies = async () => {
//     const allMovies = await getMoviesByUser(userId);
//     setMovies(allMovies);
//   };
  
//   const fetchMoviesByGenre = async (genreName: string) => {
//     const filteredMovies = await filterMoviesByGenre(userId, genreName);
//     setMovies(filteredMovies);
//   };
  
  // const fetchMoviesByStatus = async (status: string) => {
  //   const filteredMovies = await filterMoviesByStatus(userId, status);
  //   setMovies(filteredMovies);
  // };
  
//   const fetchMoviesByStatus = async (status: string) => {
//     try {
//       const filteredMovies = await filterMoviesByStatus(userId, status);
//       setMovies(filteredMovies);
//     } catch (error) {
//       console.error("Error fetching movies by status:", error);
//     }
//   };

  
//   const fetchMoviesByWatchlistOrder = async (order: string) => {
//     const filteredMovies = await filterMoviesByWatchlistOrder(userId, order);
//     setMovies(filteredMovies);
//   };
  

//   const { data, isLoading, error } = useQuery({
//     queryKey: ["movies", userId],
//     queryFn: () => getMoviesByUser(userId),
//     enabled: !!userId,
//   });

//   const addMovieMutation = useMutation({
//     mutationFn: (newMovie: AddMovieDTO) => addMovie(userId, newMovie),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["movies", userId] });
//     },
//   });

//   const handleAddMovie = async (newMovie: AddMovieDTO) => {
//     try {
//       await addMovieMutation.mutateAsync(newMovie);
//     } catch (error) {
//       console.error("Error adding movie:", error);
//       throw error;
//     }
//   };


//   const filteredMovies = (data || []).filter((movie: Movie) => {
//     if (genreFilter && movie.genre.name !== genreFilter) return false;
//     if (statusFilter && movie.status !== statusFilter) return false;
//     if (watchlistOrderFilter && movie.watchlistOrder !== watchlistOrderFilter) return false;
//     return true;
//   });

//   if (isLoading) {
//     return <LoadingSpinner />;
//   }

//   if (error) {
//     return (
//       <Container>
//         <Typography variant="h6" color="error" align="center" sx={{ mt: 4 }}>
//           Error loading movies. Please try again later.
//         </Typography>
//       </Container>
//     );
//   }

//   return (
//     <Container>
//       <Box sx={{ mt: 4, mb: 4 }}>
//         <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
//           <Typography variant="h4" component="h1">
//             My Movies
//           </Typography>
//           <AddMovieModal onAddMovie={handleAddMovie} />
//         </Box>
//         <Box display="flex" gap={2} mb={4}>
//         <FormControl fullWidth sx={{ mb: 4 }}>
//   <InputLabel id="filter-label">Filter by Genre</InputLabel>
//   <Select
//     labelId="filter-label"
//     value={genreFilter}
//     onChange={(e) => handleGenreFilterChange(e.target.value)}
//   >
//     <MenuItem value="">None</MenuItem> {/* Add None option */}
//     <MenuItem value="Comedy">Comedy</MenuItem>
//     <MenuItem value="Action">Action</MenuItem>
//     <MenuItem value="Thriller">Thriller</MenuItem>
//   </Select>
// </FormControl>

// <FormControl fullWidth sx={{ mb: 4 }}>
//   <InputLabel id="status-filter-label">Filter by Status</InputLabel>
//   <Select
//     labelId="status-filter-label"
//     value={statusFilter}
//     onChange={(e) => handleStatusFilterChange(e.target.value)}
//   >
//     <MenuItem value="">None</MenuItem> {/* Add None option */}
//     <MenuItem value="To Watch">To Watch</MenuItem>
//     <MenuItem value="Watched">Watched</MenuItem>
//   </Select>
// </FormControl>

// <FormControl fullWidth sx={{ mb: 4 }}>
//   <InputLabel id="watchlist-order-filter-label">Filter by Watchlist Order</InputLabel>
//   <Select
//     labelId="watchlist-order-filter-label"
//     value={watchlistOrderFilter}
//     onChange={(e) => handleWatchlistOrderFilterChange(e.target.value)}
//   >
//     <MenuItem value="">None</MenuItem> {/* Add None option */}
//     <MenuItem value="Next Up">Next Up</MenuItem>
//     <MenuItem value="When I have time">When I have time</MenuItem>
//     <MenuItem value="Someday">Someday</MenuItem>
//   </Select>
// </FormControl>
// <FormControl fullWidth sx={{ mb: 4 }}>
//   <InputLabel id="sort-label">Sort Movies</InputLabel>
//   <Select
//     labelId="sort-label"
//     value={sortOption}
//     onChange={(e) => handleSortingChange(e.target.value)}
//   >
//     <MenuItem value="default">Default (Alphabetical)</MenuItem>
//     <MenuItem value="asc">Watchlist Order (Asc)</MenuItem>
//     <MenuItem value="desc">Watchlist Order (Desc)</MenuItem>
//   </Select>
// </FormControl>

//         </Box>
//         <MovieList movies={filteredMovies} />
//       </Box>
//     </Container>
//   );
// };

// export default MoviesPage;

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMoviesByUser, addMovie, filterMoviesByGenre, filterMoviesByStatus, filterMoviesByWatchlistOrder, sortMoviesByWatchlistOrder } from "../api/movieApi";
import MovieList from "../components/MovieList";
import AddMovieModal from "../components/AddMovieModal";
import { Container, Box, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { AddMovieDTO, Movie } from "../types/Movie";
import LoadingSpinner from "../components/LoadingSpinner";
import { useLocation } from "react-router-dom";

const MoviesPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("userId") || "";
  const queryClient = useQueryClient();

  const [genreFilter, setGenreFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [watchlistOrderFilter, setWatchlistOrderFilter] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [movies, setMovies] = useState<Movie[]>([]);

  // Fetch movies with default sorting
  const { data: fetchedMovies, isLoading, error } = useQuery<Movie[]>({
    queryKey: ["movies", userId],
    queryFn: () => getMoviesByUser(userId),
    enabled: !!userId,
  });

  useEffect(() => {
    if (fetchedMovies) {
      setMovies(fetchedMovies);
    }
  }, [fetchedMovies]);

  const handleGenreFilterChange = (value: string) => {
    setGenreFilter(value);
    if (value === "") {
      fetchMovies();
    } else {
      fetchMoviesByGenre(value);
    }
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    console.log("Status Filter:", value);
    if (value === "") {
      fetchMovies();
    } else {
      fetchMoviesByStatus(value);
    }
  };
  

  const handleWatchlistOrderFilterChange = (value: string) => {
    setWatchlistOrderFilter(value);
    if (value === "") {
      fetchMovies();
    } else {
      fetchMoviesByWatchlistOrder(value);
    }
  };

  const handleSortingChange = async (value: string) => {
    setSortOption(value);
  
    if (value === "default") {
      fetchMovies();
    } else if (value === "asc" || value === "desc") {
      fetchSortedMovies(value as "asc" | "desc"); // Explicitly cast to "asc" | "desc"
    }
  };
  

  const fetchMovies = async () => {
    const allMovies = await getMoviesByUser(userId);
    setMovies(allMovies);
  };

  const fetchMoviesByGenre = async (genreName: string) => {
    const filteredMovies = await filterMoviesByGenre(userId, genreName);
    setMovies(filteredMovies);
  };

  

  // const fetchMoviesByStatus = async (status: string) => {
  //   try {
  //     const filteredMovies = await filterMoviesByStatus(userId, status);
  //     setMovies(filteredMovies); // Update the movies state with the filtered list
  //   } catch (error) {
  //     console.error("Error fetching movies by status:", error);
  //   }
  // };

  const fetchMoviesByStatus  = async (status: string) => {
    const filteredMovies = await filterMoviesByStatus(userId, status);
    setMovies(filteredMovies);
  };
  
      

  const fetchMoviesByWatchlistOrder = async (order: string) => {
    const filteredMovies = await filterMoviesByWatchlistOrder(userId, order);
    setMovies(filteredMovies);
  };

  const fetchSortedMovies = async (order: "asc" | "desc") => {
    const sortedMovies = await sortMoviesByWatchlistOrder(userId, order);
    setMovies(sortedMovies);
  };

  const addMovieMutation = useMutation({
    mutationFn: (newMovie: AddMovieDTO) => addMovie(userId, newMovie),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies", userId] });
    },
  });

  const handleAddMovie = async (newMovie: AddMovieDTO) => {
    try {
      await addMovieMutation.mutateAsync(newMovie);
    } catch (error) {
      console.error("Error adding movie:", error);
      throw error;
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Container>
        <Typography variant="h6" color="error" align="center" sx={{ mt: 4 }}>
          Error loading movies. Please try again later.
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            My Movies
          </Typography>
          <AddMovieModal onAddMovie={handleAddMovie} />
        </Box>
        <Box display="flex" gap={2} mb={4}>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel id="filter-label">Filter by Genre</InputLabel>
            <Select
              labelId="filter-label"
              value={genreFilter}
              onChange={(e) => handleGenreFilterChange(e.target.value)}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="Comedy">Comedy</MenuItem>
              <MenuItem value="Action">Action</MenuItem>
              <MenuItem value="Thriller">Thriller</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel id="status-filter-label">Filter by Status</InputLabel>
            <Select
              labelId="status-filter-label"
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="To Watch">To Watch</MenuItem>
              <MenuItem value="Watched">Watched</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel id="watchlist-order-filter-label">Filter by Watchlist Order</InputLabel>
            <Select
              labelId="watchlist-order-filter-label"
              value={watchlistOrderFilter}
              onChange={(e) => handleWatchlistOrderFilterChange(e.target.value)}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="Next Up">Next Up</MenuItem>
              <MenuItem value="When I have time">When I have time</MenuItem>
              <MenuItem value="Someday">Someday</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel id="sort-label">Sort Movies</InputLabel>
            <Select
              labelId="sort-label"
              value={sortOption}
              onChange={(e) => handleSortingChange(e.target.value)}
            >
              <MenuItem value="default">Default (Alphabetical)</MenuItem>
              <MenuItem value="asc">Watchlist Order (Asc)</MenuItem>
              <MenuItem value="desc">Watchlist Order (Desc)</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <MovieList
  movies={movies}
  onMarkAsWatched={(movieId) => {
    console.log(`Marking movie with ID ${movieId} as watched`);
    // Add logic to call the API and update the movie status here
  }}
/>      </Box>
    </Container>
  );
};

export default MoviesPage;
