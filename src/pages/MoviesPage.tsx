import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMoviesByUser, addMovie, filterMoviesByGenre, filterMoviesByStatus, filterMoviesByWatchlistOrder, 
  sortMoviesByWatchlistOrder } from "../api/movieApi";
import { useWatchlistGroups, useMoviesByCategory, addWatchlistGroup, useEditCategory} from "../api/watchlistGroupApi"; 
import { WatchlistGroup } from "../types/WatchlistGroup"; 
import MovieItem from "../components/MovieItem";
import AddMovieModal from "../components/AddMovieModal";
import AddCategoryModal from "../components/AddCategoryModal";
import { Container, Box, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { AddMovieDTO, Movie } from "../types/Movie";
import LoadingSpinner from "../components/LoadingSpinner";
import { useLocation } from "react-router-dom";
import NotificationButton from "../components/NotificationToggle";
import { List, Button } from "@mui/material"; 
import DeleteCategoryModal from "../components/DeleteCategoryModal";
import { useDeleteCategory } from "../api/watchlistGroupApi";
import { toast } from "react-toastify";
import EditCategoryModal from "../components/EditCategoryModal";

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

  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const { categories, isLoading: isCategoriesLoading, error: categoriesError } = useWatchlistGroups();

  const { movies: categoryMovies, isLoading: isCategoryLoading, error: categoryError } =
  useMoviesByCategory(userId, selectedCategory);

  const [isDeleteCategoryModalOpen, setIsDeleteCategoryModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  const deleteCategoryMutation = useDeleteCategory();

  const handleOpenDeleteCategoryModal = (groupId: number) => {
    setCategoryToDelete(groupId);
    setIsDeleteCategoryModalOpen(true);
  };

  const handleCloseDeleteCategoryModal = () => {
    setIsDeleteCategoryModalOpen(false);
    setCategoryToDelete(null);
  };

  const handleDeleteCategory = async (groupId: number, deleteMovies: boolean) => {
    try {
      await deleteCategoryMutation.mutateAsync({ groupId, deleteMovies });
      queryClient.invalidateQueries({ queryKey: ["categories"] }); 
      handleCloseDeleteCategoryModal(); 
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };
  
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);

const handleOpenEditCategoryModal = () => {
  setIsEditCategoryModalOpen(true);
};

const handleCloseEditCategoryModal = () => {
  setIsEditCategoryModalOpen(false);
};

const editCategoryMutation = useEditCategory();

const handleEditCategory = async (groupId: number, newName: string) => {
  try {
    await editCategoryMutation.mutateAsync({ groupId, newName });
    handleCloseEditCategoryModal();
  } catch (error) {
    console.error("Error editing category:", error);
  }
};
  const genreOptions = [
    "Action",
    "Adventure",
    "Animation",
    "Biography",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Family",
    "Fantasy",
    "Historical",
    "Horror",
    "Musical",
    "Mystery",
    "Romance",
    "Science Fiction",
    "Sports",
    "Thriller",
    "Western",
  ];

  const statusOptions = ["To Watch", "Watched"];
  const watchlistOrderOptions = ["Next Up", "When I have time", "Someday"];

  const sortingOptions = [
    { value: "default", label: "Default (Alphabetical)" },
    { value: "asc", label: "Watchlist Order (Asc)" },
    { value: "desc", label: "Watchlist Order (Desc)" },
  ];


  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);

  const handleOpenAddCategoryModal = () => {
    setIsAddCategoryModalOpen(true);
  };

  const handleCloseAddCategoryModal = () => {
    setIsAddCategoryModalOpen(false);
  };

  const handleAddCategory = async (categoryName: string) => {
    try {
      await addWatchlistGroup(categoryName); 
      fetchCategories(); 
      handleCloseAddCategoryModal(); 
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };
  
  const fetchCategories = async () => {
    queryClient.invalidateQueries({ queryKey: ["categories"] });
  };

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

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setGenreFilter("");
    setStatusFilter("");
    setWatchlistOrderFilter("");
    setSortOption("default");
  
    if (value === "") {
      setSelectedCategory(""); 
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
              {sortingOptions.map((option) => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#E9F5EC",
                    },
                  }}
                >
                  {option.label}
                </MenuItem>
              ))}
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
                {genreOptions.map((genre) => (
                  <MenuItem key={genre} value={genre} sx={{
                    "&:hover": {
                      backgroundColor: "#E9F5EC",
                    },
                  }}>
                    {genre}
                  </MenuItem>
                ))}
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
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status} sx={{
                    "&:hover": {
                      backgroundColor: "#E9F5EC",
                    },
                  }}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 4 }}>
              <InputLabel id="watchlist-order-filter-label">
                Filter by Watchlist Order
              </InputLabel>
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
                {watchlistOrderOptions.map((order) => (
                  <MenuItem key={order} value={order} sx={{
                    "&:hover": {
                      backgroundColor: "#E9F5EC",
                    },
                  }}>
                    {order}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>


          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "#2D6A4F", mb: 1 }}
            >
              Watchlist Category Option
            </Typography>

            <Box display="flex" gap={2}>
              <FormControl fullWidth>
                <InputLabel id="category-filter-label">Select Category</InputLabel>
                <Select
                  labelId="category-filter-label"
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}>
                  <MenuItem value="" sx={{
                                      "&:hover": {
                                        backgroundColor: "#E9F5EC",
                                      },
                                    }}>None</MenuItem>
                  {categories.map((category: WatchlistGroup) => (
                    <MenuItem key={category.id} value={category.id} sx={{
                      "&:hover": {
                        backgroundColor: "#E9F5EC",
                      },
                    }}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box display="flex" gap={2}>
                <Button
                  variant="contained"
                  onClick={handleOpenAddCategoryModal}
                  sx={{
                    backgroundColor: "#52B788",
                    color: "#FFFFFF",
                    "&:hover": {
                      backgroundColor: "#2D6A4F",
                    },
                  }}
                >
                  Add New Category
                </Button>

                <AddCategoryModal
                  open={isAddCategoryModalOpen}
                  onClose={handleCloseAddCategoryModal}
                  onAddCategory={handleAddCategory}
                />

<Button
  variant="contained"
  onClick={handleOpenEditCategoryModal}
  sx={{
    backgroundColor: "#2196F3", // Blue color for edit button
    color: "#FFFFFF",
    "&:hover": {
      backgroundColor: "#1769AA",
    },
  }}
>
  Edit Category
</Button>

<EditCategoryModal
  open={isEditCategoryModalOpen}
  onClose={handleCloseEditCategoryModal}
  categories={categories}
  onEditCategory={handleEditCategory}
/>

          <Button
              variant="contained"
              onClick={() => handleOpenDeleteCategoryModal(Number(selectedCategory))}
              sx={{
                backgroundColor: "#D32F2F",
                color: "#FFFFFF",
                "&:hover": {
                  backgroundColor: "#A00000",
                },
              }}
            >
              Delete Category
            </Button>

            <DeleteCategoryModal
              open={isDeleteCategoryModalOpen}
              onClose={handleCloseDeleteCategoryModal}
              onDeleteCategory={handleDeleteCategory}
              categories={categories}
            />
              </Box>
                
                 
                </Box>
              </Box>
              {selectedCategory ? (
      categoryMovies.length > 0 ? (
        <List>
          {categoryMovies.map((movie) => (
            <MovieItem
              key={movie.movieId}
              movie={movie}
              userId={userId}
              onMarkAsWatched={(movieId: string) =>
                console.log(`Marking movie ${movieId} as watched`)
              }
            />
          ))}
        </List>
      ) : (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          No movies found in this category.
        </Typography>
      )
    ) : (
      <List>
        {movies.map((movie) => (
          <MovieItem
            key={movie.movieId}
            movie={movie}
            userId={userId}
            onMarkAsWatched={(movieId: string) =>
              console.log(`Marking movie ${movieId} as watched`)
            }
          />
        ))}
      </List>
    )}

          
          </Box>
      </Container>
    </Box>



  );
};

export default MoviesPage;


