
// import { render, screen, fireEvent } from "@testing-library/react";
// import "@testing-library/jest-dom";
// import AddMovieModal from "../../components/AddMovieModal";

// jest.mock("axios", () => ({
//   post: jest.fn(() => Promise.resolve({ data: "Mocked Response" })),
// }));

// describe("AddMovieModal Component", () => {
//   const mockOnAddMovie = jest.fn();

//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it("renders the Add Movie button", () => {
//     render(<AddMovieModal onAddMovie={mockOnAddMovie} />);
//     expect(screen.getByText("Add Movie Modal")).toBeInTheDocument();
//   });

//   it("opens the modal when Add Movie button is clicked", () => {
//     render(<AddMovieModal onAddMovie={mockOnAddMovie} />);
//     const addButton = screen.getByText("Add Movie Modal");
//     fireEvent.click(addButton);
//     expect(screen.getByText("ADD NEW MOVIE")).toBeInTheDocument();
//   });

//   it("displays validation message under the Description field when only the Title is filled", async () => {
//     render(<AddMovieModal onAddMovie={mockOnAddMovie} />);
  
//     const addButton = screen.getByText("Add Movie Modal");
//     fireEvent.click(addButton);

//     const titleInput = screen.getByPlaceholderText("Enter movie title");
//     fireEvent.change(titleInput, { target: { value: "Sample Movie" } });
  
//     const saveButton = screen.getByText("Add Movie");
//     fireEvent.click(saveButton);
  
//     expect(screen.getByText("Description is required")).toBeInTheDocument();
  
//     expect(screen.queryByText("Title is required")).not.toBeInTheDocument();

//     expect(mockOnAddMovie).not.toHaveBeenCalled();
//   });
  
  
// });

export {};