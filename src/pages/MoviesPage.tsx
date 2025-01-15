import React, { useState, useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useWatchlistGroups,
  useMoviesByCategory,
  useAddCategory,
  useEditCategory,
  useDeleteCategory,
} from "../hooks/useWatchlistGroups";
import { WatchlistGroup } from "../types/WatchlistGroup";
import MovieItem from "../components/MovieItem";
import AddMovieModal from "../components/AddMovieModal";
import AddCategoryModal from "../components/AddCategoryModal";
import {
  Container,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { AddMovieDTO, Movie } from "../types/Movie";
import LoadingSpinner from "../components/LoadingSpinner";
import { useLocation } from "react-router-dom";
import NotificationButton from "../components/NotificationToggle";
import { List, Button } from "@mui/material";
import DeleteCategoryModal from "../components/DeleteCategoryModal";
import EditCategoryModal from "../components/EditCategoryModal";
import { toast } from "react-toastify";
import {
  useGetMoviesByUser,
  useFilteredMovies,
  useAddMovie,
} from "../hooks/useMovie";
import MovieList from "../components/MovieList";

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

  const [appliedFilters, setAppliedFilters] = useState({
    genre: "",
    status: "",
    watchlistOrder: "",
    sort: "default",
    categoryId: "",
  });

  const {
    categories,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useWatchlistGroups();

  const {
    movies: categoryMovies,
    isLoading: isCategoryLoading,
    error: categoryError,
  } = useMoviesByCategory(userId, selectedCategory);

  const [isDeleteCategoryModalOpen, setIsDeleteCategoryModalOpen] =
    useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [filtersApplied, setFiltersApplied] = useState(false);

  const deleteCategoryMutation = useDeleteCategory();

  const handleOpenDeleteCategoryModal = (groupId: number) => {
    setCategoryToDelete(groupId);
    setIsDeleteCategoryModalOpen(true);
  };

  const handleCloseDeleteCategoryModal = () => {
    setIsDeleteCategoryModalOpen(false);
    setCategoryToDelete(null);
  };

  const handleDeleteCategory = async (
    groupId: number,
    deleteMovies: boolean
  ) => {
    try {
      await deleteCategoryMutation.mutateAsync({ groupId, deleteMovies });

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

  const handleEditCategory = (groupId: number, newName: string) => {
    editCategoryMutation.mutate(
      { groupId, newName },
      {
        onSuccess: () => {
          handleCloseEditCategoryModal();
        },
        onError: (error) => {
          console.error("Error editing category:", error);
          toast.error("Failed to edit category. Please try again.");
        },
      }
    );
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

  const handleApplyFilters = () => {
    setAppliedFilters({
      genre: genreFilter,
      status: statusFilter,
      watchlistOrder: watchlistOrderFilter,
      sort: sortOption,
      categoryId: selectedCategory,
    });
    setFiltersApplied(true);
  };

  const handleResetFilters = () => {
    setGenreFilter("");
    setStatusFilter("");
    setWatchlistOrderFilter("");
    setSortOption("default");
    setSelectedCategory("");
    setAppliedFilters({
      genre: "",
      status: "",
      watchlistOrder: "",
      sort: "default",
      categoryId: "",
    });
    setFiltersApplied(false);
  };

  const {
    data: allMovies,
    isLoading: isAllMoviesLoading,
    error: allMoviesError,
  } = useGetMoviesByUser(userId, filtersApplied);

  const {
    data: fetchedMovies,
    isLoading,
    error,
  } = useFilteredMovies(userId, appliedFilters, filtersApplied);

  // useEffect(() => {
  //   if (fetchedMovies && fetchedMovies.length > 0) {
  //     setMovies(fetchedMovies);
  //   } else if (fetchedMovies?.length === 0) {
  //     setMovies([]);
  //   } else if (allMovies && !filtersApplied) {
  //     setMovies(allMovies);
  //   }
  // }, [fetchedMovies, allMovies, filtersApplied]);

  const filteredMovies = useMemo(() => {
    if (fetchedMovies && fetchedMovies.length > 0) {
      return fetchedMovies;
    } else if (allMovies && !filtersApplied) {
      return allMovies;
    }
    return [];
  }, [fetchedMovies, allMovies, filtersApplied]);
  

  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);

  const handleOpenAddCategoryModal = () => {
    setIsAddCategoryModalOpen(true);
  };

  const handleCloseAddCategoryModal = () => {
    setIsAddCategoryModalOpen(false);
  };

  const addCategoryMutation = useAddCategory();

  const handleAddCategory = async (categoryName: string) => {
    try {
      await addCategoryMutation.mutateAsync(categoryName);
      handleCloseAddCategoryModal();
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const addMovieMutation = useAddMovie(userId);

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
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
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
              <AddMovieModal
                onAddMovie={handleAddMovie}
                categories={categories}
              />
            </Box>
          </Box>
          <Box display="flex" gap={2} mb={4}>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <InputLabel id="sort-label">Sort Movies</InputLabel>
              <Select
                labelId="sort-label"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
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
                onChange={(e) => setGenreFilter(e.target.value)}
              >
                <MenuItem
                  value=""
                  sx={{
                    "&:hover": {
                      backgroundColor: "#E9F5EC",
                    },
                  }}
                >
                  None
                </MenuItem>
                {genreOptions.map((genre) => (
                  <MenuItem
                    key={genre}
                    value={genre}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#E9F5EC",
                      },
                    }}
                  >
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
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem
                  value=""
                  sx={{
                    "&:hover": {
                      backgroundColor: "#E9F5EC",
                    },
                  }}
                >
                  None
                </MenuItem>
                {statusOptions.map((status) => (
                  <MenuItem
                    key={status}
                    value={status}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#E9F5EC",
                      },
                    }}
                  >
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
                onChange={(e) => setWatchlistOrderFilter(e.target.value)}
              >
                <MenuItem
                  value=""
                  sx={{
                    "&:hover": {
                      backgroundColor: "#E9F5EC",
                    },
                  }}
                >
                  None
                </MenuItem>
                {watchlistOrderOptions.map((order) => (
                  <MenuItem
                    key={order}
                    value={order}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#E9F5EC",
                      },
                    }}
                  >
                    {order}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box
            display="flex"
            justifyContent="flex-end"
            gap={2}
            sx={{ mt: -5, mb: 4 }}
          >
            <Button
              variant="contained"
              onClick={handleApplyFilters}
              sx={{
                backgroundColor: "#2D6A4F",
                color: "#FFFFFF",
                "&:hover": {
                  backgroundColor: "#1B4332",
                },
              }}
            >
              Apply Filters
            </Button>
            <Button
              variant="outlined"
              onClick={handleResetFilters}
              sx={{
                color: "#2D6A4F",
                borderColor: "#2D6A4F",
                "&:hover": {
                  borderColor: "#1B4332",
                },
              }}
            >
              Reset Filters
            </Button>
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
                <InputLabel id="category-filter-label">
                  Select Category
                </InputLabel>
                <Select
                  labelId="category-filter-label"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <MenuItem
                    value=""
                    sx={{
                      "&:hover": {
                        backgroundColor: "#E9F5EC",
                      },
                    }}
                  >
                    None
                  </MenuItem>
                  {categories.map((category: WatchlistGroup) => (
                    <MenuItem
                      key={category.id}
                      value={category.id}
                      sx={{
                        "&:hover": {
                          backgroundColor: "#E9F5EC",
                        },
                      }}
                    >
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
                    backgroundColor: "#2196F3",
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
                  onClick={() =>
                    handleOpenDeleteCategoryModal(Number(selectedCategory))
                  }
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
          <Box>
            <Box>
            {movies.length > 0 ? (
   <MovieList
   movies={allMovies ?? []} // Use empty array if allMovies is undefined

   appliedFilters={appliedFilters}
   userId={userId}
   categories={categories}
   onMarkAsWatched={(movieId: string) =>
     console.log("Marking movie", movieId, "as watched")
   }
 />
 
  ) : (
    <Typography variant="h6" align="center" sx={{ mt: 4 }}>
      No movies found.
    </Typography>
  )}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default MoviesPage;
