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
import CheckIcon from "@mui/icons-material/Check";
import { Movie, AddMovieDTO } from "../types/Movie";
import { WatchlistGroup } from "../types/WatchlistGroup";
import EditMovieModal from "./EditMovieModal";
import DeleteMovieModal from "./DeleteMovieModal";
import ConfirmWatchModal from "./ConfirmWatchModal";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useMarkAsWatched } from "../hooks/useMovie";
import { useDeleteMovie, useEditMovie } from "../hooks/useMovie";

interface MovieItemProps {
  movie: Movie;
  categories: WatchlistGroup[];
  userId: string;
  onMarkAsWatched: (movieId: string) => void;
}

const MovieItem: React.FC<MovieItemProps> = ({
  movie,
  userId,
  categories,
  onMarkAsWatched,
}) => {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isWatchModalOpen, setWatchModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleOpenWatchModal = () => {
    if (movie.status === "Watched") {
      toast.warning("You cannot mark the same movie as watched twice!");
      return;
    }
    setWatchModalOpen(true);
  };

  const { mutate: markAsWatched } = useMarkAsWatched(movie.title);

  const handleConfirmWatch = () => {
    markAsWatched(
      { userId, movieId: movie.movieId.toString() },
      {
        onSuccess: () => {
          setWatchModalOpen(false);
          onMarkAsWatched(movie.movieId.toString());
        },
      }
    );
  };

  const deleteMovieMutation = useDeleteMovie();

  const handleDeleteMovie = () => {
    deleteMovieMutation.mutate(movie.movieId.toString(), {
      onSuccess: () => {
        handleCloseDeleteModal();
      },
    });
  };

  const updateMovieMutation = useEditMovie();

  const handleEditMovie = (movieId: number, movieData: AddMovieDTO) => {
    updateMovieMutation.mutate(
      { movieId: movieId.toString(), movieData },
      {
        onSuccess: () => {
          handleCloseEditModal();
        },
      }
    );
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
          disableTypography={true}
          primary={
            <Typography
              component="span"
              sx={{
                color: "#2D6A4F",
                fontWeight: "bold",
                fontSize: "1.2rem",
                marginBottom: "8px",
                display: "block",
              }}
            >
              {movie.title}
            </Typography>
          }
          secondary={
            <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <Box sx={{ display: "block" }}>
                <Typography
                  component="span"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    color: "#2D6A4F",
                    marginRight: "8px",
                  }}
                >
                  Genre:
                </Typography>
                {movie.genre.name}
              </Box>

              <Box sx={{ display: "block" }}>
                <Typography
                  component="span"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    color: "#2D6A4F",
                    marginRight: "8px",
                  }}
                >
                  Description:
                </Typography>
                {movie.description}
              </Box>

              <Box sx={{ display: "block" }}>
                <Typography
                  component="span"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    color: "#2D6A4F",
                    marginRight: "8px",
                  }}
                >
                  Status:
                </Typography>
                {movie.status}
              </Box>

              <Box sx={{ display: "block" }}>
                <Typography
                  component="span"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    color: "#2D6A4F",
                    marginRight: "8px",
                  }}
                >
                  Watch Order:
                </Typography>
                {movie.watchlistOrder}
              </Box>
              <Box sx={{ display: "block" }}>
                <Typography
                  component="span"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    color: "#2D6A4F",
                    marginRight: "8px",
                  }}
                >
                  Categories:
                </Typography>
                {Array.isArray(movie.watchlistGroupNames) &&
                movie.watchlistGroupNames.length > 0
                  ? movie.watchlistGroupNames.join(", ")
                  : "No categories"}
              </Box>
            </Box>
          }
        />
        <ListItemSecondaryAction>
          <IconButton
            edge="end"
            aria-label="mark-as-watched"
            sx={{ mr: 1, color: "green" }}
            onClick={handleOpenWatchModal}
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
        movie={{
          movieId: movie.movieId,
          title: movie.title,
          description: movie.description,
          status: movie.status,
          watchlistOrder: movie.watchlistOrder,
          genreName: movie.genre.name,
          watchlistGroupNames: movie.watchlistGroupNames,
        }}
        categories={categories}
        onClose={handleCloseEditModal}
        onSave={handleEditMovie}
      />

      <ConfirmWatchModal
        open={isWatchModalOpen}
        onClose={handleCloseWatchModal}
        movie={movie}
        onConfirm={handleConfirmWatch}
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