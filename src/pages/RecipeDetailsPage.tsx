// src/pages/RecipeDetailsPage.tsx
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { CircularProgress, Typography, Alert, Button } from '@mui/material';
import { motion, useScroll, useTransform } from 'framer-motion';
import { fetchRecipes, fetchRecipeImage } from '../api/recipeApi';
import type { Recipe } from '../types/Recipe';
import { useAuth } from '../contexts/AuthContext';
import { recipeImageCache as imageCache } from '../utils/imageCache';

export default function RecipeDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const numericId = Number(id);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ container: contentRef });
  const imageOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const { user, loading: authLoading } = useAuth();
  const { data: recipes, error, isLoading } = useQuery<Recipe[], Error>({
    queryKey: ['recipes', user?.uid ?? 'guest'],
    queryFn: fetchRecipes,
    enabled: !authLoading && !!user,
  });

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const recipe = recipes?.find((r) => Number(r.id) === numericId) || null;

  useEffect(() => {
    if (!recipe) return;
    const isMounted = { current: true };
    const title = recipe.title;
    if (imageCache.has(title)) {
      setImageUrl(imageCache.get(title)!);
    } else {
      fetchRecipeImage(title).then((url) => {
        if (!isMounted.current) return;
        imageCache.set(title, url);
        setImageUrl(url);
      });
    }
    return () => { isMounted.current = false; };
  }, [recipe]);

  return (
    <div className="bg-neutral-50 dark:bg-neutral-900 min-h-screen">
      <div className="w-full text-center py-10 px-4 bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900 dark:to-green-800 border-b border-green-200 dark:border-green-700 shadow-sm">
        <h1 className="text-3xl md:text-4xl font-bold text-green-800 dark:text-green-200">Recipe Details</h1>
        <p className="mt-2 text-green-700 dark:text-green-300">Full details for a selected recipe</p>
        <div className="mt-4">
          <Button component={Link} to="/" variant="outlined" color="success">
            ← Back to Recipes
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {isLoading && (
          <div className="text-center" role="status">
            <CircularProgress />
          </div>
        )}
        {error && (
          <Alert severity="error">Error fetching recipes: {error.message}</Alert>
        )}
        {!isLoading && !error && !recipe && (
          <Alert severity="warning">Recipe not found.</Alert>
        )}
        {recipe && (
          <div className="rounded-xl overflow-hidden ring-1 ring-neutral-200 dark:ring-neutral-700 bg-white dark:bg-neutral-800">
            <motion.div style={{ opacity: imageOpacity }}>
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={recipe.title}
                  className="w-full h-auto max-h-[50vh] sm:max-h-[420px] object-cover"
                />
              ) : (
                <div className="flex items-center justify-center aspect-[16/9] bg-neutral-100 dark:bg-neutral-700">
                  <CircularProgress />
                </div>
              )}
            </motion.div>

            <div className="p-4 md:p-6" ref={contentRef}>
              <Typography variant="h4" className="capitalize font-bold">
                {recipe.title}
              </Typography>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
                <div className="lg:col-span-2 space-y-4">
                  <Typography variant="h6" className="font-semibold">Overview</Typography>
                  <div className="flex flex-wrap gap-2">
                    {recipe.servings ? (
                      <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Servings: {recipe.servings}</span>
                    ) : null}
                    {recipe.prepTime ? (
                      <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Prep: {recipe.prepTime}m</span>
                    ) : null}
                    {recipe.cookTime ? (
                      <span className="px-3 py-1 rounded-full text-sm bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">Cook: {recipe.cookTime}m</span>
                    ) : null}
                    {recipe.difficulty ? (
                      <span className="px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">{recipe.difficulty}</span>
                    ) : null}
                  </div>

                  {recipe.ingredients && recipe.ingredients.length > 0 && (
                    <div className="mt-4">
                      <Typography variant="h6" className="font-semibold">Ingredients</Typography>
                      <ul className="list-disc pl-6 mt-2 space-y-1 text-[1.05rem] sm:text-base">
                        {recipe.ingredients.map((ing, idx) => (
                          <li key={idx}>{ing}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-4">
                    <Typography variant="h6" className="font-semibold">Instructions</Typography>
                    <Typography variant="body1" className="whitespace-pre-wrap mt-2 text-[1.1rem] leading-7 sm:text-base sm:leading-7">
                      {recipe.instructions || recipe.body}
                    </Typography>
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <div className="rounded-xl ring-1 ring-neutral-200 dark:ring-neutral-700 p-4">
                    <Typography variant="h6" className="font-semibold">Nutrition</Typography>
                    {recipe.nutrition ? (
                      <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
                        <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 p-3">
                          <div className="text-neutral-500 dark:text-neutral-400">Calories</div>
                          <div className="text-neutral-900 dark:text-neutral-100 font-semibold text-[1.05rem]">{recipe.nutrition.calories ?? '—'} kcal</div>
                        </div>
                        <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 p-3">
                          <div className="text-neutral-500 dark:text-neutral-400">Protein</div>
                          <div className="text-neutral-900 dark:text-neutral-100 font-semibold text-[1.05rem]">{recipe.nutrition.protein ?? '—'} g</div>
                        </div>
                        <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 p-3">
                          <div className="text-neutral-500 dark:text-neutral-400">Carbs</div>
                          <div className="text-neutral-900 dark:text-neutral-100 font-semibold text-[1.05rem]">{recipe.nutrition.carbs ?? '—'} g</div>
                        </div>
                        <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 p-3">
                          <div className="text-neutral-500 dark:text-neutral-400">Fat</div>
                          <div className="text-neutral-900 dark:text-neutral-100 font-semibold text-[1.05rem]">{recipe.nutrition.fat ?? '—'} g</div>
                        </div>
                      </div>
                    ) : (
                      <Typography variant="body2" className="text-neutral-500 dark:text-neutral-400 mt-2">No nutrition info yet.</Typography>
                    )}

                    <div className="mt-4">
                      <Typography variant="body2" className="text-neutral-500 dark:text-neutral-400">Details</Typography>
                      <Typography variant="body2" className="text-neutral-700 dark:text-neutral-200">{recipe.body}</Typography>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
