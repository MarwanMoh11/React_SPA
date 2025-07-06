// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

const API_URL = 'https://jsonplaceholder.typicode.com/posts';

export const handlers = [
    // Mock for "READ all recipes" (GET request)
    http.get(API_URL, () => {
        return HttpResponse.json([
            { userId: 1, id: 1, title: 'sunt aut facere', body: 'quia et suscipit' },
            { userId: 1, id: 2, title: 'qui est esse', body: 'est rerum tempore' },
        ]);
    }),

    // Mock for "CREATE a new recipe" (POST request)
    http.post(API_URL, async ({ request }) => {
        // THE FIX: Assert that the incoming JSON is an object.
        const newRecipe = (await request.json()) as object;

        // Now TypeScript knows it's safe to spread `newRecipe`
        return HttpResponse.json({ ...newRecipe, id: 101 }, { status: 201 });
    }),

    // Mock for "UPDATE an existing recipe" (PUT request)
    http.put(`${API_URL}/:id`, async ({ request }) => {
        // Apply the same fix here for consistency
        const updatedRecipe = (await request.json()) as object;
        return HttpResponse.json(updatedRecipe);
    }),

    // Mock for "DELETE a recipe" (DELETE request)
    http.delete(`${API_URL}/:id`, () => {
        return HttpResponse.json({});
    }),
];