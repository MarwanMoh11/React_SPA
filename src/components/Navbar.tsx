// src/components/Navbar.tsx
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import FastfoodIcon from '@mui/icons-material/Fastfood'; // A fun icon for our app

export const Navbar = () => {
    return (
        <AppBar position="static" sx={{ backgroundColor: '#2e7d32' }}> {/* A nice green color */}
            <Toolbar>
                <FastfoodIcon sx={{ mr: 2 }} />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Link to="/tailwind" style={{ textDecoration: 'none', color: 'inherit' }}>
                        Healthy Recipes
                    </Link>
                </Typography>
                <Box>
                    <Button color="inherit" component={Link} to="/tailwind">
                        Tailwind Page
                    </Button>
                    <Button color="inherit" component={Link} to="/mui">
                        MUI Page
                    </Button>
                    <Button color="inherit" component={Link} to="/dashboard">
                        Dashboard
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};