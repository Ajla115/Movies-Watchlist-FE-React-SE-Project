import React, { useState } from 'react';
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
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { AddMovieDTO } from '../types/Movie';

interface AddMovieModalProps {
  onAddMovie: (movie: AddMovieDTO) => void;
}

const initialMovieState: AddMovieDTO = {
  title: '',
  description: '',
  status: 'To Watch',
  watchlistOrder: '',
  genreName: '',
};

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

const AddMovieModal: React.FC<AddMovieModalProps> = ({ onAddMovie }) => {
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newMovie, setNewMovie] = useState<AddMovieDTO>(initialMovieState);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setErrors({});
    setNewMovie(initialMovieState);
  };

  const validateFields = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (!newMovie.title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    }

    if (!newMovie.description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    }

    if (!newMovie.watchlistOrder) {
      newErrors.watchlistOrder = 'Watch order is required';
      isValid = false;
    }

    if (!newMovie.genreName) {
      newErrors.genreName = 'Genre is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewMovie(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setNewMovie(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFields()) {
      return;
    }

    try {
      await onAddMovie(newMovie);
      handleClose();
    } catch (error) {
      console.error('Failed to add movie:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to add movie. Please try again.',
      }));
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleOpen}
      >
        Add Movie
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Movie</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {errors.submit && (
              <Typography color="error" sx={{ mb: 2 }}>
                {errors.submit}
              </Typography>
            )}
            <TextField
              fullWidth
              margin="normal"
              label="Title"
              name="title"
              value={newMovie.title}
              onChange={handleInputChange}
              error={!!errors.title}
              helperText={errors.title}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Description"
              name="description"
              value={newMovie.description}
              onChange={handleInputChange}
              multiline
              rows={3}
              error={!!errors.description}
              helperText={errors.description}
              required
            />
            <FormControl 
              fullWidth 
              margin="normal"
              error={!!errors.watchlistOrder}
              required
            >
              <InputLabel>Watch Order</InputLabel>
              <Select
                name="watchlistOrder"
                value={newMovie.watchlistOrder}
                onChange={handleSelectChange}
                label="Watch Order"
              >
                <MenuItem value="Next Up">Next Up</MenuItem>
                <MenuItem value="When I have time">When I have time</MenuItem>
                <MenuItem value="Someday">Someday</MenuItem>
              </Select>
            </FormControl>
            <FormControl 
              fullWidth 
              margin="normal"
              error={!!errors.genreName}
              required
            >
              <InputLabel>Genre</InputLabel>
              <Select
                name="genreName"
                value={newMovie.genreName}
                onChange={handleSelectChange}
                label="Genre"
              >
                {GENRES.map((genre) => (
                  <MenuItem key={genre} value={genre}>
                    {genre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Add Movie
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default AddMovieModal;
