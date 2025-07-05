// src/pages/TailwindPage.tsx

import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { fetchRecipes, fetchRecipeImage } from '../api/recipeApi';
import type {Recipe} from '../types/Recipe';
import { Dialog, DialogContent, DialogTitle, IconButton, Typography, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// --- Reusable Recipe Card Component ---
const RecipeCard = ({ recipe, onClick }: { recipe: Recipe; onClick: () => void }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        fetchRecipeImage(recipe.title).then(setImageUrl);
    }, [recipe.title]);

    return (
        <div
            // UPDATED: Added dark mode background and a subtle ring for better separation
            className="bg-white dark:bg-slate-800 rounded-lg shadow-lg dark:ring-1 dark:ring-slate-700 overflow-hidden transform hover:scale-105 transition-transform duration-300 cursor-pointer group"
            onClick={onClick}
        >
            {/* UPDATED: Added dark mode background for the image placeholder */}
            <div className="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-slate-700">
                {imageUrl ? (
                    <img src={imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <CircularProgress size={24} />
                    </div>
                )}
            </div>
            <div className="p-6">
                {/* UPDATED: Added dark mode text colors and dark mode hover color */}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white capitalize truncate group-hover:text-green-600 dark:group-hover:text-green-400">{recipe.title}</h3>
                {/* UPDATED: Added dark mode text color for the paragraph */}
                <p className="mt-2 text-gray-600 dark:text-slate-400 text-sm">{recipe.body.substring(0, 70)}...</p>
            </div>
        </div>
    );
};


// --- Main Tailwind Page Component ---
export const TailwindPage = () => {
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

    const { data: recipes, error, isLoading } = useQuery<Recipe[], Error>({
        queryKey: ['recipes'],
        queryFn: fetchRecipes,
    });

    return (
        // UPDATED: Added dark mode background for the entire page
        <div className="bg-gray-50 dark:bg-slate-900 min-h-screen">
            {/* Hero Section */}
            {/* UPDATED: Added dark mode background and text colors */}
            <div className="text-center py-16 px-4 bg-green-100 dark:bg-green-900/50">
                <h1 className="text-4xl md:text-5xl font-bold text-green-800 dark:text-green-300">Find Your Next Healthy Meal</h1>
                <p className="mt-4 text-lg text-green-700 dark:text-green-400">Delicious recipes with full nutritional info to help you meet your goals.</p>
            </div>

            {/* Featured Recipes Section */}
            <div className="container mx-auto px-4 py-12">
                {/* UPDATED: Added dark mode text color for the section title */}
                <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200 mb-8">Featured Recipes</h2>

                {isLoading && <div className="text-center"><CircularProgress /></div>}
                {error && <p className="text-center text-red-500">Error fetching recipes: {error.message}</p>}

                {recipes && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {recipes.map((recipe) => (
                            <RecipeCard key={recipe.id} recipe={recipe} onClick={() => setSelectedRecipe(recipe)} />
                        ))}
                    </div>
                )}
            </div>

            {/* Recipe Detail Modal (NOTE: This is an MUI component and will not be styled by Tailwind's dark mode) */}
            <Dialog open={!!selectedRecipe} onClose={() => setSelectedRecipe(null)} fullWidth maxWidth="md">
                <DialogTitle sx={{ m: 0, p: 2, textTransform: 'capitalize' }}>
                    {selectedRecipe?.title}
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={() => setSelectedRecipe(null)}
                    sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    <Typography gutterBottom variant="h6">Instructions:</Typography>
                    <Typography variant="body1">{selectedRecipe?.body}</Typography>
                </DialogContent>
            </Dialog>
        </div>
    );
};