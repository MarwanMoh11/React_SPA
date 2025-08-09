// src/pages/TailwindPage.test.tsx

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { TailwindPage } from './TailwindPage';
import { server } from '../mocks/server';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import RecipeDetailsPage from './RecipeDetailsPage';

// --- Helper Functions ---
const createTestQueryClient = () => new QueryClient({
    defaultOptions: { queries: { retry: false } },
});

const renderWithProviders = (ui: React.ReactElement) => {
    const testQueryClient = createTestQueryClient();
    const theme = createTheme({ palette: { mode: 'light' } });
    render(
        <QueryClientProvider client={testQueryClient}>
            <ThemeProvider theme={theme}>{ui}</ThemeProvider>
        </QueryClientProvider>
    );
};

const renderWithRouter = () => {
    const testQueryClient = createTestQueryClient();
    const theme = createTheme({ palette: { mode: 'light' } });
    render(
        <QueryClientProvider client={testQueryClient}>
            <ThemeProvider theme={theme}>
                <MemoryRouter initialEntries={["/"]}>
                    <Routes>
                        <Route path="/" element={<TailwindPage />} />
                        <Route path="/recipes/:id" element={<RecipeDetailsPage />} />
                    </Routes>
                </MemoryRouter>
            </ThemeProvider>
        </QueryClientProvider>
    );
};


// --- The Tests ---
describe('TailwindPage', () => {
    test('renders loading state, then displays recipe cards', async () => {
        renderWithProviders(<TailwindPage />);
        expect(screen.getAllByRole('progressbar').length).toBeGreaterThan(0);
        expect(await screen.findByText(/sunt aut facere/i)).toBeInTheDocument();
        expect(await screen.findByText(/qui est esse/i)).toBeInTheDocument();
    });

    test('displays an error message if the recipes query fails', async () => {
        server.use(
            http.get('https://jsonplaceholder.typicode.com/posts', () => {
                return new HttpResponse(null, { status: 500, statusText: 'Server Error' });
            })
        );
        renderWithProviders(<TailwindPage />);
        const alert = await screen.findByRole('alert');
        expect(alert).toHaveTextContent(/error fetching recipes/i);
    });

    test('navigates to recipe details page with correct content', async () => {
        renderWithRouter();
        const user = userEvent.setup();

        const firstCard = await screen.findByText(/sunt aut facere/i);
        await user.click(firstCard);

        // On the details page, title and body should be visible
        expect(await screen.findByText(/sunt aut facere/i)).toBeInTheDocument();
        expect(await screen.findByText(/quia et suscipit/i)).toBeInTheDocument();
    });
});
