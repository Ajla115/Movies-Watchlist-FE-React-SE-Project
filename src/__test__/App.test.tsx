import React from "react";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import "@testing-library/jest-dom";
import App from "../App";


jest.mock("../pages/HomePage", () => () => (
  <div data-testid="home-page">Mocked HomePage</div>
));
jest.mock("../pages/MoviesPage", () => () => (
  <div data-testid="movies-page">Mocked MoviesPage</div>
));

describe("App Component", () => {
  const renderWithProviders = (ui: React.ReactElement) => {
    const queryClient = new QueryClient();
    return render(
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    );
  };

  it("renders the HomePage for the root route '/'", () => {
    window.history.pushState({}, "HomePage", "/");
    renderWithProviders(<App />);
    expect(screen.getByTestId("home-page")).toBeInTheDocument();
  });

  it("renders the MoviesPage for the '/movies' route", () => {
    window.history.pushState({}, "MoviesPage", "/movies");
    renderWithProviders(<App />);
    expect(screen.getByTestId("movies-page")).toBeInTheDocument();
  });



  it("does not render HomePage when on '/movies' route", () => {
    window.history.pushState({}, "MoviesPage", "/movies");
    renderWithProviders(<App />);
    expect(screen.queryByTestId("home-page")).not.toBeInTheDocument();
  });

  it("does not render MoviesPage when on '/' route", () => {
    window.history.pushState({}, "HomePage", "/");
    renderWithProviders(<App />);
    expect(screen.queryByTestId("movies-page")).not.toBeInTheDocument();
  });


});
