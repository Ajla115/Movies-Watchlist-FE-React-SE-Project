// import React from "react";
// import { List, Paper } from "@mui/material";
// import { Movie } from "../types/Movie";
// import MovieItem from "./MovieItem";

// interface MovieListProps {
//   movies: Movie[];
// }

// const MovieList: React.FC<MovieListProps> = ({ movies }) => {
//   return (
//     <Paper elevation={2} sx={{ mt: 2, mb: 2 }}>
//       <List>
//         {movies.map((movie) => (
//           <MovieItem key={movie.movieId} movie={movie} />
//         ))}
//       </List>
//     </Paper>
//   );
// };

// export default MovieList;
import React from "react";
import { List, Paper } from "@mui/material";
import MovieItem from "./MovieItem";
import { Movie } from "../types/Movie";

interface MovieListProps {
  movies: Movie[]; // Existing movies prop
  onMarkAsWatched: (movieId: string) => void; // Added: Prop for marking movies as watched
}

const MovieList: React.FC<MovieListProps> = ({ movies, onMarkAsWatched }) => {
  return (
    <Paper elevation={2} sx={{ mt: 2, mb: 2 }}>
      <List>
        {movies.map((movie) => (
          <MovieItem
            key={movie.movieId}
            movie={movie}
            onMarkAsWatched={onMarkAsWatched} // Pass the required onMarkAsWatched prop to MovieItem
          />
        ))}
      </List>
    </Paper>
  );
};

export default MovieList;
