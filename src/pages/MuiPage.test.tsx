// src/pages/MuiPage.test.tsx

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MuiPage } from './MuiPage'; // Adjust path as needed
import { ThemeProvider, createTheme } from '@mui/material/styles';

// --- Helper Functions ---

// Since MuiPage uses `useTheme`, it must be rendered inside a ThemeProvider.
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    const theme = createTheme({ palette: { mode: 'light' } });
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

const renderWithProviders = (ui: React.ReactElement) => {
    return render(ui, { wrapper: AllTheProviders });
};


// --- The Tests ---

describe('MuiPage (Calorie Calculator)', () => {
    test('renders the form with default values', () => {
        renderWithProviders(<MuiPage />);
        expect(screen.getByRole('heading', { name: /daily calorie & macro calculator/i })).toBeInTheDocument();

        // ✅ FIX: Find the radio button by its specific label text
        expect(screen.getByLabelText('Male')).toBeChecked();

        expect(screen.getByLabelText(/age/i)).toHaveValue(null);
        expect(screen.getByLabelText(/weight \(kg\)/i)).toHaveValue(null);
        expect(screen.getByLabelText(/height \(cm\)/i)).toHaveValue(null);
        expect(screen.getByText(/fill out the form to see your results/i)).toBeInTheDocument();
    });

    test('calculates and displays results on valid form submission', async () => {
        renderWithProviders(<MuiPage />);
        const user = userEvent.setup();

        // ✅ FIX: Find radio buttons by their specific labels
        await user.click(screen.getByLabelText('Female'));
        await user.type(screen.getByLabelText(/age/i), '30');
        await user.type(screen.getByLabelText(/weight \(kg\)/i), '65');
        await user.type(screen.getByLabelText(/height \(cm\)/i), '170');

        // ✅ FIX: Find the select dropdown by its combobox role and accessible name
        await user.click(screen.getByRole('combobox', { name: /activity level/i }));
        await user.click(await screen.findByRole('option', { name: /moderately active/i }));

        await user.click(screen.getByRole('button', { name: /lose weight/i }));
        await user.click(screen.getByRole('button', { name: /calculate/i }));

        // Assertions
        const caloriesResult = await screen.findByText('1672');
        expect(caloriesResult).toBeInTheDocument();
        expect(screen.getByText('125g')).toBeInTheDocument(); // Protein
        expect(screen.getByText('167g')).toBeInTheDocument(); // Carbs
        expect(screen.getByText('56g')).toBeInTheDocument();  // Fat
    });

    test('shows an alert for invalid input', async () => {
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

        renderWithProviders(<MuiPage />);
        const user = userEvent.setup();

        await user.type(screen.getByLabelText(/age/i), '-30');
        await user.type(screen.getByLabelText(/weight \(kg\)/i), '65');
        await user.type(screen.getByLabelText(/height \(cm\)/i), '170');

        await user.click(screen.getByRole('button', { name: /calculate/i }));

        expect(alertMock).toHaveBeenCalledTimes(1);
        expect(alertMock).toHaveBeenCalledWith('Please enter valid, positive numbers for age, weight, and height.');

        alertMock.mockRestore();
    });
});
