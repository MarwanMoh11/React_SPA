// src/pages/DashboardPage.tsx

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    Alert, Box, Button, Card, CardActions, CardContent, CircularProgress, Container, Dialog, DialogActions,
    DialogContent, DialogTitle, Fab, Grid, IconButton, Snackbar, TextField, Typography, Stepper, Step, StepLabel,
    LinearProgress, Chip, Stack, MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';

// Use shared Recipe type
import type { Recipe } from '../types/Recipe';

// --- API Functions ---
// Use the shared service (Firestore in app, JSONPlaceholder in tests)
import { fetchRecipes as fetchRecipesService, createRecipe as createRecipeService, updateRecipe as updateRecipeService, deleteRecipe as deleteRecipeService } from '../services/recipesService';

// READ all recipes
const fetchRecipes = async (): Promise<Recipe[]> => {
    return fetchRecipesService();
};

// CREATE a new recipe
const createRecipe = async (newRecipe: Omit<Recipe, 'id' | 'userId'>): Promise<Recipe> => {
    return createRecipeService(newRecipe);
};

// UPDATE an existing recipe
const updateRecipe = async (updatedRecipe: Recipe): Promise<Recipe> => {
    return updateRecipeService(updatedRecipe);
};

// DELETE a recipe
const deleteRecipe = async (recipeId: number): Promise<object> => {
    return deleteRecipeService(recipeId);
};


export const DashboardPage = () => {
    const queryClient = useQueryClient();
    const [isCreateFormOpen, setCreateFormOpen] = useState(false);
    const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
    const [deletingRecipeId, setDeletingRecipeId] = useState<number | null>(null);
    const [notification, setNotification] = useState<string | null>(null);

    // --- Create Wizard State ---
    const [activeStep, setActiveStep] = useState(0);
    const [title, setTitle] = useState('');
    const [servings, setServings] = useState<number | ''>('');
    const [prepTime, setPrepTime] = useState<number | ''>('');
    const [cookTime, setCookTime] = useState<number | ''>('');
    const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | ''>('');
    const [ingredientInput, setIngredientInput] = useState('');
    const [ingredients, setIngredients] = useState<string[]>([]);
    const [instructions, setInstructions] = useState('');
    // Nutrition per serving
    const [calories, setCalories] = useState<number | ''>('');
    const [protein, setProtein] = useState<number | ''>('');
    const [carbs, setCarbs] = useState<number | ''>('');
    const [fat, setFat] = useState<number | ''>('');

    const resetWizard = () => {
        setActiveStep(0);
        setTitle('');
        setServings('');
        setPrepTime('');
        setCookTime('');
        setDifficulty('');
        setIngredientInput('');
        setIngredients([]);
        setInstructions('');
        setCalories('');
        setProtein('');
        setCarbs('');
        setFat('');
    };

    const canProceed = () => {
        if (activeStep === 0) return title.trim().length > 2;
        if (activeStep === 1) return Boolean(servings) && Boolean(prepTime) && Boolean(cookTime) && Boolean(difficulty);
        if (activeStep === 2) return Boolean(calories !== '' && protein !== '' && carbs !== '' && fat !== '');
        if (activeStep === 3) return ingredients.length > 0;
        if (activeStep === 4) return instructions.trim().length > 10;
        return true;
    };

    const handleAddIngredient = () => {
        const v = ingredientInput.trim();
        if (!v) return;
        setIngredients((prev) => [...prev, v]);
        setIngredientInput('');
    };

    const composeBody = () => {
        const parts: string[] = [];
        parts.push(`Details`);
        parts.push(`Servings: ${servings} | Prep: ${prepTime} min | Cook: ${cookTime} min | Difficulty: ${difficulty}`);
        parts.push('');
        parts.push('Ingredients');
        parts.push(...ingredients.map((ing) => `- ${ing}`));
        parts.push('');
        parts.push('Instructions');
        parts.push(instructions);
        return parts.join('\n');
    };

    const handleCreateWizardSubmit = () => {
        createMutation.mutate({
            title: title.trim(),
            body: composeBody(),
            servings: typeof servings === 'number' ? servings : undefined,
            prepTime: typeof prepTime === 'number' ? prepTime : undefined,
            cookTime: typeof cookTime === 'number' ? cookTime : undefined,
            difficulty: difficulty || undefined,
            ingredients,
            instructions,
            nutrition: {
                calories: typeof calories === 'number' ? calories : undefined,
                protein: typeof protein === 'number' ? protein : undefined,
                carbs: typeof carbs === 'number' ? carbs : undefined,
                fat: typeof fat === 'number' ? fat : undefined,
            },
        });
    };

    // --- QUERIES ---
    const { data: recipes, error, isLoading } = useQuery<Recipe[], Error>({
        queryKey: ['recipes'],
        queryFn: fetchRecipes,
    });

    // --- MUTATIONS ---
    const createMutation = useMutation({
        mutationFn: createRecipe,
        onSuccess: (newRecipe) => {
            queryClient.setQueryData(['recipes'], (oldRecipes: Recipe[] = []) => [newRecipe, ...oldRecipes]);
            setCreateFormOpen(false);
            setNotification('Recipe created successfully!');
        },
    });

    const updateMutation = useMutation({
        mutationFn: updateRecipe,
        onSuccess: (updatedRecipe) => {
            queryClient.setQueryData(['recipes'], (oldRecipes: Recipe[] = []) =>
                oldRecipes.map((recipe) => (recipe.id === updatedRecipe.id ? updatedRecipe : recipe))
            );
            setEditingRecipe(null);
            setNotification('Recipe updated successfully!');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteRecipe,
        onSuccess: (_, recipeId) => {
            queryClient.setQueryData(['recipes'], (oldRecipes: Recipe[] = []) =>
                oldRecipes.filter((recipe) => recipe.id !== recipeId)
            );
            setDeletingRecipeId(null);
            setNotification('Recipe deleted successfully!');
        },
    });

    // --- Handlers ---

    const handleUpdateSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!editingRecipe) return;
        const formData = new FormData(event.currentTarget);
        updateMutation.mutate({
            ...editingRecipe,
            title: formData.get('title') as string,
            body: formData.get('body') as string
        });
    };

    const handleDeleteConfirm = () => {
        if (deletingRecipeId) {
            deleteMutation.mutate(deletingRecipeId);
        }
    };


    return (
        <Box sx={{ py: 6, minHeight: 'calc(100vh - 64px)' }}>
            <Container maxWidth="lg">
                <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 4 }}>
                    Recipe Dashboard
                </Typography>

                {isLoading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>}
                {error && <Alert severity="error" sx={{ my: 4 }}>Error: {error.message}</Alert>}

                {recipes && (
                    <Grid container spacing={4}>
                        {recipes.map((recipe) => (
                            <Grid key={recipe.id} size={{ xs: 12, sm: 6, md: 4 }}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography gutterBottom variant="h5" component="h2" sx={{ textTransform: 'capitalize' }}>
                                            {recipe.title.split(' ').slice(0, 3).join(' ')}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {recipe.body.substring(0, 100)}...
                                        </Typography>
                                    </CardContent>
                                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                                        <IconButton aria-label={`Edit ${recipe.title}`} onClick={() => setEditingRecipe(recipe)}><EditIcon /></IconButton>
                                        <IconButton aria-label={`Delete ${recipe.title}`} onClick={() => setDeletingRecipeId(recipe.id)}><DeleteIcon color="error" /></IconButton>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>

            {/* "Add Recipe" Button */}
            <Fab
                color="primary"
                aria-label="add recipe"
                sx={(theme) => ({
                    position: 'fixed',
                    bottom: 32,
                    right: 32,
                    backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#2e7d32',
                    color: '#fff',
                    '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark' ? '#444' : '#1b5e20',
                    },
                })}
                onClick={() => { resetWizard(); setCreateFormOpen(true); }}
            >
                <AddIcon />
            </Fab>

            {/* Create Wizard Dialog */}
            <Dialog open={isCreateFormOpen} onClose={() => { setCreateFormOpen(false); resetWizard(); }} fullWidth maxWidth="sm">
                <DialogTitle>Recipe Setup Wizard</DialogTitle>
                <DialogContent dividers>
                    <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
                        {['Basics', 'Details', 'Nutrition', 'Ingredients', 'Instructions', 'Review'].map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    {/* Step Content */}
                    {activeStep === 0 && (
                        <Box sx={{ display: 'grid', gap: 2 }}>
                            <TextField
                                label="Recipe Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                autoFocus
                                required
                                fullWidth
                            />
                        </Box>
                    )}

                    {activeStep === 1 && (
                        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                            <TextField
                                label="Servings"
                                type="number"
                                value={servings}
                                onChange={(e) => setServings(e.target.value === '' ? '' : Number(e.target.value))}
                                required
                            />
                            <TextField
                                label="Prep Time (min)"
                                type="number"
                                value={prepTime}
                                onChange={(e) => setPrepTime(e.target.value === '' ? '' : Number(e.target.value))}
                                required
                            />
                            <TextField
                                label="Cook Time (min)"
                                type="number"
                                value={cookTime}
                                onChange={(e) => setCookTime(e.target.value === '' ? '' : Number(e.target.value))}
                                required
                            />
                            <TextField
                                label="Difficulty"
                                select
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard' | '')}
                                required
                            >
                                <MenuItem value={'Easy'}>Easy</MenuItem>
                                <MenuItem value={'Medium'}>Medium</MenuItem>
                                <MenuItem value={'Hard'}>Hard</MenuItem>
                            </TextField>
                        </Box>
                    )}

                    {activeStep === 2 && (
                        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                            <TextField label="Calories (per serving)" type="number" value={calories} onChange={(e) => setCalories(e.target.value === '' ? '' : Number(e.target.value))} required />
                            <TextField label="Protein (g)" type="number" value={protein} onChange={(e) => setProtein(e.target.value === '' ? '' : Number(e.target.value))} required />
                            <TextField label="Carbs (g)" type="number" value={carbs} onChange={(e) => setCarbs(e.target.value === '' ? '' : Number(e.target.value))} required />
                            <TextField label="Fat (g)" type="number" value={fat} onChange={(e) => setFat(e.target.value === '' ? '' : Number(e.target.value))} required />
                        </Box>
                    )}

                    {activeStep === 3 && (
                        <Box>
                            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Add Ingredient"
                                    value={ingredientInput}
                                    onChange={(e) => setIngredientInput(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddIngredient(); } }}
                                />
                                <Button variant="contained" onClick={handleAddIngredient} disabled={!ingredientInput.trim()}>
                                    Add
                                </Button>
                            </Box>
                            {ingredients.length > 0 ? (
                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                    {ingredients.map((ing, idx) => (
                                        <Chip
                                            key={idx}
                                            label={ing}
                                            onDelete={() => setIngredients((prev) => prev.filter((_, i) => i !== idx))}
                                        />
                                    ))}
                                </Stack>
                            ) : (
                                <Typography variant="body2" color="text.secondary">No ingredients added yet.</Typography>
                            )}
                        </Box>
                    )}

                    {activeStep === 4 && (
                        <Box>
                            <TextField
                                label="Instructions"
                                value={instructions}
                                onChange={(e) => setInstructions(e.target.value)}
                                multiline
                                minRows={6}
                                fullWidth
                                required
                            />
                        </Box>
                    )}

                    {activeStep === 5 && (
                        <Box sx={{ display: 'grid', gap: 1 }}>
                            <Typography variant="subtitle1"><strong>Title:</strong> {title}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Servings: {servings} | Prep: {prepTime} min | Cook: {cookTime} min | Difficulty: {difficulty}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Nutrition (per serving): {calories || 0} kcal • {protein || 0}g P • {carbs || 0}g C • {fat || 0}g F
                            </Typography>
                            <Typography variant="subtitle2" sx={{ mt: 1 }}>Ingredients</Typography>
                            <ul style={{ paddingLeft: 18, marginTop: 4 }}>
                                {ingredients.map((ing, idx) => (<li key={idx}>{ing}</li>))}
                            </ul>
                            <Typography variant="subtitle2" sx={{ mt: 1 }}>Instructions</Typography>
                            <Typography variant="body2" whiteSpace="pre-wrap">{instructions}</Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setCreateFormOpen(false); }} disabled={createMutation.isPending}>Cancel</Button>
                    {activeStep > 0 && (
                        <Button onClick={() => setActiveStep((s) => s - 1)} disabled={createMutation.isPending}>
                            Back
                        </Button>
                    )}
                    {activeStep < 5 && (
                        <Button onClick={() => setActiveStep((s) => s + 1)} disabled={!canProceed() || createMutation.isPending}>
                            Next
                        </Button>
                    )}
                    {activeStep === 5 && (
                        <Button onClick={handleCreateWizardSubmit} variant="contained" disabled={createMutation.isPending}>
                            {createMutation.isPending ? 'Creating...' : 'Create Recipe'}
                        </Button>
                    )}
                </DialogActions>
                {createMutation.isPending && <LinearProgress />}
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={!!editingRecipe} onClose={() => setEditingRecipe(null)}>
                <DialogTitle>Edit Recipe</DialogTitle>
                <Box component="form" onSubmit={handleUpdateSubmit}>
                    <DialogContent>
                        <TextField autoFocus required margin="dense" name="title" label="Recipe Title" type="text" fullWidth variant="standard" defaultValue={editingRecipe?.title} />
                        <TextField required margin="dense" name="body" label="Instructions" type="text" fullWidth multiline rows={4} variant="standard" defaultValue={editingRecipe?.body} />
                    </DialogContent>
                    <DialogActions><Button onClick={() => setEditingRecipe(null)}>Cancel</Button><Button type="submit" disabled={updateMutation.isPending}>{updateMutation.isPending ? 'Saving...' : 'Save Changes'}</Button></DialogActions>
                </Box>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deletingRecipeId} onClose={() => setDeletingRecipeId(null)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent><Typography>Are you sure you want to delete this recipe? This action cannot be undone.</Typography></DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeletingRecipeId(null)}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error" disabled={deleteMutation.isPending}>{deleteMutation.isPending ? 'Deleting...' : 'Delete'}</Button>
                </DialogActions>
            </Dialog>

            {/* Notification Snackbar */}
            <Snackbar open={!!notification} autoHideDuration={6000} onClose={() => setNotification(null)} message={notification} />
        </Box>
    );
};