// import React from "react";
// import { List, Paper } from "@mui/material";
// import MovieItem from "./MovieItem";
// import { Movie } from "../types/Movie";
// import { WatchlistGroup } from "../types/WatchlistGroup";

// interface MovieListProps {
//   movies: Movie[];
//   categories: WatchlistGroup[];
//   onMarkAsWatched: (movieId: string) => void;
//   userId: string;
// }

// const MovieList: React.FC<MovieListProps> = ({
//   movies,
//   categories,
//   onMarkAsWatched,
//   userId,
// }) => {
//   return (
//     <Paper elevation={2} sx={{ mt: 2, mb: 2 }}>
//       <List
//         sx={{
//           backgroundColor: "#EAFCE3",
//         }}
//       >
//         {movies.map((movie) => (
//           <MovieItem
//             key={movie.movieId}
//             movie={movie}
//             userId={userId}
//             categories={categories}
//             onMarkAsWatched={onMarkAsWatched}
//           />
//         ))}
//       </List>
//     </Paper>
//   );
// };



// export default MovieList;

import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import MovieItem from "./MovieItem";
import { Movie} from "../types/Movie";
import { WatchlistGroup } from "../types/WatchlistGroup";

interface MovieListProps {
  movies?: Movie[];
  appliedFilters: {
    genre: string;
    status: string;
    watchlistOrder: string;
    sort: string;
    categoryId: string;
  };
  userId: string;
  categories: WatchlistGroup[];
  onMarkAsWatched: (movieId: string) => void;
}

const MovieList: React.FC<MovieListProps> = ({
  movies = [],
  appliedFilters,
  userId,
  categories,
  onMarkAsWatched,
}) => {
  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const { genre, status, watchlistOrder, categoryId } = appliedFilters;

      if (genre && movie.genre.name !== genre) return false;
      if (status && movie.status !== status) return false;
      if (watchlistOrder && movie.watchlistOrder !== watchlistOrder)
        return false;
      if (categoryId && movie.watchlistGroupNames.indexOf(categoryId) === -1)
        return false;

      return true;
    });
  }, [movies, appliedFilters]);

  if (filteredMovies.length === 0) {
    return (
      <Typography variant="h6" align="center" sx={{ mt: 4 }}>
        No movies found.
      </Typography>
    );
  }

  return (
    <Box>
      {filteredMovies.map((movie) => (
        <MovieItem
          key={movie.movieId}
          movie={movie}
          userId={userId}
          categories={categories}
          onMarkAsWatched={onMarkAsWatched}
        />
      ))}
    </Box>
  );
};

export default MovieList;
