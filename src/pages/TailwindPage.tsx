import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, useRef, forwardRef } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
    CircularProgress,
    useTheme,
    Paper,
    type PaperProps,
    Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { fetchRecipes, fetchRecipeImage } from '../api/recipeApi';
import type { Recipe } from '../types/Recipe';

const MotionPaper = motion(
    forwardRef<HTMLDivElement, Omit<PaperProps, 'onAnimationStart' | 'onAnimationEnd'>>(
        function MotionPaper(props, ref) {
            return <Paper ref={ref} {...props} />;
        }
    )
);

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const modalContentVariants: Variants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { scale: 0.95, opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } },
};

const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const imageCache = new Map<string, string>();

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
                    className="text-lg font-semibold text-neutral-900 dark:text-white capitalize truncate group-hover:text-green-700 dark:group-hover:text-green-300"
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
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const theme = useTheme();
    const { data: recipes, error, isLoading } = useQuery<Recipe[], Error>({
        queryKey: ['recipes'],
        queryFn: fetchRecipes,
    });

    return (
        <div className="bg-neutral-50 dark:bg-neutral-900 min-h-screen">
            <div className="w-full text-center py-16 px-4 bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900 dark:to-green-800 border-b border-green-200 dark:border-green-700 shadow-sm">
                <h1 className="text-4xl md:text-5xl font-bold text-green-800 dark:text-green-200">
                    Find Your Next Healthy Meal
                </h1>
                <p className="mt-4 text-lg text-green-700 dark:text-green-300 max-w-2xl mx-auto">
                    Discover delicious recipes with full nutrition info — helping you hit your goals.
                </p>
            </div>

            <div className="container mx-auto px-4 py-12">
                <h2 className="text-3xl font-bold text-center text-neutral-900 dark:text-neutral-100 mb-10">
                    Featured Recipes
                </h2>

                {isLoading && (
                    <div className="text-center mt-12">
                        <CircularProgress data-testid="main-loader" />
                    </div>
                )}
                {error && (
                    <Alert severity="error" sx={{ mt: 4 }}>
                        Error fetching recipes: {error.message}
                    </Alert>
                )}
                {recipes && (
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
                            <RecipeCard key={r.id} recipe={r} onClick={() => setSelectedRecipe(r)} />
                        ))}
                    </motion.div>
                )}
            </div>

            <AnimatePresence>
                {!!selectedRecipe && (
                    <Dialog
                        open
                        onClose={() => setSelectedRecipe(null)}
                        fullWidth
                        maxWidth="md"
                        PaperComponent={({ children, ...props }) => (
                            // @ts-expect-error - TS2769 known issue with MUI + Framer Motion
                            <MotionPaper
                                {...props}
                                layoutId={`card-container-${selectedRecipe.id}`}
                                variants={modalContentVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                sx={{
                                    bgcolor:
                                        theme.palette.mode === 'dark'
                                            ? 'background.default'
                                            : 'background.paper',
                                    color:
                                        theme.palette.mode === 'dark'
                                            ? 'grey.100'
                                            : 'text.primary',
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    position: 'relative',
                                    boxShadow: theme.shadows[5],
                                }}
                            >
                                {children}
                            </MotionPaper>
                        )}
                        slots={{
                            backdrop: (props) => (
                                <motion.div
                                    {...props}
                                    variants={backdropVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    className="fixed inset-0 bg-black/50"
                                />
                            ),
                        }}
                    >
                        <motion.div layoutId={`image-${selectedRecipe.id}`}>
                            <img
                                src={imageCache.get(selectedRecipe.title) || ''}
                                alt={selectedRecipe.title}
                                className="w-full h-auto max-h-[400px] object-cover"
                            />
                        </motion.div>

                        <DialogTitle sx={{ m: 0, p: 2, textTransform: 'capitalize' }}>
                            <motion.span layoutId={`title-${selectedRecipe.id}`}>
                                {selectedRecipe.title}
                            </motion.span>
                        </DialogTitle>

                        <IconButton
                            aria-label="close"
                            onClick={() => setSelectedRecipe(null)}
                            sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                zIndex: 10,
                                color: theme.palette.text.primary,
                            }}
                        >
                            <CloseIcon fontSize="medium" />
                        </IconButton>

                        <DialogContent dividers>
                            <Typography gutterBottom variant="h6">
                                Instructions:
                            </Typography>
                            <Typography variant="body1">{selectedRecipe.body}</Typography>
                        </DialogContent>
                    </Dialog>
                )}
            </AnimatePresence>
        </div>
    );
};
