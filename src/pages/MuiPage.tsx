import {
    Box, Button, Card, CardContent, Container, FormControl, FormControlLabel, FormLabel, Grid,
    Radio, RadioGroup, Select, MenuItem, TextField, ToggleButton, ToggleButtonGroup, Typography, Divider, InputLabel,
    type SelectChangeEvent
} from '@mui/material';
import { useState, useCallback } from 'react';

// Define types for our state
type Gender = 'male' | 'female';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
type Goal = 'lose' | 'maintain' | 'gain';

interface Results {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

export const MuiPage = () => {
    // State for form inputs
    const [gender, setGender] = useState<Gender>('male');
    const [age, setAge] = useState<string>('');
    const [weight, setWeight] = useState<string>(''); // in kg
    const [height, setHeight] = useState<string>(''); // in cm
    const [activityLevel, setActivityLevel] = useState<ActivityLevel>('light');
    const [goal, setGoal] = useState<Goal>('maintain');

    // State for calculated results
    const [results, setResults] = useState<Results | null>(null);

    const handleCalculate = useCallback(() => {
        const ageNum = parseInt(age);
        const weightNum = parseFloat(weight);
        const heightNum = parseFloat(height);

        if (isNaN(ageNum) || isNaN(weightNum) || isNaN(heightNum) || ageNum <= 0 || weightNum <= 0 || heightNum <= 0) {
            alert('Please enter valid, positive numbers for age, weight, and height.');
            return;
        }

        // 1. Calculate BMR using Mifflin-St Jeor equation
        let bmr: number;
        if (gender === 'male') {
            bmr = (10 * weightNum) + (6.25 * heightNum) - (5 * ageNum) + 5;
        } else {
            bmr = (10 * weightNum) + (6.25 * heightNum) - (5 * ageNum) - 161;
        }

        // 2. Adjust BMR by activity level to get TDEE
        const activityMultipliers: Record<ActivityLevel, number> = {
            sedentary: 1.2,
            light: 1.375,
            moderate: 1.55,
            active: 1.725,
            veryActive: 1.9,
        };
        const tdee = bmr * activityMultipliers[activityLevel];

        // 3. Adjust TDEE based on goal
        let finalCalories: number;
        switch (goal) {
            case 'lose':
                finalCalories = tdee - 500;
                break;
            case 'gain':
                finalCalories = tdee + 500;
                break;
            case 'maintain':
            default:
                finalCalories = tdee;
        }

        // 4. Calculate macros (e.g., 40% carbs, 30% protein, 30% fat)
        const proteinGrams = Math.round((finalCalories * 0.30) / 4);
        const carbsGrams = Math.round((finalCalories * 0.40) / 4);
        const fatGrams = Math.round((finalCalories * 0.30) / 9);

        setResults({
            calories: Math.round(finalCalories),
            protein: proteinGrams,
            carbs: carbsGrams,
            fat: fatGrams,
        });
    }, [age, weight, height, gender, activityLevel, goal]);

    return (
        <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
            <Container maxWidth="md">
                <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
                    Daily Calorie & Macro Calculator
                </Typography>
                <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 6 }}>
                    Estimate your daily needs based on the Mifflin-St Jeor formula.
                </Typography>

                <Grid container spacing={4}>
                    {/* --- Input Form --- */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <FormControl>
                                <FormLabel>Gender</FormLabel>
                                <RadioGroup row value={gender} onChange={(e) => setGender(e.target.value as Gender)}>
                                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                                    <FormControlLabel value="female" control={<Radio />} label="Female" />
                                </RadioGroup>
                            </FormControl>
                            <TextField label="Age" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
                            <TextField label="Weight (kg)" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
                            <TextField label="Height (cm)" type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
                            <FormControl fullWidth>
                                <InputLabel>Activity Level</InputLabel>
                                <Select value={activityLevel} label="Activity Level" onChange={(e: SelectChangeEvent) => setActivityLevel(e.target.value as ActivityLevel)}>
                                    <MenuItem value="sedentary">Sedentary (little or no exercise)</MenuItem>
                                    <MenuItem value="light">Lightly Active (light exercise/sports 1-3 days/week)</MenuItem>
                                    <MenuItem value="moderate">Moderately Active (moderate exercise/sports 3-5 days/week)</MenuItem>
                                    <MenuItem value="active">Active (hard exercise/sports 6-7 days a week)</MenuItem>
                                    <MenuItem value="veryActive">Very Active (very hard exercise & physical job)</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <FormLabel sx={{ mb: 1 }}>Your Goal</FormLabel>
                                <ToggleButtonGroup
                                    color="primary"
                                    value={goal}
                                    exclusive
                                    onChange={(_, newGoal) => { if (newGoal) setGoal(newGoal); }}
                                    fullWidth
                                >
                                    <ToggleButton value="lose">Lose Weight</ToggleButton>
                                    <ToggleButton value="maintain">Maintain</ToggleButton>
                                    <ToggleButton value="gain">Gain Weight</ToggleButton>
                                </ToggleButtonGroup>
                            </FormControl>
                            <Button variant="contained" onClick={handleCalculate} sx={{ py: 1.5, bgcolor: '#2e7d32', '&:hover': { bgcolor: '#1b5e20' } }}>
                                Calculate
                            </Button>
                        </Box>
                    </Grid>

                    {/* --- Results Display --- */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card variant="outlined" sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {results ? (
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Typography variant="h6" color="text.secondary">Your Daily Goal</Typography>
                                    <Typography variant="h3" component="p" sx={{ fontWeight: 'bold', color: 'primary.main', my: 2 }}>
                                        {results.calories} <span style={{ fontSize: '1.5rem' }}>kcal</span>
                                    </Typography>
                                    <Divider sx={{ my: 2 }} />
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 4 }} sx={{ textAlign: 'center' }}>
                                            <Typography variant="h6">{results.protein}g</Typography>
                                            <Typography color="text.secondary">Protein</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 4 }} sx={{ textAlign: 'center' }}>
                                            <Typography variant="h6">{results.carbs}g</Typography>
                                            <Typography color="text.secondary">Carbs</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 4 }} sx={{ textAlign: 'center' }}>
                                            <Typography variant="h6">{results.fat}g</Typography>
                                            <Typography color="text.secondary">Fat</Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            ) : (
                                <Typography color="text.secondary">Fill out the form to see your results</Typography>
                            )}
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};