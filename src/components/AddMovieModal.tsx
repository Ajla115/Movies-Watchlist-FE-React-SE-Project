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
  Box,
} from '@mui/material';
import { toast } from 'react-toastify'; 
import { AddMovieDTO } from '../types/Movie';
import { suggestGenre } from '../api/categoryApi'; 

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

  const handleAISuggestion = async () => {
    if (!newMovie.title.trim()) {
      toast.error('Please fill in the movie title before using AI suggestion!');
      return;
    }
  
    try {
      const suggestedGenre = await suggestGenre(newMovie.title);
  
      if (suggestedGenre.startsWith("Error:")) {
        toast.error(suggestedGenre);
      } else {
        toast.success(`AI recommended this genre: ${suggestedGenre}`, {
          autoClose: 5000, 
        });
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong, please try again later.');
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
  onClick={handleOpen}
  sx={{
    backgroundColor: "#52B788", 
    color: "#FFFFFF", 
    "&:hover": {
      backgroundColor: "#2D6A4F", 
    },
  }}
>
  Add Movie Modal
</Button>

<Dialog
  open={open}
  onClose={handleClose}
  maxWidth="sm"
  fullWidth
  sx={{
    "& .MuiPaper-root": {
      backgroundColor: "#FFFFFF", 
      border: "2px solid #2D6A4F", 
      borderRadius: "8px",
    },
  }}
>
  <DialogTitle
    sx={{
      fontWeight: 900,
      color: "#2D6A4F", 
      textAlign: "center",
    }}
  >
    ADD NEW MOVIE
  </DialogTitle>
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
        placeholder='Enter movie title'
        required
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#2D6A4F", 
            },
            "&:hover fieldset": {
              borderColor: "#2D6A4F",
            },
          },
        }}
      />
      <Box
    sx={{
      display: "flex",
      justifyContent: "center", 
      marginBottom: "2px", 
    }}
  >
    <Button
      variant="contained"
      onClick={handleAISuggestion}
      sx={{
        backgroundColor: "#52B788", 
        color: "#FFFFFF", 
        "&:hover": {
          backgroundColor: "#2D6A4F", 
        },
      }}
    >
      Let AI Suggest Genre for You
    </Button>
  </Box>
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
        placeholder='Enter movie description'
        required
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#2D6A4F", 
            },
            "&:hover fieldset": {
              borderColor: "#2D6A4F",
            },
          },
        }}
      />
      <FormControl fullWidth margin="normal" required>
        <InputLabel htmlFor="watchlist-order-select">Watch Order</InputLabel>
        <Select
        id="watchlist-order-select" 
          name="watchlistOrder"
          value={newMovie.watchlistOrder}
          onChange={handleSelectChange}
          label="Watch Order"
          placeholder='Select watch order'
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#2D6A4F",
              },
              "&:hover fieldset": {
                borderColor: "#2D6A4F",
              },
            },
          }}
        >
          <MenuItem
            value="Next Up"
            role="value"
            sx={{
              "&:hover": {
                backgroundColor: "#E9F5EC", 
              },
            }}
          >
            Next Up
          </MenuItem>
          <MenuItem
          role="value"
            value="When I have time"
            sx={{
              "&:hover": {
                backgroundColor: "#E9F5EC",
              },
            }}
          >
            When I have time
          </MenuItem>
          <MenuItem
          role="value"
            value="Someday"
            sx={{
              "&:hover": {
                backgroundColor: "#E9F5EC",
              },
            }}
          >
            Someday
          </MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal" required>
        <InputLabel htmlFor="genre-select">Genre</InputLabel>
        <Select
         id="genre-select"
          name="genreName"
          value={newMovie.genreName}
          onChange={handleSelectChange}
          label="Genre"
          placeholder='Select genre'
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#2D6A4F",
              },
              "&:hover fieldset": {
                borderColor: "#2D6A4F",
              },
            },
          }}
        >
          {GENRES.map((genre) => (
            <MenuItem
              key={genre}
              value={genre}
              role="value1"
              sx={{
                "&:hover": {
                  backgroundColor: "#E9F5EC", 
                },
              }}
            >
              {genre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </DialogContent>
    <DialogActions>
      <Button
        onClick={handleClose}
        sx={{
          backgroundColor: "#F8D7DA", 
          color: "#D32F2F", 
          "&:hover": {
            backgroundColor: "#D32F2F", 
            color: "#FFFFFF",
          },
        }}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        sx={{
          backgroundColor: "#52B788", 
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "#2D6A4F", 
          },
        }}
      >
        Add Movie
      </Button>
    </DialogActions>
  </form>
</Dialog>

</>
  );
};

export default AddMovieModal; 
