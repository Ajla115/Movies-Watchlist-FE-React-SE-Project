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
  Typography,
  Box
} from '@mui/material';
import { AddMovieDTO } from '../types/Movie';
import { WatchlistGroup } from '../types/WatchlistGroup';

interface EditMovieDTO extends AddMovieDTO {
  movieId: number; // Added movieId to EditMovieDTO
}

interface EditMovieModalProps {
  open: boolean;
  movie: EditMovieDTO; // Changed to EditMovieDTO
  categories: WatchlistGroup[];
  onClose: () => void;
  onSave: (movieId: number, movie: AddMovieDTO) => void;
}

interface ValidationErrors {
  title?: string;
  description?: string;
  genreName?: string;
  watchlistOrder?: string;
  category?: string; // Added category error
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
  categories, // Receiving categories prop
  onClose,
  onSave,
}) => {
  // Initialize editedMovie using AddMovieDTO format
  const [editedMovie, setEditedMovie] = useState<AddMovieDTO>({
    title: movie.title,
    description: movie.description,
    status: movie.status,
    watchlistOrder: movie.watchlistOrder,
    genreName: movie.genreName,
    watchlistGroupNames: movie.watchlistGroupNames
  });



  const [newCategory, setNewCategory] = useState<string>(''); // State for new category name
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Set selectedCategories based on the categories the movie belongs to
const [selectedCategories, setSelectedCategories] = useState<string[]>(
  movie.watchlistGroupNames ? [...movie.watchlistGroupNames] : [] // Default to an empty array if null/undefined
);

useEffect(() => {
  // Reset state when movie prop changes
  setEditedMovie({
    title: movie.title,
    description: movie.description,
    status: movie.status,
    watchlistOrder: movie.watchlistOrder,
    genreName: movie.genreName,
    watchlistGroupNames: movie.watchlistGroupNames || [], // Ensure it's always an array
  });

  setSelectedCategories(movie.watchlistGroupNames ? [...movie.watchlistGroupNames] : []);
  setNewCategory('');
  setErrors({});
  setHasChanges(false);
}, [movie, categories]);


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

    if (!editedMovie.genreName) {
      newErrors.genreName = 'Genre is required';
      isValid = false;
    }

    if (!editedMovie.watchlistOrder) {
      newErrors.watchlistOrder = 'Watch order is required';
      isValid = false;
    }

    if (selectedCategories.length === 0 && !newCategory.trim()) {
      newErrors.category = 'At least one category must be selected or created';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // const checkForChanges = (updatedMovie: AddMovieDTO) => {
  //   const isCategoryChanged =
  //     selectedCategories.sort().toString() !== movie.watchlistGroupNames.sort().toString() ||
  //     newCategory.trim() !== '';

  //   return (
  //     updatedMovie.title !== movie.title ||
  //     updatedMovie.description !== movie.description ||
  //     updatedMovie.genreName !== movie.genreName ||
  //     updatedMovie.watchlistOrder !== movie.watchlistOrder ||
  //     isCategoryChanged
  //   );
  // };

  const checkForChanges = (updatedMovie: AddMovieDTO) => {
    const initialCategories = movie.watchlistGroupNames || [];
    const isCategoryChanged =
      selectedCategories.length !== initialCategories.length ||
      selectedCategories.some((category) => !initialCategories.includes(category)) ||
      initialCategories.some((category) => !selectedCategories.includes(category));
  
    return (
      updatedMovie.title !== movie.title ||
      updatedMovie.description !== movie.description ||
      updatedMovie.genreName !== movie.genreName ||
      updatedMovie.watchlistOrder !== movie.watchlistOrder ||
      isCategoryChanged ||
      newCategory.trim() !== ''
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
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;

    setEditedMovie((prev) => {
      let updated;
      if (name === 'genreName') {
        updated = {
          ...prev,
          genreName: value,
        };
      } else if (name === 'watchlistOrder') {
        updated = {
          ...prev,
          watchlistOrder: value,
        };
      } else {
        updated = prev;
      }
      return updated;
    });

    setHasChanges(true);

    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleCategoryChange = (e: SelectChangeEvent<string[]>) => {
    const selectedValues = e.target.value as string[];
    setSelectedCategories(selectedValues);
  
    // Manually trigger checkForChanges after updating categories
    const updatedMovie = {
      ...editedMovie,
      watchlistGroupNames: selectedValues,
    };
    setHasChanges(checkForChanges(updatedMovie));
  
    if (errors.category) {
      setErrors((prev) => ({
        ...prev,
        category: undefined,
      }));
    }
  };
  
  
  

  const handleNewCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategory(e.target.value);
    setHasChanges(true);
    if (errors.category) {
      setErrors((prev) => ({
        ...prev,
        category: undefined,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const movieToSave: AddMovieDTO = {
        title: editedMovie.title,
        description: editedMovie.description,
        status: movie.status,
        watchlistOrder: editedMovie.watchlistOrder,
        genreName: editedMovie.genreName || '',
        watchlistGroupNames: [
          ...selectedCategories,
          ...(newCategory.trim() ? [newCategory.trim()] : []),
        ],
      };

      onSave(movie.movieId, movieToSave); // Using movieId from EditMovieDTO
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiPaper-root': {
          border: '2px solid #2D6A4F',
          borderRadius: '8px',
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 'bold',
          textTransform: 'uppercase',
          color: '#2D6A4F',
        }}
      >
        Edit Movie
      </DialogTitle>
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
              value={editedMovie.genreName || ''}
              onChange={handleSelectChange}
              label="Genre"
            >
              {GENRES.map((genre) => (
                <MenuItem
                  key={genre}
                  value={genre}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#E9F5EC',
                    },
                  }}
                >
                  {genre}
                </MenuItem>
              ))}
            </Select>
            {errors.genreName && (
              <FormHelperText>{errors.genreName}</FormHelperText>
            )}
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
                '&:hover': {
                  backgroundColor: '#E9F5EC',
                },
              }}>Next Up</MenuItem>
              <MenuItem value="When I have time" sx={{
                '&:hover': {
                  backgroundColor: '#E9F5EC',
                },
              }}>When I have time</MenuItem>
              <MenuItem value="Someday" sx={{
                '&:hover': {
                  backgroundColor: '#E9F5EC',
                },
              }}>Someday</MenuItem>
            </Select>
            {errors.watchlistOrder && <FormHelperText>{errors.watchlistOrder}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth margin="normal" error={!!errors.category}>
            <InputLabel>Select Category</InputLabel>
            <Select
              multiple
              value={selectedCategories}
              onChange={handleCategoryChange}
              renderValue={(selected) => selected.join(', ')}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.name}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
            {errors.category && (
              <FormHelperText>{errors.category}</FormHelperText>
            )}
          </FormControl>
          <Typography align="center" sx={{ my: 2 }}>
            OR
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="New Category"
            value={newCategory}
            onChange={handleNewCategoryChange}
            placeholder="Enter new category"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="error">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!hasChanges}
            color="primary"
          >
            Save Changes
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditMovieModal;
