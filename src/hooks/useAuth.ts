import { useEffect, useState, useCallback } from 'react';
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut as firebaseSignOut,
  updateProfile as firebaseUpdateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  FirebaseUser,
} from '../lib/firebase';
import { Profile } from '../types';

export interface AppUser {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
}

export function isOwnerUser(user: AppUser | null): boolean {
  if (!user || !user.email) return false;
  return user.email.toLowerCase() === 'sultanharis655@gmail.com';
}

export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const fetchOrCreateProfile = useCallback(async (fbUser: FirebaseUser, customDisplayName?: string) => {
    try {
      const userRef = doc(db, 'profiles', fbUser.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        let nameToUse = data.display_name || fbUser.displayName || 'Anonymous Writer';
        
        // Update display_name if a non-default customDisplayName is supplied
        if (customDisplayName && customDisplayName !== 'Guest Writer' && customDisplayName !== 'Anonymous Writer' && customDisplayName !== data.display_name) {
          nameToUse = customDisplayName;
          await setDoc(userRef, { display_name: customDisplayName, updated_at: new Date().toISOString() }, { merge: true }).catch(() => {});
        }

        setProfile({
          id: fbUser.uid,
          display_name: nameToUse,
          avatar_url: data.avatar_url || fbUser.photoURL || null,
          created_at: data.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      } else {
        const newProfile: Profile = {
          id: fbUser.uid,
          display_name: customDisplayName || fbUser.displayName || (fbUser.isAnonymous ? 'Guest Writer' : 'Anonymous Writer'),
          avatar_url: fbUser.photoURL || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        await setDoc(userRef, {
          ...newProfile,
          email: fbUser.email || null,
        });
        setProfile(newProfile);
      }
    } catch (err: any) {
      console.error('Error in fetchOrCreateProfile:', err);
      // Fallback in-memory profile
      setProfile({
        id: fbUser.uid,
        display_name: customDisplayName || fbUser.displayName || (fbUser.isAnonymous ? 'Guest Writer' : 'Anonymous Writer'),
        avatar_url: fbUser.photoURL || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const appUserObj: AppUser = {
          id: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName,
          photoURL: fbUser.photoURL,
          isAnonymous: fbUser.isAnonymous,
        };
        setUser(appUserObj);
        await fetchOrCreateProfile(fbUser);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchOrCreateProfile]);

  const signUpWithEmail = async (email: string, pass: string, displayName?: string) => {
    setAuthError(null);
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      if (displayName && cred.user) {
        await firebaseUpdateProfile(cred.user, { displayName });
      }
      await fetchOrCreateProfile(cred.user, displayName);
    } catch (err: any) {
      setAuthError(err?.message || 'Failed to create account.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    setAuthError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: any) {
      setAuthError(err?.message || 'Failed to sign in.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setAuthError(null);
    setLoading(true);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      await fetchOrCreateProfile(res.user);
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        setAuthError(err?.message || 'Google sign in failed.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInAsGuest = async (displayName: string = 'Guest Writer') => {
    setAuthError(null);
    setLoading(true);
    try {
      const res = await signInAnonymously(auth);
      if (res && res.user) {
        await firebaseUpdateProfile(res.user, { displayName }).catch(() => {});
        await fetchOrCreateProfile(res.user, displayName);
      }
    } catch (err: any) {
      if (err?.code === 'auth/admin-restricted-operation' || err?.code === 'auth/operation-not-allowed') {
        console.warn('Firebase Anonymous auth disabled in Console. Activating fallback guest mode.', err);
        const guestUid = 'guest_' + Math.random().toString(36).substring(2, 9);
        const guestUserObj: AppUser = {
          id: guestUid,
          email: null,
          displayName: displayName || 'Guest Writer',
          photoURL: null,
          isAnonymous: true,
        };
        const guestProfile: Profile = {
          id: guestUid,
          display_name: displayName || 'Guest Writer',
          avatar_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setUser(guestUserObj);
        setProfile(guestProfile);
        return;
      }
      setAuthError(err?.message || 'Guest sign in failed.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendResetEmail = async (email: string) => {
    setAuthError(null);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      setAuthError(err?.message || 'Password reset failed.');
      throw err;
    }
  };

  const signOut = async () => {
    setAuthError(null);
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setProfile(null);
    } catch (err: any) {
      setAuthError(err?.message || 'Sign out failed.');
    }
  };

  return {
    user,
    profile,
    loading,
    authError,
    isConfigured: true,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signInAsGuest,
    sendResetEmail,
    signOut,
    refreshProfile: () => {
      if (auth.currentUser) {
        fetchOrCreateProfile(auth.currentUser);
      }
    },
  };
}
