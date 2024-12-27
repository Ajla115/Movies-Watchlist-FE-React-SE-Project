// categoryApi.ts (API Calls for Category Suggestions)
import axios from 'axios';
import { Genre } from '../types/Genre';

const CATEGORY_API_BASE_URL = 'http://localhost:8080/api/category';

export const getAllCategories = async (): Promise<{ id: number; name: string }[]> => {
    const response = await axios.get(`${CATEGORY_API_BASE_URL}/`);
    return response.data;
};

export const getCategorySuggestion = async (taskDescription: string): Promise<string> => {
    const response = await axios.get(`${CATEGORY_API_BASE_URL}/suggest/${encodeURIComponent(taskDescription)}`);
    return response.data;
};

export const createCategory = async (categoryName: string): Promise<Genre> => {
    const response = await axios.post(`${CATEGORY_API_BASE_URL}/create`, categoryName, {
        headers: {
            'Content-Type': 'text/plain',
        },
    });
    return response.data;
};