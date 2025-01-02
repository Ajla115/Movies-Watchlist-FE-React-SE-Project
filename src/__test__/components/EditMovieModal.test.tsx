import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditMovieModal from '../../components/EditMovieModal';
import { Movie } from '../../types/Movie';

const mockOnClose = jest.fn();
const mockOnSave = jest.fn();

const sampleMovie: Movie = {
  movieId: 1,
  title: 'Sample Movie',
  description: 'Sample Description',
  status: 'To Watch',
  watchlistOrder: 'Next Up',
  genre: { genreId: 1, name: 'Action' },
  user: { userId: 1, email: 'user@example.com', emailEnabled: true },
};

describe('EditMovieModal Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the modal with correct initial values', () => {
    render(
      <EditMovieModal
        open={true}
        movie={sampleMovie}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByLabelText('Title')).toHaveValue(sampleMovie.title);
    expect(screen.getByLabelText('Description')).toHaveValue(
      sampleMovie.description
    );
    
  });

  it('displays validation messages when submitting with empty required fields', () => {
    render(
      <EditMovieModal
        open={true}
        movie={sampleMovie}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: '' },
    });
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: '' },
    });

    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    expect(screen.getByText('Title is required')).toBeInTheDocument();
    expect(screen.getByText('Description is required')).toBeInTheDocument();

    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('disables the Save Changes button until there are changes', () => {
    render(
      <EditMovieModal
        open={true}
        movie={sampleMovie}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const saveButton = screen.getByRole('button', { name: /save changes/i });
    expect(saveButton).toBeDisabled();

    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Updated Movie' },
    });
    expect(saveButton).toBeEnabled();
  });

  it('calls onSave with updated values when the form is submitted', () => {
    render(
      <EditMovieModal
        open={true}
        movie={sampleMovie}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );


    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Updated Movie' },
    });
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Updated Description' },
    });

    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    expect(mockOnSave).toHaveBeenCalledWith(1, {
      title: 'Updated Movie',
      description: 'Updated Description',
      status: 'To Watch',
      watchlistOrder: 'Next Up',
      genreName: 'Action',
    });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onClose when Cancel button is clicked', () => {
    render(
      <EditMovieModal
        open={true}
        movie={sampleMovie}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
