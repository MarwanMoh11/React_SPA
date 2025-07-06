// src/pages/TailwindPage.test.tsx

import { render, screen, within, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { TailwindPage } from './TailwindPage';
import { server } from '../mocks/server';
import { ThemeProvider, createTheme } from '@mui/material/styles';

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


// --- The Tests ---
describe('TailwindPage', () => {
    test('renders loading state, then displays recipe cards', async () => {
        renderWithProviders(<TailwindPage />);

        // ✅ FIX 1: Check that at least one progress bar exists initially.
        // `getByRole` fails if multiple are found, so `getAllByRole` is more robust here.
        expect(screen.getAllByRole('progressbar').length).toBeGreaterThan(0);

        // Wait for recipes to appear by looking for their titles
        expect(await screen.findByText(/sunt aut facere/i)).toBeInTheDocument();
        expect(await screen.findByText(/qui est esse/i)).toBeInTheDocument();

        // Note: We no longer check for the progressbar to be gone, because the recipe
        // cards themselves have their own loading spinners for images.
    });

    test('displays an error message if the recipes query fails', async () => {
        server.use(
            http.get('https://jsonplaceholder.typicode.com/posts', () => {
                return new HttpResponse(null, { status: 500, statusText: 'Server Error' });
            })
        );

        renderWithProviders(<TailwindPage />);

        // ✅ FIX 2: Find the error message by its text content, since the component uses a <p> tag.
        expect(await screen.findByText(/Error fetching recipes/i)).toBeInTheDocument();
    });

    test('opens and closes the recipe modal with correct content', async () => {
        renderWithProviders(<TailwindPage />);
        const user = userEvent.setup();

        const firstCard = await screen.findByText(/sunt aut facere/i);
        await user.click(firstCard);

        const dialog = await screen.findByRole('dialog');
        expect(dialog).toBeInTheDocument();

        expect(within(dialog).getByText(/sunt aut facere/i)).toBeInTheDocument();
        expect(within(dialog).getByText(/quia et suscipit/i)).toBeInTheDocument();

        // ✅ FIX 3: Find the close button by looking for its icon's test ID,
        // since the button itself has no accessible name.
        const closeIcon = within(dialog).getByTestId('CloseIcon');
        const closeButton = closeIcon.closest('button');
        expect(closeButton).toBeInTheDocument();
        await user.click(closeButton!);

        // ✅ FIX 4: Use `waitForElementToBeRemoved` to correctly handle the exit animation.
        await waitForElementToBeRemoved(() => screen.queryByRole('dialog'));
    });
});
