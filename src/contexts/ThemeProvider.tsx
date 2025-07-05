// src/contexts/ThemeProvider.tsx
import { useState, useEffect, useMemo, type ReactNode } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { ThemeContext, type ThemeContextType } from './ThemeContext';

export const AppThemeProvider = ({ children }: { children: ReactNode }) => {
    const [mode, setMode] = useState<ThemeContextType['mode']>(
        (localStorage.getItem('theme') as ThemeContextType['mode']) ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    );

    useEffect(() => {
        localStorage.setItem('theme', mode);

        // ✅ This ensures Tailwind can react to dark mode via `class` strategy
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(mode);
    }, [mode]);

    const toggleColorMode = () => setMode(prev => (prev === 'light' ? 'dark' : 'light'));

    const theme = useMemo(() => createTheme({
        palette: {
            mode,
            primary: { main: '#2e7d32' },
            secondary: { main: '#ff9100' },
            ...(mode === 'dark' && {
                background: { default: '#121212', paper: '#1e1e1e' },
                text: { primary: '#e0e0e0', secondary: '#a0a0a0' },
                divider: '#373737',
            }),
            ...(mode === 'light' && {
                background: { default: '#fafafa', paper: '#ffffff' },
                text: { primary: '#202020', secondary: '#555555' },
            }),
        },
    }), [mode]);

    return (
        <ThemeContext.Provider value={{ mode, toggleColorMode }}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
};
