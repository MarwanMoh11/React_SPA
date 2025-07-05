import type {Recipe} from '../types/Recipe';

const API_URL = 'https://jsonplaceholder.typicode.com/posts';

// A list of high-quality, detailed recipes to ensure great content
const detailedRecipes: Recipe[] = [
    { id: 1001, userId: 1, title: 'Spaghetti Carbonara', body: 'A classic Italian pasta dish. The sauce is created with egg, hard cheese, cured pork, and black pepper.' },
    { id: 1002, userId: 1, title: 'Chicken Tikka Masala', body: 'Chunks of roasted marinated chicken in a spiced curry sauce. The sauce is usually creamy and orange-coloured.' },
    { id: 1003, userId: 1, title: 'Burger', body: 'A juicy beef patty served in a sliced bun with lettuce, tomato, onion, and cheese.' },
    { id: 1004, userId: 1, title: 'Salad with Salmon', body: 'A green salad of romaine lettuce and croutons dressed with lemon juice, olive oil, egg, Worcestershire sauce, anchovies, garlic, Dijon mustard, Parmesan cheese, and black pepper.' },
    { id: 1005, userId: 1, title: 'Margherita Pizza', body: 'A simple yet delicious pizza topped with San Marzano tomatoes, fresh mozzarella cheese, fresh basil, salt, and extra-virgin olive oil.' },
    { id: 1006, userId: 1, title: 'Noodles', body: 'A Japanese noodle soup, with a combination of a rich flavoured broth, one of a variety of noodles and a selection of meats or vegetables, often topped with a boiled egg.' },
    { id: 1007, userId: 1, title: 'Greek Salad', body: 'Made with pieces of tomatoes, cucumbers, onion, feta cheese, and olives and dressed with salt, pepper, Greek oregano, and olive oil.' },
    { id: 1008, userId: 1, title: 'Chocolate Lava Cake', body: 'A popular dessert that combines the elements of a chocolate cake and a soufflé. Its name derives from the dessert\'s liquid chocolate center.' },
];

// Fetch recipes from the API and merge with our detailed list
export const fetchRecipes = async (): Promise<Recipe[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const apiRecipes: Recipe[] = await response.json();
    // Combine our detailed recipes with a slice of the API recipes
    return [...detailedRecipes, ...apiRecipes.slice(0, 8)];
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
        console.error("Failed to fetch image:", error);
        return `https://placehold.co/600/d32f2f/ffffff?text=Error`;
    }
};