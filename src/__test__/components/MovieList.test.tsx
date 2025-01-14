import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MovieList from "../../components/MovieList";
import { Movie } from "../../types/Movie";
import { WatchlistGroup } from "../../types/WatchlistGroup";

jest.mock("../../components/MovieItem", () => () => (
  <div data-testid="movie-item">Mocked MovieItem</div>
));

afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

describe("MovieList Component", () => {
  const mockMovies: Movie[] = [
    {
      movieId: 1,
      title: "Inception",
      description: "A mind-bending thriller",
      genre: { genreId: 1, name: "Sci-Fi" },
      status: "To Watch",
      watchlistOrder: "Next Up",
      user: { userId: 1, email: "test@example.com", emailEnabled: true },
      watchlistGroupNames: ["Favorites", "Watch Later"],
    },
    {
      movieId: 2,
      title: "The Dark Knight",
      description: "A gritty superhero film",
      genre: { genreId: 2, name: "Action" },
      status: "Watched",
      watchlistOrder: "Someday",
      user: { userId: 1, email: "test@example.com", emailEnabled: true },
      watchlistGroupNames: ["Favorites"],
    },
  ];

  const mockCategories: WatchlistGroup[] = [
    { id: 1, name: "Favorites" },
    { id: 2, name: "Watch Later" },
  ];

  const mockOnMarkAsWatched = jest.fn();

  it("renders the container with proper styling", () => {
    render(
      <MovieList
        movies={mockMovies}
        categories={mockCategories}
        onMarkAsWatched={mockOnMarkAsWatched}
        userId="1"
      />
    );
    const container = screen.getByRole("list");
    expect(container).toBeInTheDocument();
    expect(container).toHaveStyle("background-color: #EAFCE3");
  });

  it("renders the MovieItem components for each movie", () => {
    render(
      <MovieList
        movies={mockMovies}
        categories={mockCategories}
        onMarkAsWatched={mockOnMarkAsWatched}
        userId="1"
      />
    );
    const movieItems = screen.getAllByTestId("movie-item");
    expect(movieItems).toHaveLength(mockMovies.length);
  });

  it("calls onMarkAsWatched when a movie is marked as watched", () => {
    render(
      <MovieList
        movies={mockMovies}
        categories={mockCategories}
        onMarkAsWatched={mockOnMarkAsWatched}
        userId="1"
      />
    );
    expect(mockOnMarkAsWatched).not.toHaveBeenCalled();
  });
});
