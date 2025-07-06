// src/pages/MuiPage.tsx

import { useState, useCallback } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
    Box, Button, Card, CardContent, Container, FormControl, FormControlLabel, FormLabel, Grid,
    Radio, RadioGroup, Select, MenuItem, TextField, ToggleButton, ToggleButtonGroup, Typography,
    Divider, InputLabel, useTheme, type SelectChangeEvent
} from '@mui/material';

type Gender = 'male' | 'female';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
type Goal = 'lose' | 'maintain' | 'gain';

interface Results {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            when: 'beforeChildren',
            staggerChildren: 0.2
        }
    }
};

const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export const MuiPage = () => {
    const theme = useTheme();

    const [gender, setGender] = useState<Gender>('male');
    const [age, setAge] = useState<string>('');
    const [weight, setWeight] = useState<string>('');
    const [height, setHeight] = useState<string>('');
    const [activityLevel, setActivityLevel] = useState<ActivityLevel>('light');
    const [goal, setGoal] = useState<Goal>('maintain');
    const [results, setResults] = useState<Results | null>(null);

    const handleCalculate = useCallback(() => {
        const ageNum = parseInt(age);
        const weightNum = parseFloat(weight);
        const heightNum = parseFloat(height);
        if (isNaN(ageNum) || isNaN(weightNum) || isNaN(heightNum) || ageNum <= 0 || weightNum <= 0 || heightNum <= 0) {
            alert('Please enter valid, positive numbers for age, weight, and height.');
            return;
        }
        const bmr = gender === 'male'
            ? (10 * weightNum) + (6.25 * heightNum) - (5 * ageNum) + 5
            : (10 * weightNum) + (6.25 * heightNum) - (5 * ageNum) - 161;
        const multipliers: Record<ActivityLevel, number> = {
            sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryActive: 1.9
        };
        const tdee = bmr * multipliers[activityLevel];
        const finalCalories = goal === 'lose' ? tdee - 500
            : goal === 'gain' ? tdee + 500
                : tdee;
        setResults({
            calories: Math.round(finalCalories),
            protein: Math.round(finalCalories * 0.30 / 4),
            carbs:   Math.round(finalCalories * 0.40 / 4),
            fat:     Math.round(finalCalories * 0.30 / 9),
        });
    }, [age, weight, height, gender, activityLevel, goal]);

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <Box sx={{
                bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
                py: 8,
            }}>
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
                            <motion.div variants={sectionVariants}>
                                <FormControl component="fieldset" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <FormLabel component="legend">Gender</FormLabel>
                                    <RadioGroup row value={gender} onChange={(e) => setGender(e.target.value as Gender)}>
                                        <FormControlLabel value="male" control={<Radio />} label="Male" />
                                        <FormControlLabel value="female" control={<Radio />} label="Female" />
                                    </RadioGroup>
                                    <TextField label="Age" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
                                    <TextField label="Weight (kg)" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
                                    <TextField label="Height (cm)" type="number" value={height} onChange={(e) => setHeight(e.target.value)} />

                                    {/* ✅ FIX: Added id and labelId to link the label and select */}
                                    <FormControl fullWidth>
                                        <InputLabel id="activity-level-select-label">Activity Level</InputLabel>
                                        <Select
                                            labelId="activity-level-select-label"
                                            id="activity-level-select"
                                            value={activityLevel}
                                            label="Activity Level"
                                            onChange={(e: SelectChangeEvent) => setActivityLevel(e.target.value as ActivityLevel)}
                                        >
                                            <MenuItem value="sedentary">Sedentary (little or no exercise)</MenuItem>
                                            <MenuItem value="light">Lightly Active (1–3 days/week)</MenuItem>
                                            <MenuItem value="moderate">Moderately Active (3–5 days/week)</MenuItem>
                                            <MenuItem value="active">Active (6–7 days/week)</MenuItem>
                                            <MenuItem value="veryActive">Very Active (hard & physical job)</MenuItem>
                                        </Select>
                                    </FormControl>

                                    <FormControl fullWidth>
                                        <FormLabel>Your Goal</FormLabel>
                                        <ToggleButtonGroup
                                            color="primary"
                                            value={goal}
                                            exclusive
                                            onChange={(_, newGoal) => newGoal && setGoal(newGoal)}
                                            fullWidth
                                        >
                                            <ToggleButton value="lose">Lose Weight</ToggleButton>
                                            <ToggleButton value="maintain">Maintain</ToggleButton>
                                            <ToggleButton value="gain">Gain Weight</ToggleButton>
                                        </ToggleButtonGroup>
                                    </FormControl>
                                    <motion.div whileTap={{ scale: 0.95 }}>
                                        <Button
                                            variant="contained"
                                            onClick={handleCalculate}
                                            sx={{
                                                py: 1.5,
                                                bgcolor: theme.palette.mode === 'dark' ? '#1565c0' : '#2e7d32',
                                                '&:hover': {
                                                    bgcolor: theme.palette.mode === 'dark' ? '#0d47a1' : '#1b5e20',
                                                }
                                            }}
                                            fullWidth
                                        >
                                            Calculate
                                        </Button>
                                    </motion.div>
                                </FormControl>
                            </motion.div>
                        </Grid>

                        {/* --- Results Display --- */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <AnimatePresence>
                                {results ? (
                                    <motion.div
                                        variants={sectionVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit={{ opacity: 0, scale: 0.9 }}
                                    >
                                        <Card
                                            variant="outlined"
                                            sx={{
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                bgcolor: theme.palette.background.paper
                                            }}
                                        >
                                            <CardContent sx={{ textAlign: 'center' }}>
                                                <Typography variant="h6" color="text.secondary">
                                                    Your Daily Goal
                                                </Typography>
                                                <Typography variant="h3" component="p" sx={{ fontWeight: 'bold', color: 'primary.main', my: 2 }}>
                                                    {results.calories} <span style={{ fontSize: '1.5rem' }}>kcal</span>
                                                </Typography>
                                                <Divider sx={{ my: 2 }} />
                                                <Grid container spacing={2}>
                                                    <Grid size={{ xs: 4 }}>
                                                        <Typography variant="h6">{results.protein}g</Typography>
                                                        <Typography color="text.secondary">Protein</Typography>
                                                    </Grid>
                                                    <Grid size={{ xs: 4 }}>
                                                        <Typography variant="h6">{results.carbs}g</Typography>
                                                        <Typography color="text.secondary">Carbs</Typography>
                                                    </Grid>
                                                    <Grid size={{ xs: 4 }}>
                                                        <Typography variant="h6">{results.fat}g</Typography>
                                                        <Typography color="text.secondary">Fat</Typography>
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ) : (
                                    <motion.div variants={sectionVariants}>
                                        <Typography color="text.secondary" align="center">
                                            Fill out the form to see your results
                                        </Typography>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </motion.div>
    );
};
