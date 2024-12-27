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
import { Movie, MovieDTO } from '../types/Movie';

interface EditMovieModalProps {
  open: boolean;
  movie: Movie;
  onClose: () => void;
  onSave: (movie: MovieDTO) => void;
}

interface ValidationErrors {
  title?: string;
  description?: string;
  genreName?: string;
  watchlistOrder?: string;
}

const GENRES = [
  'Comedy',
  'Drama',
  'Action',
  'Horror',
  'Thriller',
  'Romance',
  'Documentary',
  'Animation'
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
    setEditedMovie({ ...movie });
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
    let updatedMovie;
    
    if (name === 'genreName') {
      updatedMovie = {
        ...editedMovie,
        genre: {
          ...editedMovie.genre,
          name: value
        }
      };
    } else {
      updatedMovie = {
        ...editedMovie,
        [name]: value,
      };
    }
    
    setEditedMovie(updatedMovie);
    setHasChanges(checkForChanges(updatedMovie));
    
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const movieToSave: MovieDTO = {
        title: editedMovie.title,
        description: editedMovie.description,
        status: 'To Watch', 
        watchlistOrder: editedMovie.watchlistOrder,
        genreId: editedMovie.genre.genreId 
      };
      onSave(movieToSave);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Movie</DialogTitle>
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
                <MenuItem key={genre} value={genre}>
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
              value={editedMovie.watchlistOrder}
              onChange={handleSelectChange}
              label="Watch Order"
            >
              <MenuItem value="Next Up">Next Up</MenuItem>
              <MenuItem value="When I have time">When I have time</MenuItem>
              <MenuItem value="Someday">Someday</MenuItem>
            </Select>
            {errors.watchlistOrder && <FormHelperText>{errors.watchlistOrder}</FormHelperText>}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={!hasChanges}
          >
            Save Changes
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditMovieModal;
