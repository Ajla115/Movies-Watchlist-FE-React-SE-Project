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
import AddIcon from '@mui/icons-material/Add';
import { toast } from 'react-toastify'; // Import Toastify
import { AddMovieDTO } from '../types/Movie';
import { suggestGenre } from '../api/categoryApi'; // Import the API hook

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
  
      // Check if the response is an actual genre name or an error message
      if (suggestedGenre.startsWith("Error:")) {
        // Display error message in red toastr
        toast.error(suggestedGenre);
      } else {
        // Display the suggested genre in green toastr
        toast.success(`AI recommended this genre: ${suggestedGenre}`, {
          autoClose: 5000, // Longer duration for success toastr
        });
      }
    } catch (error: any) {
      // Handle errors from the API call
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
    backgroundColor: "#52B788", // Medium green
    color: "#FFFFFF", // White text
    "&:hover": {
      backgroundColor: "#2D6A4F", // Dark green on hover
    },
  }}
>
  Add Movie
</Button>

<Dialog
  open={open}
  onClose={handleClose}
  maxWidth="sm"
  fullWidth
  sx={{
    "& .MuiPaper-root": {
      backgroundColor: "#FFFFFF", // White background
      border: "2px solid #2D6A4F", // Dark green border
      borderRadius: "8px",
    },
  }}
>
  <DialogTitle
    sx={{
      fontWeight: 900,
      color: "#2D6A4F", // Dark green color
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
        required
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#2D6A4F", // Dark green border
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
      justifyContent: "center", // Centers the button horizontally
      marginBottom: "2px", // Adds spacing below the button
    }}
  >
    <Button
      variant="contained"
      onClick={handleAISuggestion}
      sx={{
        backgroundColor: "#52B788", // Medium green
        color: "#FFFFFF", // White text
        "&:hover": {
          backgroundColor: "#2D6A4F", // Dark green on hover
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
        required
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#2D6A4F", // Dark green border
            },
            "&:hover fieldset": {
              borderColor: "#2D6A4F",
            },
          },
        }}
      />
      <FormControl fullWidth margin="normal" required>
        <InputLabel>Watch Order</InputLabel>
        <Select
          name="watchlistOrder"
          value={newMovie.watchlistOrder}
          onChange={handleSelectChange}
          label="Watch Order"
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
            sx={{
              "&:hover": {
                backgroundColor: "#E9F5EC", // Light green hover
              },
            }}
          >
            Next Up
          </MenuItem>
          <MenuItem
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
        <InputLabel>Genre</InputLabel>
        <Select
          name="genreName"
          value={newMovie.genreName}
          onChange={handleSelectChange}
          label="Genre"
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
              sx={{
                "&:hover": {
                  backgroundColor: "#E9F5EC", // Light green hover
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
          backgroundColor: "#F8D7DA", // Light red
          color: "#D32F2F", // Red text
          "&:hover": {
            backgroundColor: "#D32F2F", // Dark red on hover
            color: "#FFFFFF",
          },
        }}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        sx={{
          backgroundColor: "#52B788", // Medium green
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "#2D6A4F", // Dark green on hover
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
