import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Link as MuiLink,
  Tab,
  Tabs,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
  const { signIn, signUp, resetPassword, user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  if (user) {
    // Already logged in
    navigate('/dashboard');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (tab === 0) {
        await signIn(email, password);
      } else {
        await signUp(email, password, displayName || undefined);
      }
      navigate('/dashboard');
    } catch (e: any) {
      setError(e?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleReset() {
    setError(null);
    setLoading(true);
    try {
      await resetPassword(resetEmail || email);
      setResetSent(true);
    } catch (e: any) {
      setError(e?.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ py: 8, minHeight: 'calc(100vh - 64px)', bgcolor: 'background.default' }}>
      <Container maxWidth="sm">
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h4" align="center" gutterBottom fontWeight={700}>Welcome Back</Typography>
            <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
              Sign in to manage your recipes, or create an account to get started.
            </Typography>

            <Tabs value={tab} onChange={(_, v) => setTab(v)} centered sx={{ mb: 2 }}>
              <Tab label="Sign In" />
              <Tab label="Create Account" />
            </Tabs>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
              {tab === 1 && (
                <TextField label="Display Name" fullWidth value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
              )}
              <TextField label="Email" type="email" fullWidth required value={email} onChange={(e) => setEmail(e.target.value)} />
              <TextField label="Password" type="password" fullWidth required value={password} onChange={(e) => setPassword(e.target.value)} />

              <Button type="submit" variant="contained" size="large" disabled={loading}>
                {loading ? <CircularProgress size={22} /> : tab === 0 ? 'Sign In' : 'Create Account'}
              </Button>
              {tab === 0 && (
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  <MuiLink component="button" onClick={() => setResetOpen(true)}>Forgot password?</MuiLink>
                </Typography>
              )}
            </Box>

            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 2 }}>
              By continuing you agree to our <Link to="#">Terms</Link> and <Link to="#">Privacy Policy</Link>.
            </Typography>
          </CardContent>
        </Card>
      </Container>

      <Dialog open={resetOpen} onClose={() => { setResetOpen(false); setResetSent(false); }}>
        <DialogTitle>Password Reset</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          {resetSent ? (
            <Alert severity="success">If an account exists for that email, a reset link has been sent.</Alert>
          ) : (
            <TextField autoFocus margin="dense" label="Email" type="email" fullWidth value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setResetOpen(false); setResetSent(false); }}>Close</Button>
          {!resetSent && (
            <Button onClick={handleReset} disabled={loading} variant="contained">Send Reset Link</Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
