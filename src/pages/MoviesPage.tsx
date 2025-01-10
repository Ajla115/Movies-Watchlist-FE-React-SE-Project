import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMoviesByUser, addMovie, filterMoviesByGenre, filterMoviesByStatus, filterMoviesByWatchlistOrder, sortMoviesByWatchlistOrder } from "../api/movieApi";
import MovieList from "../components/MovieList";
import AddMovieModal from "../components/AddMovieModal";
import { Container, Box, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { AddMovieDTO, Movie } from "../types/Movie";
import LoadingSpinner from "../components/LoadingSpinner";
import { useLocation } from "react-router-dom";
import NotificationButton from "../components/NotificationToggle";

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
    setStatusFilter("");
    setWatchlistOrderFilter("");
    setSortOption("default");

    if (value === "") {
      fetchMovies();
    } else {
      fetchMoviesByGenre(value);
    }
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setGenreFilter("");
    setWatchlistOrderFilter("");
    setSortOption("default");

    if (value === "") {
      fetchMovies();
    } else {
      fetchMoviesByStatus(value);
    }
  };

  const handleWatchlistOrderFilterChange = (value: string) => {
    setWatchlistOrderFilter(value);
    setGenreFilter("");
    setStatusFilter("");
    setSortOption("default");

    if (value === "") {
      fetchMovies();
    } else {
      fetchMoviesByWatchlistOrder(value);
    }
  };

  const handleSortingChange = async (value: string) => {
    setSortOption(value);
    setGenreFilter("");
    setStatusFilter("");
    setWatchlistOrderFilter("");

    if (value === "default") {
      fetchMovies();
    } else if (value === "asc" || value === "desc") {
      fetchSortedMovies(value as "asc" | "desc");
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


  const fetchMoviesByStatus = async (status: string) => {
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
    <Box
      sx={{
        backgroundColor: "#EAFCE3",
        minHeight: "100vh",
        minWidth: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "auto",
        padding: "2rem",
      }}
    >
      <Container maxWidth="lg" sx={{ padding: "2rem" }}>
        <Box sx={{ mt: 4, mb: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 900,
                color: "#2D6A4F",
                textAlign: "left",
              }}
            >
              MY MOVIES
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <NotificationButton userId={userId} />
              <AddMovieModal onAddMovie={handleAddMovie} />
            </Box>
          </Box>
          <Box display="flex" gap={2} mb={4}>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <InputLabel id="sort-label">Sort Movies</InputLabel>
              <Select
                labelId="sort-label"
                value={sortOption}
                onChange={(e) => handleSortingChange(e.target.value)}
              >
                <MenuItem value="default" sx={{
                  "&:hover": {
                    backgroundColor: "#E9F5EC",
                  },
                }}>Default (Alphabetical)</MenuItem>
                <MenuItem value="asc" sx={{
                  "&:hover": {
                    backgroundColor: "#E9F5EC",
                  },
                }}>Watchlist Order (Asc)</MenuItem>
                <MenuItem value="desc" sx={{
                  "&:hover": {
                    backgroundColor: "#E9F5EC",
                  },
                }}>Watchlist Order (Desc)</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <InputLabel id="filter-label">Filter by Genre</InputLabel>
              <Select
                labelId="filter-label"
                value={genreFilter}
                onChange={(e) => handleGenreFilterChange(e.target.value)}
              >
                <MenuItem value="" sx={{
                  "&:hover": {
                    backgroundColor: "#E9F5EC",
                  },
                }}>None</MenuItem>
                <MenuItem value="Action" sx={{
                  "&:hover": {
                    backgroundColor: "#E9F5EC",
                  },
                }}>Action</MenuItem>
                <MenuItem value="Adventure" sx={{
                  "&:hover": {
                    backgroundColor: "#E9F5EC",
                  },
                }}>Adventure</MenuItem>
                <MenuItem value="Animation" sx={{
                  "&:hover": {
                    backgroundColor: "#E9F5EC",
                  },
                }}>Animation</MenuItem>
                <MenuItem value="Biography" sx={{
                  "&:hover": {
                    backgroundColor: "#E9F5EC",
                  },
                }}>Biography</MenuItem>
                <MenuItem value="Comedy" sx={{
                  "&:hover": {
                    backgroundColor: "#E9F5EC",
                  },
                }}>Comedy</MenuItem>
                <MenuItem value="Crime" sx={{
                  "&:hover": {
                    backgroundColor: "#E9F5EC",
                  },
                }}>Crime</MenuItem>
                <MenuItem value="Documentary" sx={{
                  "&:hover": {
                    backgroundColor: "#E9F5EC",
                  },
                }}>Documentary</MenuItem>
                <MenuItem value="Drama" sx={{
                  "&:hover": {
                    backgroundColor: "#E9F5EC",
                  },
                }}>Drama</MenuItem>
                <MenuItem value="Family" sx={{
                  "&:hover": {
                    backgroundColor: "#E9F5EC",
                  },
                }}>Family</MenuItem>
                <MenuItem value="Fantasy" sx={{
                  "&:hover": {
                    backgroundColor: "#E9F5EC",
                  },
                }}>Fantasy</MenuItem>
                <MenuItem value="Historical" sx={{
                  "&:hover": {
                    backgroundColor: "#E9F5EC",
                  },
                }}>Historical</MenuItem>
                <MenuItem value="Horror" sx={{
                  "&:hover": {
                    backgroundColor: "#E9F5EC",
                  },
                }}>Horror</MenuItem>
                <MenuItem value="Musical" sx={{
                  "&:hover": {
                    backgroundColor: "#E9F5EC",
                  },
                }}>Musical</MenuItem>
                <MenuItem value="Mystery" sx={{
                  "&:hover": {
                    backgroundColor: "#E9F5EC",
                  },
                }}>Mystery</MenuItem>
                <MenuItem value="Romance" sx={{
                  "&:hover": {
                    backgroundColor: "#E9F5EC",
                  },
                }}>Romance</MenuItem>
                <MenuItem value="Science Fiction" sx={{
                  "&:hover": {
                    backgroundColor: "#E9F5EC",
                  },
                }}>Science Fiction</MenuItem>
                <MenuItem value="Sports" sx={{
                  "&:hover": {
                    backgroundColor: "#E9F5EC",
                  },
                }}>Sports</MenuItem>
                <MenuItem value="Thriller" sx={{
                  "&:hover": {
                    backgroundColor: "#E9F5EC",
                  },
                }}>Thriller</MenuItem>
                <MenuItem value="Western" sx={{
                  "&:hover": {
                    backgroundColor: "#E9F5EC",
                  },
                }}>Western</MenuItem>
              </Select>
            </FormControl>


            <FormControl fullWidth sx={{ mb: 4 }}>
              <InputLabel id="status-filter-label">Filter by Status</InputLabel>
              <Select
                labelId="status-filter-label"
                value={statusFilter}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
              >
                <MenuItem value="" sx={{
                  "&:hover": {
                    backgroundColor: "#E9F5EC",
                  },
                }}>None</MenuItem>
                <MenuItem value="To Watch" sx={{
                  "&:hover": {
                    backgroundColor: "#E9F5EC",
                  },
                }}>To Watch</MenuItem>
                <MenuItem value="Watched" sx={{
                  "&:hover": {
                    backgroundColor: "#E9F5EC",
                  },
                }}>Watched</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 4 }}>
              <InputLabel id="watchlist-order-filter-label">Filter by Watchlist Order</InputLabel>
              <Select
                labelId="watchlist-order-filter-label"
                value={watchlistOrderFilter}
                onChange={(e) => handleWatchlistOrderFilterChange(e.target.value)}
              >
                <MenuItem value="" sx={{
                  "&:hover": {
                    backgroundColor: "#E9F5EC",
                  },
                }}>None</MenuItem>
                <MenuItem value="Next Up" sx={{
                  "&:hover": {
                    backgroundColor: "#E9F5EC",
                  },
                }}>Next Up</MenuItem>
                <MenuItem value="When I have time" sx={{
                  "&:hover": {
                    backgroundColor: "#E9F5EC",
                  },
                }}>When I have time</MenuItem>
                <MenuItem value="Someday" sx={{
                  "&:hover": {
                    backgroundColor: "#E9F5EC",
                  },
                }}>Someday</MenuItem>
              </Select>
            </FormControl>


          </Box>
          <MovieList
            movies={movies}
            userId={userId}
            onMarkAsWatched={(movieId) => {
              console.log(`Marking movie with ID ${movieId} as watched`);

            }}
          />      </Box>
      </Container>
    </Box>
  );
};

export default MoviesPage;


