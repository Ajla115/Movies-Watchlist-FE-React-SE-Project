import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";

interface AddCategoryModalProps {
  open: boolean;
  onClose: () => void;
  onAddCategory: (categoryName: string) => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ open, onClose, onAddCategory }) => {
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState<string | null>(null); // Error state for empty input

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      setError("Category name cannot be empty."); // Set error if input is empty
      toast.error("Category name cannot be empty."); // Show toast error message
      return;
    }
    onAddCategory(categoryName);
    setCategoryName(""); // Clear input field
    setError(null); // Clear error state
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryName(e.target.value);
    if (error) {
      setError(null); // Clear error if user starts typing
    }
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
        ADD NEW CATEGORY
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <TextField
            fullWidth
            margin="normal"
            label="Category Name"
            value={categoryName}
            onChange={handleInputChange}
            placeholder="Enter category name"
            error={!!error}
            helperText={error}
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
            Add
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddCategoryModal;
