import React, { useState } from "react";
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check"; // Green tick icon
import { Movie, MovieDTO } from "../types/Movie";
import EditMovieModal from "./EditMovieModal";
import DeleteMovieModal from "./DeleteMovieModal";
import ConfirmWatchModal from "./ConfirmWatchModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editMovie, deleteMovie } from "../api/movieApi";

interface MovieItemProps {
  movie: Movie;
  onMarkAsWatched: (movieId: string) => void; // Added: Prop for marking as watched
}

const MovieItem: React.FC<MovieItemProps> = ({ movie, onMarkAsWatched }) => {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isWatchModalOpen, setWatchModalOpen] = useState(false); // Added: State for watch modal

  const queryClient = useQueryClient();

  const editMovieMutation = useMutation({
    mutationFn: (updatedMovie: MovieDTO) =>
      editMovie(movie.movieId.toString(), updatedMovie),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
  });

  const deleteMovieMutation = useMutation({
    mutationFn: (movieToDelete: Movie) =>
      deleteMovie(movieToDelete.movieId.toString()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
  });

  const handleOpenEditModal = () => setEditModalOpen(true);
  const handleCloseEditModal = () => setEditModalOpen(false);

  const handleOpenDeleteModal = () => setDeleteModalOpen(true);
  const handleCloseDeleteModal = () => setDeleteModalOpen(false);

  const handleOpenWatchModal = () => setWatchModalOpen(true); // Added: Open watch modal
  const handleCloseWatchModal = () => setWatchModalOpen(false); // Added: Close watch modal

  const handleSaveMovie = async (movieDTO: MovieDTO) => {
    try {
      await editMovieMutation.mutateAsync(movieDTO);
      handleCloseEditModal();
    } catch (error) {
      console.error("Error updating movie:", error);
    }
  };

  const handleDeleteMovie = async () => {
    try {
      await deleteMovieMutation.mutateAsync(movie);
      handleCloseDeleteModal();
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  return (
    <>
      <ListItem
        sx={{
          borderBottom: "1px solid #e0e0e0",
          padding: 2,
          borderRadius: 2,
        }}
      >
        <ListItemText
          primary={movie.title}
          secondary={`Genre: ${movie.genre.name} | Description: ${movie.description} | Status: ${movie.status} | Order: ${movie.watchlistOrder}`}
        />
        <ListItemSecondaryAction>
          {/* Added: Mark as Watched Button */}
          <IconButton
            edge="end"
            aria-label="mark-as-watched"
            sx={{ mr: 1, color: "green" }}
            onClick={handleOpenWatchModal} // Open watch modal
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

      <EditMovieModal
        open={isEditModalOpen}
        movie={movie}
        onClose={handleCloseEditModal}
        onSave={handleSaveMovie}
      />

      {/* Added: Confirm Watch Modal */}
      <ConfirmWatchModal
        open={isWatchModalOpen}
        onClose={handleCloseWatchModal}
        movie={movie}
        onConfirm={() => onMarkAsWatched(movie.movieId.toString())}
      />

      <DeleteMovieModal
        open={isDeleteModalOpen}
        movieTitle={movie.title}
        onClose={handleCloseDeleteModal}
        onDelete={handleDeleteMovie}
      />
    </>
  );
};

export default MovieItem;
