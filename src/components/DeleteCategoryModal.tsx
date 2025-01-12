import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
} from "@mui/material";
import { WatchlistGroup } from "../types/WatchlistGroup";
import { toast } from "react-toastify";

interface DeleteCategoryModalProps {
  open: boolean;
  onClose: () => void;
  onDeleteCategory: (groupId: number, deleteMovies: boolean) => void;
  categories: WatchlistGroup[];
}

const DeleteCategoryModal: React.FC<DeleteCategoryModalProps> = ({
  open,
  onClose,
  onDeleteCategory,
  categories,
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "">( "");
  const [error, setError] = useState<string>("");

  const handleDelete = (deleteMovies: boolean) => {
    if (selectedCategoryId === "") {
      setError("Please select a category to delete.");
      return;
    }

    onDeleteCategory(selectedCategoryId as number, deleteMovies);
    onClose();
    setSelectedCategoryId(""); // Reset selection
    setError(""); // Clear error
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
        DELETE CATEGORY
      </DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal" error={!!error}>
          <InputLabel id="category-select-label">Select Category</InputLabel>
          <Select
            labelId="category-select-label"
            value={selectedCategoryId}
            onChange={(e) => {
              setSelectedCategoryId(e.target.value as number);
              setError(""); // Clear error on valid selection
            }}
            label="Select Category"
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
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </FormControl>

        <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, textAlign: "center" }}>
          Choose how you want to delete the category:
        </Typography>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            onClick={() => handleDelete(false)}
            variant="contained"
            sx={{
              backgroundColor: "#52B788",
              color: "#FFFFFF",
              "&:hover": {
                backgroundColor: "#2D6A4F",
              },
            }}
          >
            Delete Without Movies
          </Button>
          <Button
            onClick={() => handleDelete(true)}
            variant="contained"
            sx={{
              backgroundColor: "#D32F2F",
              color: "#FFFFFF",
              "&:hover": {
                backgroundColor: "#A00000",
              },
            }}
          >
            Delete With Movies
          </Button>
        </DialogActions>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
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
      </DialogActions>
    </Dialog>
  );
};

export default DeleteCategoryModal;
