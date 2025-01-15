import React from "react";
import { List, Paper } from "@mui/material";
import MovieItem from "./MovieItem";
import { Movie } from "../types/Movie";
import { WatchlistGroup } from "../types/WatchlistGroup";

interface MovieListProps {
  movies: Movie[];
  categories: WatchlistGroup[];
  onMarkAsWatched: (movieId: string) => void;
  userId: string;
}

const MovieList: React.FC<MovieListProps> = ({
  movies,
  categories,
  onMarkAsWatched,
  userId,
}) => {
  return (
    <Paper elevation={2} sx={{ mt: 2, mb: 2 }}>
      <List
        sx={{
          backgroundColor: "#EAFCE3",
        }}
      >
        {movies.map((movie) => (
          <MovieItem
            key={movie.movieId}
            movie={movie}
            userId={userId}
            categories={categories}
            onMarkAsWatched={onMarkAsWatched}
          />
        ))}
      </List>
    </Paper>
  );
};

export default React.memo(MovieList, (prevProps, nextProps) => {
  return (
    prevProps.movies === nextProps.movies &&
    prevProps.categories === nextProps.categories &&
    prevProps.userId === nextProps.userId
  );
});


