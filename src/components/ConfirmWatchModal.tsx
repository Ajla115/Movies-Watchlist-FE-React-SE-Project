import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { Movie } from "../types/Movie";


interface ConfirmWatchModalProps {
  open: boolean;
  onClose: () => void;
  movie: Movie;
  onConfirm: () => void;
}

const ConfirmWatchModal: React.FC<ConfirmWatchModalProps> = ({ open, onClose, movie, onConfirm }) => {
  
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{
        color: "#2D6A4F",
        fontWeight: "bold",
        textTransform: "uppercase",
        fontSize: "1.5rem",
      }}>MARK AS WATCHED</DialogTitle>
      <DialogContent>
        Are you sure you want to mark "{movie.title}" as watched? This action cannot be undone.
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error" variant="contained">Cancel</Button>
        <Button onClick={onConfirm} color="primary" variant="contained">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmWatchModal;
