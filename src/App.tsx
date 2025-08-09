// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/MainLayout';
import { TailwindPage } from './pages/TailwindPage';
import { MuiPage } from './pages/MuiPage';
import { DashboardPage } from './pages/DashboardPage';
import { AppThemeProvider } from './contexts/ThemeProvider'; // ✅ Correct import
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (!user) return <LoginPage />;
    return <>{children}</>;
}

export default function App() {
    return (
        <AppThemeProvider>
            <BrowserRouter>
                <AuthProvider>
                    <Routes>
                        <Route path="/" element={<MainLayout />}>
                            <Route index element={<TailwindPage />} />
                            <Route path="tailwind" element={<TailwindPage />} />
                            <Route path="mui" element={<MuiPage />} />
                            <Route path="login" element={<LoginPage />} />
                            <Route path="settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
                            <Route path="dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
                        </Route>
                    </Routes>
                </AuthProvider>
            </BrowserRouter>
        </AppThemeProvider>
    );
}
