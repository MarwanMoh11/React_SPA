// src/contexts/ThemeContext.ts
import { createContext } from 'react';
import type { PaletteMode } from '@mui/material';

export interface ThemeContextType {
    mode: PaletteMode;
    toggleColorMode: () => void;
}

// just the context object, no components here
export const ThemeContext = createContext<ThemeContextType>({
    mode: 'light',
    toggleColorMode: () => {},
});
