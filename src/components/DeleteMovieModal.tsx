import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

interface DeleteMovieModalProps {
  open: boolean;
  movieTitle: string;
  onClose: () => void;
  onDelete: () => void;
}

const DeleteMovieModal: React.FC<DeleteMovieModalProps> = ({
  open,
  movieTitle,
  onClose,
  onDelete,
}) => {
  const handleDelete = () => {
    onDelete();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{
      color: "#2D6A4F", 
      fontWeight: "bold", 
      textTransform: "uppercase", 
      fontSize: "1.5rem", 
    }}>DELETE MOVIE</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete "{movieTitle}"? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleDelete} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteMovieModal;