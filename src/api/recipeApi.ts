// src/api/recipeApi.ts
import type {Recipe} from '../types/Recipe';

const API_URL = 'https://jsonplaceholder.typicode.com/posts';

export const fetchRecipes = async (): Promise<Recipe[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    // Let's use a consistent slice of data across the app
    return data.slice(0, 12);
};