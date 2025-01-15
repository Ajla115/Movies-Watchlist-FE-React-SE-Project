import React, { useState } from "react";
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
  Typography,
} from "@mui/material";
import { WatchlistGroup } from "../types/WatchlistGroup";
import { toast } from "react-toastify";

interface EditCategoryModalProps {
  open: boolean;
  onClose: () => void;
  categories: WatchlistGroup[];
  onEditCategory: (groupId: number, newName: string) => void;
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  open,
  onClose,
  categories,
  onEditCategory,
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "">("");
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCategoryId || !newCategoryName.trim()) {
      toast.error("Both fields are required.");
      return;
    }

    onEditCategory(selectedCategoryId as number, newCategoryName.trim());
    setSelectedCategoryId("");
    setNewCategoryName("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          fontWeight: 900,
          color: "#2D6A4F",
          textAlign: "center",
        }}
      >
        EDIT CATEGORY
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel id="select-category-label">Select Category</InputLabel>
            <Select
              labelId="select-category-label"
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            margin="normal"
            label="New Category Name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Enter new category name"
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
            Save Changes
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditCategoryModal;
