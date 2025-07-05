// src/context/theme.ts

import { createContext } from 'react';

// Define the type for our theme
export type Theme = 'light' | 'dark';

// Define the shape of the data our context will hold
export interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

// Create and export the context object itself.
// It is initialized with `undefined` and will be given a value by the Provider.
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);