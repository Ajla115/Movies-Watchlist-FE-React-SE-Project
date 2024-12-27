import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { Movie } from "../types/Movie";

interface ConfirmWatchModalProps {
  open: boolean;
  onClose: () => void;
  movie: Movie;
  onConfirm: () => void;
}

const ConfirmWatchModal: React.FC<ConfirmWatchModalProps> = ({
  open,
  onClose,
  movie,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Watching</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you have watched "{movie.title}"?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color="primary" variant="contained">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmWatchModal;
