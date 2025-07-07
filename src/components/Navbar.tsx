import { useContext, useState, type MouseEvent } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton,
    useTheme,
    Menu,
    MenuItem,
    Tooltip
} from '@mui/material';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContext';

export const Navbar = () => {
    const theme = useTheme();
    const { mode, toggleColorMode } = useContext(ThemeContext);
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const pages = [
        { label: 'Recipes', path: '/tailwind' },
        { label: 'Calculator', path: '/mui' },
        { label: 'Dashboard', path: '/dashboard' }
    ];

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
                <FastfoodIcon sx={{ color: theme.palette.primary.main, mr: 2 }} />

                <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                        Healthy App
                    </Link>
                </Typography>

                {/* Mobile menu button */}
                <Box sx={{ display: { xs: 'flex', sm: 'none' } }}>
                    <IconButton
                        size="large"
                        aria-label="open navigation menu"
                        onClick={handleOpenNavMenu}
                        color="inherit"
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        anchorEl={anchorElNav}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        keepMounted
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        open={Boolean(anchorElNav)}
                        onClose={handleCloseNavMenu}
                    >
                        {pages.map(page => (
                            <MenuItem key={page.label} onClick={handleCloseNavMenu} component={Link} to={page.path}>
                                {page.label}
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>

                {/* Desktop nav links */}
                <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
                    {pages.map(page => (
                        <Button
                            key={page.label}
                            component={Link}
                            to={page.path}
                            sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}
                        >
                            {page.label}
                        </Button>
                    ))}
                </Box>

                <Tooltip title="Toggle light/dark theme">
                    <IconButton onClick={toggleColorMode} sx={{ ml: 1 }}>
                        {mode === 'dark' ? <Brightness7Icon htmlColor="#fff" /> : <Brightness4Icon htmlColor="#000" />}
                    </IconButton>
                </Tooltip>
            </Toolbar>
        </AppBar>
    );
};
