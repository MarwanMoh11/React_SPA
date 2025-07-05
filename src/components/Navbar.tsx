import { useContext } from 'react'
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material'
import FastfoodIcon from '@mui/icons-material/Fastfood'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { Link } from 'react-router-dom'
import { ThemeContext } from '../contexts/ThemeContext';

export const Navbar = () => {
    const { mode, toggleColorMode } = useContext(ThemeContext)
    return (
        <AppBar position="static" elevation={1} sx={{ bgcolor: 'background.paper' }}>
            <Toolbar>
                <FastfoodIcon sx={{ color: 'primary.main', mr: 2 }} />
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                        Healthy App
                    </Link>
                </Typography>
                <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
                    <Button component={Link} to="/tailwind">Recipes</Button>
                    <Button component={Link} to="/mui">Calculator</Button>
                    <Button component={Link} to="/dashboard">Dashboard</Button>
                </Box>
                <IconButton onClick={toggleColorMode}>
                    {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
            </Toolbar>
        </AppBar>
    )
}
