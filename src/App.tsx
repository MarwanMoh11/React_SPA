import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/MainLayout';
import { TailwindPage } from './pages/TailwindPage';
import { MuiPage } from './pages/MuiPage';
import { DashboardPage } from './pages/DashboardPage'; // We'll create this next

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* The MainLayout provides the Navbar for all pages */}
                <Route path="/" element={<MainLayout />}>
                    {/* Default route redirects to /tailwind */}
                    <Route index element={<TailwindPage />} />
                    <Route path="tailwind" element={<TailwindPage />} />
                    <Route path="mui" element={<MuiPage />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;