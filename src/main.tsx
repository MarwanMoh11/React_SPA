import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { AppThemeProvider } from './contexts/ThemeProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AppThemeProvider>
            <QueryClientProvider client={queryClient}>
                <App />
            </QueryClientProvider>
        </AppThemeProvider>
    </React.StrictMode>
)
