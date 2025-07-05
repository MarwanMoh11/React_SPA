import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { fetchRecipes, fetchRecipeImage } from '../api/recipeApi.ts';
import type { Recipe } from '../types/Recipe';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
    CircularProgress,
    useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// --- Recipe Card ---
const RecipeCard = ({ recipe, onClick }: { recipe: Recipe; onClick: () => void }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        fetchRecipeImage(recipe.title).then(setImageUrl);
    }, [recipe.title]);

    return (
        <div
            onClick={onClick}
            className="bg-white dark:bg-neutral-800 rounded-xl shadow hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden group ring-1 ring-neutral-200 dark:ring-neutral-700 hover:ring-green-500 dark:hover:ring-green-400"
        >
            <div className="aspect-[16/9] w-full bg-neutral-100 dark:bg-neutral-700 overflow-hidden">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={recipe.title}
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full">
                        <CircularProgress size={24} />
                    </div>
                )}
            </div>

            <div className="p-4">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white capitalize truncate group-hover:text-green-700 dark:group-hover:text-green-300">
                    {recipe.title}
                </h3>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                    {recipe.body.substring(0, 70)}...
                </p>
            </div>
        </div>
    );
};

// --- Main Page ---
export const TailwindPage = () => {
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const theme = useTheme();

    const { data: recipes, error, isLoading } = useQuery<Recipe[], Error>({
        queryKey: ['recipes'],
        queryFn: fetchRecipes,
    });

    return (
        <div className="bg-neutral-50 dark:bg-neutral-900 min-h-screen">
            {/* Hero */}
            <div className="text-center py-16 px-4 bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900 dark:to-green-800 border-b border-green-200 dark:border-green-700 shadow-sm">
                <h1 className="text-4xl md:text-5xl font-bold text-green-800 dark:text-green-200">
                    Find Your Next Healthy Meal
                </h1>
                <p className="mt-4 text-lg text-green-700 dark:text-green-300 max-w-2xl mx-auto">
                    Discover delicious recipes with full nutrition info — helping you hit your goals.
                </p>
            </div>

            {/* Grid Section */}
            <div className="container mx-auto px-4 py-12">
                <h2 className="text-3xl font-bold text-center text-neutral-900 dark:text-neutral-100 mb-10">
                    Featured Recipes
                </h2>

                {isLoading && (
                    <div className="text-center mt-12">
                        <CircularProgress />
                    </div>
                )}

                {error && (
                    <p className="text-center text-red-500 mt-4">Error fetching recipes: {error.message}</p>
                )}

                {recipes && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {recipes.map((recipe) => (
                            <RecipeCard
                                key={recipe.id}
                                recipe={recipe}
                                onClick={() => setSelectedRecipe(recipe)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            <Dialog
                open={!!selectedRecipe}
                onClose={() => setSelectedRecipe(null)}
                fullWidth
                maxWidth="md"
                slotProps={{
                    paper: {
                        sx: {
                            bgcolor: theme.palette.mode === 'dark' ? 'background.default' : 'background.paper',
                            color: theme.palette.mode === 'dark' ? 'grey.100' : 'text.primary',
                            borderRadius: 2,
                            boxShadow: theme.shadows[5],
                        },
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        m: 0,
                        p: 2,
                        textTransform: 'capitalize',
                        bgcolor:
                            theme.palette.mode === 'dark' ? 'grey.900' : 'background.paper',
                        color: theme.palette.mode === 'dark' ? 'grey.100' : 'text.primary',
                    }}
                >
                    {selectedRecipe?.title}
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={() => setSelectedRecipe(null)}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent
                    dividers
                    sx={{
                        bgcolor:
                            theme.palette.mode === 'dark' ? 'grey.800' : 'background.paper',
                        color: theme.palette.mode === 'dark' ? 'grey.100' : 'text.primary',
                    }}
                >
                    <Typography gutterBottom variant="h6">
                        Instructions:
                    </Typography>
                    <Typography variant="body1">{selectedRecipe?.body}</Typography>
                </DialogContent>
            </Dialog>
        </div>
    );
};
