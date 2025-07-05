// src/hooks/useTheme.ts

import { useContext } from 'react';
// Update the import path to point to the new context definition file
import { ThemeContext } from '../context/theme';

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};