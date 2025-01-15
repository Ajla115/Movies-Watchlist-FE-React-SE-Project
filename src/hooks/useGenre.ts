import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllCategories,
  createCategory,
  suggestGenre,
} from "../api/genreApi";
import { toast } from "react-toastify";

export const useGetAllCategories = () => {
  const query = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });
  if (query.error) {
    toast.error("Failed to fetch categories.");
  }

  return query;
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category added successfully!");
    },
    onError: () => {
      toast.error("Failed to add category.");
    },
  });
};

export const useSuggestGenre = () => {
  return useMutation({
    mutationFn: suggestGenre,
    onSuccess: (data: string) => {
      if (data.startsWith("Error:")) {
        toast.error(data);
      } else {
        toast.success(`AI recommended this genre: ${data}`, {
          autoClose: 5000,
        });
      }
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong, please try again later."
      );
    },
  });
};
