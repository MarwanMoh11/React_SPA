import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export const MainLayout = () => {
    return (
        <div>
            <Navbar />
            <main>
                {/* The active page component renders here */}
                <Outlet />
            </main>
        </div>
    );
};