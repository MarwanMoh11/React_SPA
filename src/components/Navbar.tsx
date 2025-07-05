import { useContext } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton,
    useTheme
} from '@mui/material';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContext';

export const Navbar = () => {
    const theme = useTheme();
    const { mode, toggleColorMode } = useContext(ThemeContext);

    return (
        <AppBar
            position="static"
            elevation={1}
            sx={{
                bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'background.paper',
                color: theme.palette.mode === 'dark' ? 'grey.100' : 'text.primary',
            }}
        >
            <Toolbar>
                <FastfoodIcon
                    sx={{
                        color: theme.palette.primary.main,
                        mr: 2,
                    }}
                />
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    <Link
                        to="/"
                        style={{
                            textDecoration: 'none',
                            color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
                        }}
                    >
                        Healthy App
                    </Link>
                </Typography>

                <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
                    <Button
                        component={Link}
                        to="/tailwind"
                        sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}
                    >
                        Recipes
                    </Button>
                    <Button
                        component={Link}
                        to="/mui"
                        sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}
                    >
                        Calculator
                    </Button>
                    <Button
                        component={Link}
                        to="/dashboard"
                        sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}
                    >
                        Dashboard
                    </Button>
                </Box>

                <IconButton onClick={toggleColorMode} sx={{ ml: 1 }}>
                    {mode === 'dark' ? (
                        <Brightness7Icon htmlColor="#fff" />
                    ) : (
                        <Brightness4Icon htmlColor="#000" />
                    )}
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};
