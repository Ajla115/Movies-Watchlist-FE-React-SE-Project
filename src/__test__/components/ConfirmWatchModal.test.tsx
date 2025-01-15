import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ConfirmWatchModal from "../../components/ConfirmWatchModal";
import { Movie } from "../../types/Movie";

describe("ConfirmWatchModal Component", () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();
  const movie: Movie = {
    movieId: 1,
    title: "Sample Movie",
    description: "Sample Description",
    status: "To Watch",
    watchlistOrder: "Next Up",
    genre: { genreId: 1, name: "Action" },
    user: { userId: 1, email: "test@example.com", emailEnabled: true },
    watchlistGroupNames: ["Demo Group"]
    
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with the movie title", () => {
    render(
      <ConfirmWatchModal
        open={true}
        movie={movie}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

   
    expect(screen.getByText("MARK AS WATCHED")).toBeInTheDocument();


    const expectedText = `Are you sure you want to mark "Sample Movie" as watched? This action cannot be undone.`;
    expect(screen.getByText(expectedText)).toBeInTheDocument();
    
  });

  it("calls onClose when Cancel is clicked", () => {
    render(
      <ConfirmWatchModal
        open={true}
        movie={movie}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    fireEvent.click(screen.getByText("Cancel"));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls onConfirm when Confirm is clicked", () => {
    render(
      <ConfirmWatchModal
        open={true}
        movie={movie}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    fireEvent.click(screen.getByText("Confirm"));
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });
});
