import { useState } from 'react';
import { Alert, Box, Button, Card, CardContent, Container, Divider, TextField, Typography } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

export default function SettingsPage() {
  const { user, updateDisplayName, updateEmail, updatePassword, deleteAccount } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleProfileSave() {
    setStatus(null); setError(null); setLoading(true);
    try {
      if (displayName !== user?.displayName && displayName.trim()) {
        await updateDisplayName(displayName.trim());
      }
      if (email !== user?.email && email.trim()) {
        await updateEmail(email.trim(), currentPassword || undefined);
      }
      setStatus('Profile updated');
    } catch (e: any) {
      setError(e?.message || 'Failed to update');
    } finally { setLoading(false); }
  }

  async function handlePasswordChange() {
    setStatus(null); setError(null); setLoading(true);
    try {
      await updatePassword(newPassword, currentPassword || undefined);
      setNewPassword('');
      setStatus('Password updated');
    } catch (e: any) {
      setError(e?.message || 'Failed to change password');
    } finally { setLoading(false); }
  }

  async function handleDelete() {
    setStatus(null); setError(null); setLoading(true);
    try {
      await deleteAccount(currentPassword || undefined);
      setStatus('Account deleted');
    } catch (e: any) {
      setError(e?.message || 'Failed to delete account');
    } finally { setLoading(false); }
  }

  return (
    <Box sx={{ py: 6, minHeight: 'calc(100vh - 64px)' }}>
      <Container maxWidth="sm">
        <Typography variant="h4" fontWeight={700} gutterBottom>Settings</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Update your profile, security, or delete your account.
        </Typography>
        {(status || error) && (
          <Alert severity={error ? 'error' : 'success'} sx={{ mb: 2 }}>
            {error || status}
          </Alert>
        )}

        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ display: 'grid', gap: 2 }}>
            <Typography variant="h6">Profile</Typography>
            <TextField label="Display Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
            <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField label="Current Password (required for sensitive changes)" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            <Button variant="contained" onClick={handleProfileSave} disabled={loading}>Save Changes</Button>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ display: 'grid', gap: 2 }}>
            <Typography variant="h6">Security</Typography>
            <TextField label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <Button variant="outlined" onClick={handlePasswordChange} disabled={loading || newPassword.length < 6}>Change Password</Button>
          </CardContent>
        </Card>

        <Divider sx={{ my: 3 }} />

        <Card>
          <CardContent sx={{ display: 'grid', gap: 2 }}>
            <Typography variant="h6" color="error">Danger Zone</Typography>
            <Typography variant="body2" color="text.secondary">Deleting your account is irreversible. All your recipes will remain orphaned unless cleaned up via Firestore rules or scripts.</Typography>
            <Button color="error" variant="contained" onClick={handleDelete} disabled={loading}>Delete Account</Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
