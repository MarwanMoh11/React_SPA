import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Box } from '@mui/material'

export const MainLayout = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 2 }}>
            <Outlet />
        </Box>
    </Box>
)
