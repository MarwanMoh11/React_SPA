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
import { Link, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const AuthActions = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    if (!user) {
        return (
            <Button variant="outlined" size="small" component={Link} to="/login">Login</Button>
        );
    }
    return (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Typography variant="body2" sx={{ display: { xs: 'none', md: 'block' } }}>
                {user.displayName || user.email}
            </Typography>
            <Button size="small" component={Link} to="/settings">Settings</Button>
            <Button size="small" color="error" onClick={async () => { await signOut(); navigate('/'); }}>Logout</Button>
        </Box>
    );
};

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

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tooltip title="Toggle light/dark theme">
                        <IconButton onClick={toggleColorMode}>
                            {mode === 'dark' ? <Brightness7Icon htmlColor="#fff" /> : <Brightness4Icon htmlColor="#000" />}
                        </IconButton>
                    </Tooltip>
                    <AuthActions />
                </Box>
            </Toolbar>
        </AppBar>
    );
};
