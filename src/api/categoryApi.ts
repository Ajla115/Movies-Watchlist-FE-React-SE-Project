// categoryApi.ts (API Calls for Category Suggestions)
import axios from 'axios';
import { Genre } from '../types/Genre';

const API_BASE_URL = "http://localhost:8080/api/genres";

export const getAllCategories = async (): Promise<{ id: number; name: string }[]> => {
    const response = await axios.get(`${API_BASE_URL}/`);
    return response.data;
};


export const createCategory = async (categoryName: string): Promise<Genre> => {
    const response = await axios.post(`${API_BASE_URL}/create`, categoryName, {
        headers: {
            'Content-Type': 'text/plain',
        },
    });
    return response.data;
};

/**
 * Call to suggest a genre for a given movie title.
 * @param title - The title of the movie
 * @returns The suggested genre
 */
export const suggestGenre = async (title: string): Promise<string> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/suggest/${title}`);
      console.log("Response from OpenAI:", response.data);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 500) {
        throw new Error('Open AI API is overwhelmed at the moment, try later.');
      }
      throw new Error('Open AI API is overwhelmed at the moment, try later.');
    }
  };