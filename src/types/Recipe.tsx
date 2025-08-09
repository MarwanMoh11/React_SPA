// src/types/Recipe.ts
// Extended Recipe type to support health-focused data while keeping legacy fields for tests/UI.
export interface Recipe {
    userId: number; // legacy for tests/UI
    id: number;
    title: string;
    body: string;
    // Owner UID for Firebase Auth; used to enforce per-user data
    ownerUid?: string;

    // Optional structured fields (health + structure)
    servings?: number;
    prepTime?: number; // minutes
    cookTime?: number; // minutes
    difficulty?: 'Easy' | 'Medium' | 'Hard';
    ingredients?: string[];
    instructions?: string; // structured instructions; body remains for backward compatibility
    nutrition?: {
        calories?: number; // per serving
        protein?: number;  // grams per serving
        carbs?: number;    // grams per serving
        fat?: number;      // grams per serving
    };
}