import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  updateProfile,
  updateEmail as fbUpdateEmail,
  updatePassword as fbUpdatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
  type User,
} from 'firebase/auth';
import { getAuthInstance } from '../firebase';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateDisplayName: (name: string) => Promise<void>;
  updateEmail: (email: string, currentPassword?: string) => Promise<void>;
  updatePassword: (newPassword: string, currentPassword?: string) => Promise<void>;
  deleteAccount: (currentPassword?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuthInstance();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, [auth]);

  async function signIn(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function signUp(email: string, password: string, displayName?: string) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }
  }

  async function signOut() {
    await fbSignOut(auth);
  }

  async function resetPassword(email: string) {
    await sendPasswordResetEmail(auth, email);
  }

  async function ensureRecentLogin(currentPassword?: string) {
    if (!auth.currentUser) return;
    if (!currentPassword) throw new Error('auth/requires-recent-login');
    const cred = EmailAuthProvider.credential(auth.currentUser.email || '', currentPassword);
    await reauthenticateWithCredential(auth.currentUser, cred);
  }

  async function updateDisplayName(name: string) {
    if (!auth.currentUser) throw new Error('No user');
    await updateProfile(auth.currentUser, { displayName: name });
  }

  async function updateEmail(email: string, currentPassword?: string) {
    if (!auth.currentUser) throw new Error('No user');
    try {
      await fbUpdateEmail(auth.currentUser, email);
    } catch (e: any) {
      if (e?.code === 'auth/requires-recent-login') {
        await ensureRecentLogin(currentPassword);
        await fbUpdateEmail(auth.currentUser, email);
      } else {
        throw e;
      }
    }
  }

  async function updatePassword(newPassword: string, currentPassword?: string) {
    if (!auth.currentUser) throw new Error('No user');
    try {
      await fbUpdatePassword(auth.currentUser, newPassword);
    } catch (e: any) {
      if (e?.code === 'auth/requires-recent-login') {
        await ensureRecentLogin(currentPassword);
        await fbUpdatePassword(auth.currentUser, newPassword);
      } else {
        throw e;
      }
    }
  }

  async function deleteAccount(currentPassword?: string) {
    if (!auth.currentUser) throw new Error('No user');
    try {
      await deleteUser(auth.currentUser);
    } catch (e: any) {
      if (e?.code === 'auth/requires-recent-login') {
        await ensureRecentLogin(currentPassword);
        await deleteUser(auth.currentUser);
      } else {
        throw e;
      }
    }
  }

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateDisplayName,
    updateEmail,
    updatePassword,
    deleteAccount,
  }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
