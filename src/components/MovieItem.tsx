import React, { useState } from "react";
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check"; // Green tick icon
import { Movie, AddMovieDTO } from "../types/Movie";
import EditMovieModal from "./EditMovieModal";
import DeleteMovieModal from "./DeleteMovieModal";
import ConfirmWatchModal from "./ConfirmWatchModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAsWatched, deleteMovie, editMovie } from "../api/movieApi";
import { toast } from "react-toastify";

interface MovieItemProps {
  movie: Movie;
  userId: string; // Add userId to the props
  onMarkAsWatched: (movieId: string) => void;
}

const MovieItem: React.FC<MovieItemProps> = ({ movie }) => {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isWatchModalOpen, setWatchModalOpen] = useState(false); // Watch modal state
  const queryClient = useQueryClient();

  const markAsWatchedMutation = useMutation({
    mutationFn: async () => markAsWatched(movie.user.userId.toString(), movie.movieId.toString()),
    onSuccess: (message) => {
      if (message) {
        toast.success(message); // Show success message if email is enabled
      } else {
        toast.info("Thank you for watching!"); // Show default message
      }
      queryClient.invalidateQueries({ queryKey: ["movies"] }); // Refresh the movie list
    },
    onError: (error: any) => {
      if (error.response?.status === 400) {
        toast.warning(error.response.data); // Show warning message from backend
      } else {
        console.error("Error marking movie as watched:", error);
        toast.error("Failed to mark the movie as watched");
      }
    },
  });

  const deleteMovieMutation = useMutation({
    mutationFn: async () => deleteMovie(movie.movieId.toString()),
    onSuccess: () => {
      toast.success("Movie deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      handleCloseDeleteModal();
    },
    onError: (error: any) => {
      console.error("Error deleting movie:", error);
      toast.error("Failed to delete the movie");
    },
  });

  const updateMovieMutation = useMutation({
    mutationFn: async ({ movieId, movieData }: { movieId: string, movieData: AddMovieDTO }) => {
      console.log('Updating movie:', { movieId, movieData }); // Debug log
      return editMovie(movieId, movieData);
    },
    onSuccess: () => {
      toast.success("Movie updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      handleCloseEditModal();
    },
    onError: (error: any) => {
      console.error("Error updating movie:", error);
      toast.error("Failed to update the movie");
    },
  });

  const handleOpenWatchModal = () => {
    if (movie.status === "Watched") {
      toast.warning("You cannot mark the same movie as watched twice!");
      return;
    }
    setWatchModalOpen(true);
  };

  const handleConfirmWatch = () => {
    markAsWatchedMutation.mutate(); // Trigger the mutation
    setWatchModalOpen(false);
  };

  const handleOpenEditModal = () => setEditModalOpen(true);
  const handleCloseEditModal = () => setEditModalOpen(false);

  const handleOpenDeleteModal = () => setDeleteModalOpen(true);
  const handleCloseDeleteModal = () => setDeleteModalOpen(false);

  const handleCloseWatchModal = () => setWatchModalOpen(false);

  return (
    <>
      <ListItem
        sx={{
          borderBottom: "1px solid #e0e0e0",
          padding: 2,
          borderRadius: "8px",
          border: "2px solid #2D6A4F",
          marginBottom: "16px",
          backgroundColor: "white",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <ListItemText
           primary={ <Typography
          component="span"
          sx={{
            color: "#2D6A4F",
            fontWeight: "bold",
            fontSize: "1.2rem",
            marginBottom: "8px",
            display: "block"
          }}
        >
          {movie.title}
        </Typography>
      }
        secondary={
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Typography component="span" sx={{ display: 'block' }}>
              <Typography
                component="span"
                sx={{
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  color: "#2D6A4F",
                  marginRight: "8px"
                }}
              >
                Genre:
              </Typography>
              {movie.genre.name}
            </Typography>

            <Typography component="span" sx={{ display: 'block' }}>
              <Typography
                component="span"
                sx={{
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  color: "#2D6A4F",
                  marginRight: "8px"
                }}
              >
                Description:
              </Typography>
              {movie.description}
            </Typography>

            <Typography component="span" sx={{ display: 'block' }}>
              <Typography
                component="span"
                sx={{
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  color: "#2D6A4F",
                  marginRight: "8px"
                }}
              >
                Status:
              </Typography>
              {movie.status}
            </Typography>

            <Typography component="span" sx={{ display: 'block' }}>
              <Typography
                component="span"
                sx={{
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  color: "#2D6A4F",
                  marginRight: "8px"
                }}
              >
                Watch Order:
              </Typography>
              {movie.watchlistOrder}
            </Typography>
          </Box>
        }
    
        />
        <ListItemSecondaryAction>
          {/* Green tick button to mark as watched */}
          <IconButton
            edge="end"
            aria-label="mark-as-watched"
            sx={{ mr: 1, color: "green" }}
            onClick={handleOpenWatchModal} // Open watch confirmation modal
          >
            <CheckIcon />
          </IconButton>
          <IconButton
            edge="end"
            aria-label="edit"
            sx={{ mr: 1 }}
            onClick={handleOpenEditModal}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            edge="end"
            aria-label="delete"
            color="error"
            onClick={handleOpenDeleteModal}
          >
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>

      {/* Edit Movie Modal */}
      <EditMovieModal
        open={isEditModalOpen}
        movie={movie}
        onClose={handleCloseEditModal}
        onSave={(movieId, movieData) =>
          updateMovieMutation.mutate({
            movieId: movieId.toString(),
            movieData
          })
        }
      />

      {/* Confirm Watch Modal */}
      <ConfirmWatchModal
        open={isWatchModalOpen}
        onClose={handleCloseWatchModal}
        movie={movie}
        onConfirm={handleConfirmWatch} // Confirm watch handler
      />

      {/* Delete Movie Modal */}
      <DeleteMovieModal
        open={isDeleteModalOpen}
        movieTitle={movie.title}
        onClose={handleCloseDeleteModal}
        onDelete={() => deleteMovieMutation.mutate()} // Call the delete mutation
      />

    </>
  );
};

export default MovieItem;
