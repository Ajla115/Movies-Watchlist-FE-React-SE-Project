export interface Genre {
  genreId: number;
  name: string;
}

export interface User {
  userId: number;
  email: string;
  emailEnabled: boolean;
}

export interface Movie {
  movieId: number;
  title: string;
  description: string;
  status: string; 
  watchlistOrder: string; 
  genre: Genre;
  user: User;
}

export interface MovieDTO {
  title: string;
  description: string;
  status: string;
  watchlistOrder: string;
  genreId: number;
}

export interface AddMovieDTO {
  title: string;
  description: string;
  status: string;
  watchlistOrder: string;
  genreName: string;
}

