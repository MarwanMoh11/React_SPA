// src/components/Navbar.tsx

import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import FastfoodIcon from '@mui/icons-material/Fastfood';

// 1. Import the hook from its new, dedicated file
import { useTheme } from '../hooks/useTheme';

// 2. Import icons for the theme toggle button
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Moon icon for dark mode
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Sun icon for light mode

export const Navbar = () => {
    // 3. Use the hook to get the current theme and the function to toggle it
    const { theme, toggleTheme } = useTheme();
    console.log("Current theme in Navbar:", theme);

    return (
        <AppBar position="static" sx={{ backgroundColor: '#2e7d32' }}>
            <Toolbar>
                <FastfoodIcon sx={{ mr: 2 }} />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Link to="/tailwind" style={{ textDecoration: 'none', color: 'inherit' }}>
                        Healthy Recipes
                    </Link>
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button color="inherit" component={Link} to="/tailwind">

                        Tailwind Page
                    </Button>
                    <Button color="inherit" component={Link} to="/mui">
                        MUI Page
                    </Button>
                    <Button color="inherit" component={Link} to="/dashboard">
                        Dashboard
                    </Button>

                    {/* 4. The theme toggle button */}
                    <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
                        {/* Show a sun icon in dark mode, and a moon icon in light mode */}
                        {theme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
};