import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MainLayout } from './components/MainLayout'
import { TailwindPage } from './pages/TailwindPage'
import { MuiPage } from './pages/MuiPage'
import { DashboardPage } from './pages/DashboardPage'

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<TailwindPage />} />
                    <Route path="tailwind" element={<TailwindPage />} />
                    <Route path="mui" element={<MuiPage />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
