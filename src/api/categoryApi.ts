import axios from 'axios';
import { Genre } from '../types/Genre';
import { API_BASE_URL } from '../constants';


export const getAllCategories = async (): Promise<{ id: number; name: string }[]> => {
    const response = await axios.get(`${API_BASE_URL}/genres`);
    return response.data;
};


export const createCategory = async (categoryName: string): Promise<Genre> => {
    const response = await axios.post(`${API_BASE_URL}/genres/create`, categoryName, {
        headers: {
            'Content-Type': 'text/plain',
        },
    });
    return response.data;
};


export const suggestGenre = async (title: string): Promise<string> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/genres/suggest/${title}`);
      console.log("Response from OpenAI:", response.data);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 500) {
        throw new Error('Open AI API is overwhelmed at the moment, try later.');
      }
      throw new Error('Open AI API is overwhelmed at the moment, try later.');
    }
  };