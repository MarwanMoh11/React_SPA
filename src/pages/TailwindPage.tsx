import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetchRecipes, fetchRecipeImage } from '../api/recipeApi';
import type { Recipe } from '../types/Recipe';
import { useAuth } from '../contexts/AuthContext';
import { recipeImageCache as imageCache } from '../utils/imageCache';


const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// Removed modal variants as we now navigate to a details page

const RecipeCard = ({ recipe, onClick }: { recipe: Recipe; onClick: () => void }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        const title = recipe.title;
        if (imageCache.has(title)) {
            setImageUrl(imageCache.get(title)!);
        } else {
            fetchRecipeImage(title).then((url) => {
                if (isMounted.current) {
                    imageCache.set(title, url);
                    setImageUrl(url);
                }
            });
        }
        return () => {
            isMounted.current = false;
        };
    }, [recipe.title]);

    return (
        <motion.div
            layoutId={`card-container-${recipe.id}`}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="bg-white dark:bg-neutral-800 rounded-xl shadow hover:shadow-lg transition-shadow duration-200 cursor-pointer overflow-hidden group ring-1 ring-neutral-200 dark:ring-neutral-700 hover:ring-green-500 dark:hover:ring-green-400"
        >
            <motion.div layoutId={`image-${recipe.id}`}>
                <div className="aspect-[16/9] bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center overflow-hidden">
                    {imageUrl ? (
                        <motion.img
                            src={imageUrl}
                            alt={recipe.title}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                        />
                    ) : (
                        <CircularProgress size={24} />
                    )}
                </div>
            </motion.div>
            <div className="p-4">
                <motion.h3
                    layoutId={`title-${recipe.id}`}
                    className="text-xl md:text-lg font-semibold text-neutral-900 dark:text-white capitalize truncate group-hover:text-green-700 dark:group-hover:text-green-300"
                >
                    {recipe.title}
                </motion.h3>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                    {recipe.body.substring(0, 70)}...
                </p>
            </div>
        </motion.div>
    );
};

export const TailwindPage = () => {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const { data: recipes, error, isLoading } = useQuery<Recipe[], Error>({
        queryKey: ['recipes', user?.uid ?? 'guest'],
        queryFn: fetchRecipes,
        enabled: !authLoading && !!user,
    });

    return (
        <div className="bg-neutral-50 dark:bg-neutral-900 min-h-screen">
            <div className="w-full text-center py-12 md:py-16 px-4 bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900 dark:to-green-800 border-b border-green-200 dark:border-green-700 shadow-sm">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-800 dark:text-green-200">
                    Find Your Next Healthy Meal
                </h1>
                <p className="mt-3 sm:mt-4 text-base sm:text-lg text-green-700 dark:text-green-300 max-w-2xl mx-auto">
                    Discover delicious recipes with full nutrition info — helping you hit your goals.
                </p>
            </div>

            <div className="container mx-auto px-4 py-12">
                <h2 className="text-3xl font-bold text-center text-neutral-900 dark:text-neutral-100 mb-10">
                    Featured Recipes
                </h2>

                {isLoading && (
                    <div className="mt-12">
                        <div className="text-center mb-6">
                            <CircularProgress data-testid="main-loader" />
                        </div>
                        {/* Skeleton grid for better perceived performance */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {Array.from({ length: 8 }).map((_, idx) => (
                                <div
                                    key={idx}
                                    className="rounded-xl overflow-hidden ring-1 ring-neutral-200 dark:ring-neutral-700 bg-white dark:bg-neutral-800"
                                >
                                    <div className="aspect-[16/9] bg-neutral-100 dark:bg-neutral-700 animate-pulse" />
                                    <div className="p-4 space-y-2">
                                        <div className="h-5 bg-neutral-200 dark:bg-neutral-600 rounded w-2/3 animate-pulse" />
                                        <div className="h-4 bg-neutral-200 dark:bg-neutral-600 rounded w-full animate-pulse" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {error && (
                    <Alert severity="error" sx={{ mt: 4 }}>
                        Error fetching recipes: {error.message}
                    </Alert>
                )}
                {recipes && recipes.length === 0 && !isLoading && !error && (
                    <div className="text-center mt-16">
                        <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-4">
                            No recipes yet. Get started by adding your first recipe!
                        </p>
                        <a
                            href="/dashboard"
                            className="inline-block px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                        >
                            Open Recipe Dashboard
                        </a>
                    </div>
                )}
                {recipes && recipes.length > 0 && (
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
                        }}
                    >
                        {recipes.map((r) => (
                            <RecipeCard key={r.id} recipe={r} onClick={() => navigate(`/recipes/${r.id}`)} />
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};
