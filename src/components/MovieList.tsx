

import React from "react";
import { List, Paper } from "@mui/material";
import MovieItem from "./MovieItem";
import { Movie } from "../types/Movie";

interface MovieListProps {
  movies: Movie[];
  onMarkAsWatched: (movieId: string) => void;
  userId: string; // Add userId prop
}

const MovieList: React.FC<MovieListProps> = ({ movies, onMarkAsWatched, userId }) => {
  return (
    <Paper elevation={2} sx={{ mt: 2, mb: 2 }}>
      <List sx={{
        backgroundColor: "#EAFCE3"
      }}>
        {movies.map((movie) => (
          <MovieItem
            key={movie.movieId}
            movie={movie}
            userId={userId} // Pass userId to MovieItem
            onMarkAsWatched={onMarkAsWatched}
          />
        ))}
      </List>
    </Paper>
  );
};

export default MovieList;



