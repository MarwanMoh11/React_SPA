import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    Alert, Box, Button, Card, CardActions, CardContent, CircularProgress, Container, Dialog, DialogActions,
    DialogContent, DialogTitle, Fab, Grid, IconButton, Snackbar, TextField, Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';

// Define the Recipe type
interface Recipe {
    userId: number;
    id: number;
    title: string;
    body: string;
}

// --- API Functions ---
const API_URL = 'https://jsonplaceholder.typicode.com/posts';

// READ all recipes
const fetchRecipes = async (): Promise<Recipe[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.slice(0, 12);
};

// CREATE a new recipe
const createRecipe = async (newRecipe: Omit<Recipe, 'id' | 'userId'>): Promise<Recipe> => {
    const response = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({ ...newRecipe, userId: 1 }),
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
    });
    if (!response.ok) throw new Error('Failed to create recipe');
    return response.json();
};

// UPDATE an existing recipe
const updateRecipe = async (updatedRecipe: Recipe): Promise<Recipe> => {
    const response = await fetch(`${API_URL}/${updatedRecipe.id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedRecipe),
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
    });
    if (!response.ok) throw new Error('Failed to update recipe');
    return response.json();
};

// DELETE a recipe
const deleteRecipe = async (recipeId: number): Promise<object> => {
    const response = await fetch(`${API_URL}/${recipeId}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete recipe');
    return {};
};


export const DashboardPage = () => {
    const queryClient = useQueryClient();
    const [isCreateFormOpen, setCreateFormOpen] = useState(false);
    const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
    const [deletingRecipeId, setDeletingRecipeId] = useState<number | null>(null);
    const [notification, setNotification] = useState<string | null>(null);

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
    const handleCreateSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        createMutation.mutate({ title: formData.get('title') as string, body: formData.get('body') as string });
    };

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
        <Box sx={{ bgcolor: 'grey.100', py: 6, minHeight: 'calc(100vh - 64px)' }}>
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
                                        <IconButton onClick={() => setEditingRecipe(recipe)}><EditIcon /></IconButton>
                                        <IconButton onClick={() => setDeletingRecipeId(recipe.id)}><DeleteIcon color="error" /></IconButton>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>

            {/* "Add Recipe" Button */}
            <Fab color="primary" sx={{ position: 'fixed', bottom: 32, right: 32, backgroundColor: '#2e7d32', '&:hover': { bgcolor: '#1b5e20' } }} onClick={() => setCreateFormOpen(true)}>
                <AddIcon />
            </Fab>

            {/* Create Dialog */}
            <Dialog open={isCreateFormOpen} onClose={() => setCreateFormOpen(false)}>
                <DialogTitle>Add a New Recipe</DialogTitle>
                <Box component="form" onSubmit={handleCreateSubmit}>
                    <DialogContent><TextField autoFocus required margin="dense" name="title" label="Recipe Title" type="text" fullWidth variant="standard" /><TextField required margin="dense" name="body" label="Instructions" type="text" fullWidth multiline rows={4} variant="standard" /></DialogContent>
                    <DialogActions><Button onClick={() => setCreateFormOpen(false)}>Cancel</Button><Button type="submit" disabled={createMutation.isPending}>{createMutation.isPending ? 'Saving...' : 'Save'}</Button></DialogActions>
                </Box>
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
