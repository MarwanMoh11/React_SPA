// src/pages/DashboardPage.test.tsx

import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DashboardPage } from './DashboardPage';
import { server } from '../mocks/server';

// --- Test Setup ---
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// --- Helper Functions ---
const createTestQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

const renderWithClient = (ui: React.ReactElement) => {
    const testQueryClient = createTestQueryClient();
    const { rerender, ...result } = render(
        <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>
    );
    return {
        ...result,
        rerender: (rerenderUi: React.ReactElement) =>
            rerender(
                <QueryClientProvider client={testQueryClient}>{rerenderUi}</QueryClientProvider>
            ),
    };
};

// --- The Tests ---
describe('DashboardPage', () => {
    test('renders loading state initially, then displays recipes', async () => {
        renderWithClient(<DashboardPage />);
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
        expect(await screen.findByText(/sunt aut facere/i)).toBeInTheDocument();
        expect(await screen.findByText(/qui est esse/i)).toBeInTheDocument();
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    test('creates a new recipe and adds it to the list', async () => {
        renderWithClient(<DashboardPage />);
        const user = userEvent.setup();
        await screen.findByText(/sunt aut facere/i);

        await user.click(screen.getByRole('button', { name: /add recipe/i }));
        expect(screen.getByRole('dialog', { name: /add a new recipe/i })).toBeInTheDocument();

        await user.type(screen.getByLabelText(/recipe title/i), 'New Test Recipe');
        await user.type(screen.getByLabelText(/instructions/i), 'Some new instructions.');
        await user.click(screen.getByRole('button', { name: /save/i }));

        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
        expect(await screen.findByText(/new test recipe/i)).toBeInTheDocument();
        expect(await screen.findByText(/recipe created successfully/i)).toBeInTheDocument();
    });

    test('updates an existing recipe', async () => {
        renderWithClient(<DashboardPage />);
        const user = userEvent.setup();

        const recipeCard = (await screen.findByText(/sunt aut facere/i)).closest('div.MuiCard-root');
        expect(recipeCard).not.toBeNull();

        // ✅ FIX: Assert the type here to satisfy `within`
        const editButton = within(recipeCard as HTMLElement).getByRole('button', { name: /edit sunt aut facere/i });
        await user.click(editButton);

        expect(screen.getByRole('dialog', { name: /edit recipe/i })).toBeInTheDocument();
        const titleInput = screen.getByDisplayValue(/sunt aut facere/i);

        await user.clear(titleInput);
        await user.type(titleInput, 'Updated Recipe Title');
        await user.click(screen.getByRole('button', { name: /save changes/i }));

        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
        expect(await screen.findByText(/updated recipe title/i)).toBeInTheDocument();
        expect(screen.queryByText(/sunt aut facere/i)).not.toBeInTheDocument();
        expect(await screen.findByText(/recipe updated successfully/i)).toBeInTheDocument();
    });

    test('deletes a recipe after confirmation', async () => {
        renderWithClient(<DashboardPage />);
        const user = userEvent.setup();
        const recipeToDeleteTitle = /sunt aut facere/i;

        const recipeCard = (await screen.findByText(recipeToDeleteTitle)).closest('div.MuiCard-root');
        expect(recipeCard).not.toBeNull();

        // ✅ FIX: Assert the type here to satisfy `within`
        const deleteButton = within(recipeCard as HTMLElement).getByRole('button', { name: /delete sunt aut facere/i });
        await user.click(deleteButton);

        expect(screen.getByRole('dialog', { name: /confirm deletion/i })).toBeInTheDocument();
        await user.click(screen.getByRole('button', { name: "Delete" }));

        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
        expect(screen.queryByText(recipeToDeleteTitle)).not.toBeInTheDocument();
        expect(await screen.findByText(/recipe deleted successfully/i)).toBeInTheDocument();
    });
});