import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from '../../pages/HomePage';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


const queryClient = new QueryClient();

jest.mock("../../components/EmailInput", () => () => (
  <div data-testid="email-input">
    <h1>Welcome to Movie Watchlist</h1>
    <p>Manage your movies efficiently and effortlessly.</p>
    <input type="email" placeholder="Enter your email" />
    <button>View Your Movies</button>
  </div>
));

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    </BrowserRouter>
  );
};

describe("HomePage", () => {
  it("renders the container with proper styling", async () => {
    renderWithProviders(<HomePage />);
    const container = await screen.findByRole("main");
    expect(container).toBeInTheDocument();
  });

  it("renders the welcome message", () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByText("Welcome to Movie Watchlist")).toBeInTheDocument();
    expect(
      screen.getByText("Manage your movies efficiently and effortlessly.")
    ).toBeInTheDocument();
  });

  it("renders the EmailInput component", () => {
    renderWithProviders(<HomePage />);
    const emailInput = screen.getByTestId("email-input");
    expect(emailInput).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(screen.getByText("View Your Movies")).toBeInTheDocument();
  });

  it("renders the subtitle message", () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByText("Manage your movies efficiently and effortlessly.")).toBeInTheDocument();
    expect(
      screen.getByText("Manage your movies efficiently and effortlessly.")
    ).toBeInTheDocument();
  });
  

});

