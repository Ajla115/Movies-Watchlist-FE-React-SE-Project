import axios from "axios";
import { useQuery, useMutation, useQueryClient,  UseMutationResult, UseMutationOptions } from "@tanstack/react-query";
import { WatchlistGroup } from "../types/WatchlistGroup";
import { API_BASE_URL } from '../constants';
import { Movie} from "../types/Movie";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";

export const getAllWatchlistGroups = async (): Promise<WatchlistGroup[]> => {
  const response = await axios.get(`${API_BASE_URL}/watchlists/get-all`);
  return response.data;
};

export const getMoviesByCategory = async (userId: string, groupId: string): Promise<Movie[]> => {
  const response = await fetch(`${API_BASE_URL}/watchlists/movies-by-group/${userId}/${groupId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch movies by category");
  }
  return response.json();
};


export const addWatchlistGroup = async (categoryName: string): Promise<WatchlistGroup> => {
  try {
      const response = await axios.post(`${API_BASE_URL}/watchlists/add-directly`, null, {
          params: { name: categoryName }, 
        });
    toast.success(`Category "${response.data.name}" added successfully!`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 409) {
      toast.error("A category with this name already exists.");
      throw new Error("A category with this name already exists.");
    } else {
      toast.error("Failed to add category. Please try again.");
      throw new Error(error.message || "Failed to add category.");
    }
  }
};

export const deleteWatchlistGroup = async (groupId: number, deleteMovies: boolean): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/watchlists/delete/${groupId}`, {
      params: { deleteMovies },
    });
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("Category not found");
      }
      throw new Error(error.response?.data?.message || "Failed to delete category");
    }
    throw error;
  }
};


export const editWatchlistGroup = async (groupId: number, newName: string): Promise<void> => {
  try {
    await axios.put(`${API_BASE_URL}/watchlists/edit/${groupId}`, null, {
      params: { newName },
    });
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("Category not found");
      }
      throw new Error(error.response?.data?.message || "Failed to rename category");
    }
    throw error;
  }
};


export const createOrGetWatchlistGroup = async (name: string): Promise<WatchlistGroup> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/watchlists/add-indirectly`, null, {
      params: { name },
    });
    return response.data;
  } catch (error: any) {
    toast.error("Failed to create or get category. Please try again.");
    throw error;
  }
};