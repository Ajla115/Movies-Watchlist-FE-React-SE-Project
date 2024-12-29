import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormHelperText,
} from '@mui/material';
import { Movie, AddMovieDTO, MovieDTO } from '../types/Movie';

interface EditMovieModalProps {
  open: boolean;
  movie: Movie; // Original Movie object
  onClose: () => void;
  onSave: (movieId: number, movie: AddMovieDTO) => void; // Include `movieId` as a separate parameter
}

interface ValidationErrors {
  title?: string;
  description?: string;
  genreName?: string;
  watchlistOrder?: string;
}

const GENRES = [
  'Action',
  'Adventure',
  'Animation',
  'Biography',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Family',
  'Fantasy',
  'Historical',
  'Horror',
  'Musical',
  'Mystery',
  'Romance',
  'Science Fiction',
  'Sports',
  'Thriller',
  'Western',
];

const EditMovieModal: React.FC<EditMovieModalProps> = ({
  open,
  movie,
  onClose,
  onSave,
}) => {
  const [editedMovie, setEditedMovie] = useState<Movie>({ ...movie });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setEditedMovie({
      ...movie,
      genre: movie.genre || { name: '' }, // Ensure genre is initialized
    });
    setErrors({});
    setHasChanges(false);
  }, [movie]);

  const validateForm = () => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    if (!editedMovie.title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    }

    if (!editedMovie.description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    }

    if (!editedMovie.genre?.name) {
      newErrors.genreName = 'Genre is required';
      isValid = false;
    }

    if (!editedMovie.watchlistOrder) {
      newErrors.watchlistOrder = 'Watch order is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const checkForChanges = (updatedMovie: Movie) => {
    return (
      updatedMovie.title !== movie.title ||
      updatedMovie.description !== movie.description ||
      updatedMovie.genre?.name !== movie.genre?.name ||
      updatedMovie.watchlistOrder !== movie.watchlistOrder
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedMovie = {
      ...editedMovie,
      [name]: value,
    };
    setEditedMovie(updatedMovie);
    setHasChanges(checkForChanges(updatedMovie));

    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    
    setEditedMovie(prev => {
      let updated;
      if (name === "genreName") {
        updated = {
          ...prev,
          genre: { ...prev.genre, name: value }
        };
      } else if (name === "watchlistOrder") {
        updated = {
          ...prev,
          watchlistOrder: value
        };
      } else {
        updated = prev;
      }
      return updated;
    });

    setHasChanges(true);
    
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const movieToSave: AddMovieDTO = {
        title: editedMovie.title,
        description: editedMovie.description,
        status: movie.status, // Keep the current status
        watchlistOrder: editedMovie.watchlistOrder,
        genreName: editedMovie.genre?.name || '',
      };

      console.log('Submitting movie:', movieToSave); // Debug log
      onSave(movie.movieId, movieToSave);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth sx={{
      '& .MuiPaper-root': {
        border: '2px solid #2D6A4F', // Dark green border
        borderRadius: '8px', // Optional rounded corners
      },
    }}>
      <DialogTitle sx={{
        fontWeight: 'bold', // Bold
        textTransform: 'uppercase', // All capital letters
        color: '#2D6A4F', // Dark green color
      }}>Edit Movie</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Title"
            name="title"
            value={editedMovie.title}
            onChange={handleInputChange}
            error={!!errors.title}
            helperText={errors.title}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Description"
            name="description"
            value={editedMovie.description}
            onChange={handleInputChange}
            multiline
            rows={4}
            error={!!errors.description}
            helperText={errors.description}
          />
          <FormControl
            fullWidth
            margin="normal"
            error={!!errors.genreName}
          >
            <InputLabel>Genre</InputLabel>
            <Select
              name="genreName"
              value={editedMovie.genre?.name || ''}
              onChange={handleSelectChange}
              label="Genre"
            >
              {GENRES.map((genre) => (
                <MenuItem key={genre} value={genre} sx={{
                  "&:hover": {
                    backgroundColor: "#E9F5EC", // Light green hover
                  },
                }}>
                  {genre}
                </MenuItem>
              ))}
            </Select>
            {errors.genreName && <FormHelperText>{errors.genreName}</FormHelperText>}
          </FormControl>
          <FormControl
            fullWidth
            margin="normal"
            error={!!errors.watchlistOrder}
          >
            <InputLabel>Watch Order</InputLabel>
            <Select
              name="watchlistOrder"
              value={editedMovie.watchlistOrder || ''}
              onChange={handleSelectChange}
              label="Watch Order"
            >
              <MenuItem value="Next Up" sx={{
                "&:hover": {
                  backgroundColor: "#E9F5EC", // Light green hover
                },
              }}>Next Up</MenuItem>
              <MenuItem value="When I have time" sx={{
                "&:hover": {
                  backgroundColor: "#E9F5EC", // Light green hover
                },
              }}>When I have time</MenuItem>
              <MenuItem value="Someday" sx={{
                "&:hover": {
                  backgroundColor: "#E9F5EC", // Light green hover
                },
              }}>Someday</MenuItem>
            </Select>
            {errors.watchlistOrder && <FormHelperText>{errors.watchlistOrder}</FormHelperText>}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onClose}
            sx={{
              backgroundColor: '#E63946', // Medium red
              color: '#FFFFFF', // White text
              '&:hover': {
                backgroundColor: '#B22234', // Darker red on hover
              },
            }}
          >Cancel</Button>

          <Button
            type="submit"
            variant="contained"
            disabled={!hasChanges} // Disable until changes are detected
            sx={{
              backgroundColor: hasChanges ? '#52B788' : '#A9A9A9', // Medium green when enabled, grey when disabled
              color: '#FFFFFF',
              '&:hover': {
                backgroundColor: hasChanges ? '#2D6A4F' : '#A9A9A9', // Dark green hover only when enabled
              },
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditMovieModal;
