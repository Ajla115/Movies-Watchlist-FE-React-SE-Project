import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import DeleteMovieModal from "../../components/DeleteMovieModal";

describe("DeleteMovieModal Component", () => {
  const mockOnClose = jest.fn();
  const mockOnDelete = jest.fn();
  const movieTitle = "Sample Movie";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with the movie title", () => {
    render(
      <DeleteMovieModal
        open={true}
        movieTitle={movieTitle}
        onClose={mockOnClose}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("DELETE MOVIE")).toBeInTheDocument();

 
    const expectedText = `Are you sure you want to delete "${movieTitle}"? This action cannot be undone.`;
    expect(screen.getByText(expectedText)).toBeInTheDocument();
  });

  it("calls onClose when Cancel is clicked", () => {
    render(
      <DeleteMovieModal
        open={true}
        movieTitle={movieTitle}
        onClose={mockOnClose}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.click(screen.getByText("Cancel"));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls onDelete when Delete is clicked", () => {
    render(
      <DeleteMovieModal
        open={true}
        movieTitle={movieTitle}
        onClose={mockOnClose}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.click(screen.getByText("Delete"));
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });
});