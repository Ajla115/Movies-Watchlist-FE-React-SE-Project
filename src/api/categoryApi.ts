import axios from 'axios';
import { Genre } from '../types/Genre';
import { API_BASE_URLS } from '../constants';

const API_URL = API_BASE_URLS.GENRES;

export const getAllCategories = async (): Promise<{ id: number; name: string }[]> => {
    const response = await axios.get(`${API_URL}`);
    return response.data;
};


export const createCategory = async (categoryName: string): Promise<Genre> => {
    const response = await axios.post(`${API_URL}/create`, categoryName, {
        headers: {
            'Content-Type': 'text/plain',
        },
    });
    return response.data;
};


export const suggestGenre = async (title: string): Promise<string> => {
    try {
      const response = await axios.get(`${API_URL}/suggest/${title}`);
      console.log("Response from OpenAI:", response.data);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 500) {
        throw new Error('Open AI API is overwhelmed at the moment, try later.');
      }
      throw new Error('Open AI API is overwhelmed at the moment, try later.');
    }
  };