import type { Recipe } from '../types/Recipe';
import { fetchRecipes as fetchFromService } from '../services/recipesService';

// Fetch recipes via the service (Firestore in app, JSONPlaceholder in tests)
export const fetchRecipes = async (): Promise<Recipe[]> => {
  return fetchFromService();
};

// New function to fetch an image for a single recipe title
export const fetchRecipeImage = async (recipeTitle: string): Promise<string> => {
  const searchTerm = recipeTitle.split(' ')[0].toLowerCase();
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
    if (!response.ok) throw new Error('Image fetch failed');
    const data = await response.json();
    return data.meals?.[0]?.strMealThumb || `https://placehold.co/600/475569/ffffff?text=Not+Found`;
  } catch (error) {
    console.error('Failed to fetch image:', error);
    return `https://placehold.co/600/d32f2f/ffffff?text=Error`;
  }
};