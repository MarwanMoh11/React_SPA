// src/pages/TailwindPage.tsx
export const TailwindPage = () => {
    const recipes = [
        { name: 'Avocado Toast', cals: 250, img: 'https://placehold.co/600x400/a3e635/3f6212?text=Avocado+Toast' },
        { name: 'Grilled Salmon Salad', cals: 450, img: 'https://placehold.co/600x400/6ee7b7/064e3b?text=Salmon+Salad' },
        { name: 'Quinoa Bowl', cals: 350, img: 'https://placehold.co/600x400/fcd34d/b45309?text=Quinoa+Bowl' },
    ];

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <div className="text-center py-16 px-4 bg-green-100">
                <h1 className="text-4xl md:text-5xl font-bold text-green-800">Find Your Next Healthy Meal</h1>
                <p className="mt-4 text-lg text-green-700">Delicious recipes with full nutritional info to help you meet your goals.</p>
            </div>

            {/* Featured Recipes Section */}
            <div className="container mx-auto px-4 py-12">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Featured Recipes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {recipes.map((recipe) => (
                        <div key={recipe.name} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                            <img src={recipe.img} alt={recipe.name} className="w-full h-48 object-cover" />
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-900">{recipe.name}</h3>
                                <p className="mt-2 text-gray-600">{recipe.cals} Calories</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};