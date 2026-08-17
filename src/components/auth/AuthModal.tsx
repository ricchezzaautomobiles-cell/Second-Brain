import React, { useState } from 'react';
import { Mail, Lock, LogIn, UserPlus, AlertCircle, Sparkles, UserCheck, KeyRound, ArrowLeft } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const {
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signInAsGuest,
    sendResetEmail,
  } = useAuth();

  const parseFirebaseError = (err: any): string => {
    const code = err?.code || '';
    if (code === 'auth/operation-not-allowed' || code === 'auth/admin-restricted-operation') {
      return 'Anonymous Guest sign-in is currently disabled in your Unsent Auth Console. Please check Authentication > Sign-in method, click "Anonymous", and turn on "Enable".';
    }
    if (code === 'auth/unauthorized-domain') {
      const hostname = typeof window !== 'undefined' ? window.location.hostname : 'this domain';
      return `Domain Not Authorized for Google Sign-In: '${hostname}' is not listed in your Unsent Console under Authentication > Settings > Authorized domains. Please use Email/Password or Guest Mode to sign in instantly, or add '${hostname}' to authorized domains in your Unsent Console.`;
    }
    if (code === 'auth/email-already-in-use') {
      return 'An account with this email address already exists. Try signing in instead.';
    }
    if (code === 'auth/invalid-email') {
      return 'Please enter a valid email address.';
    }
    if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
      return 'Invalid email or password. Please check your credentials and try again.';
    }
    if (code === 'auth/weak-password') {
      return 'Password should be at least 6 characters long.';
    }
    if (code === 'auth/too-many-requests') {
      return 'Too many unsuccessful attempts. Please try again later.';
    }
    if (code === 'auth/popup-closed-by-user') {
      return 'Google sign-in popup was closed before completing authentication.';
    }
    return err?.message || 'Authentication failed. Please try again.';
  };

  const handleGuestSignIn = async () => {
    setErrorMsg(null);
    setInfoMsg(null);
    setLoading(true);
    try {
      await signInAsGuest(displayName || 'Guest Writer');
      setInfoMsg('Signed in as Guest!');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 400);
    } catch (err) {
      setErrorMsg(parseFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);

    setLoading(true);

    try {
      if (mode === 'reset') {
        await sendResetEmail(email);
        setInfoMsg(`Password reset link sent to ${email}. Check your inbox!`);
        return;
      }

      if (mode === 'signup') {
        await signUpWithEmail(email, password, displayName || 'Anonymous Writer');
        setInfoMsg('Account created successfully! Welcome to UNSENT.');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 800);
      } else {
        await signInWithEmail(email, password);
        setInfoMsg('Welcome back!');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 500);
      }
    } catch (err: any) {
      setErrorMsg(parseFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMsg(null);
    setInfoMsg(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      setInfoMsg('Signed in with Google!');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 500);
    } catch (err: any) {
      setErrorMsg(parseFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  const modalTitle = mode === 'login' ? 'Welcome Back to UNSENT' : mode === 'signup' ? 'Join UNSENT' : 'Reset Password';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
      <div className="space-y-4 pt-1">
        <p className="text-xs text-zinc-400">
          {mode === 'login'
            ? 'Sign in with your Unsent account to access your private messages, time capsules, and vault.'
            : mode === 'signup'
            ? 'Create an Unsent account to write, seal time capsules, and share anonymously.'
            : 'Enter your email address to receive a password reset link.'}
        </p>

        {errorMsg && (
          <div className="rounded-xl bg-zinc-900 border border-zinc-700 p-3 flex items-start gap-2 text-white text-xs">
            <AlertCircle className="h-4 w-4 shrink-0 text-zinc-300 mt-0.5" />
            <div className="space-y-2">
              <p>{errorMsg}</p>
            </div>
          </div>
        )}

        {infoMsg && (
          <div className="rounded-xl bg-zinc-900 border border-zinc-700 p-3 flex items-start gap-2 text-white text-xs">
            <Sparkles className="h-4 w-4 shrink-0 text-white mt-0.5" />
            <span>{infoMsg}</span>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-3">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Display Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Quiet Observer"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full rounded-xl bg-black border border-white/20 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl bg-black border border-white/20 pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white"
              />
            </div>
          </div>

          {mode !== 'reset' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-zinc-300">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => { setMode('reset'); setErrorMsg(null); setInfoMsg(null); }}
                    className="text-[11px] text-zinc-400 hover:text-white underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl bg-black border border-white/20 pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white"
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-2"
            loading={loading}
            icon={
              mode === 'login' ? (
                <LogIn className="h-4 w-4" />
              ) : mode === 'signup' ? (
                <UserPlus className="h-4 w-4" />
              ) : (
                <KeyRound className="h-4 w-4" />
              )
            }
          >
            {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Unsent Account' : 'Send Reset Link'}
          </Button>
        </form>

        {mode === 'reset' ? (
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMsg(null); setInfoMsg(null); }}
              className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
            </button>
          </div>
        ) : (
          <>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                <span className="bg-black px-2 text-zinc-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                className="w-full text-xs"
                onClick={handleGuestSignIn}
                disabled={loading}
                icon={<UserCheck className="h-4 w-4 text-white" />}
              >
                Guest Mode
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full text-xs"
                onClick={handleGoogleAuth}
                disabled={loading}
                icon={
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                }
              >
                Google
              </Button>
            </div>

            <div className="text-center pt-2 text-xs text-zinc-400">
              {mode === 'login' ? (
                <span>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('signup'); setErrorMsg(null); setInfoMsg(null); }}
                    className="text-white font-semibold underline hover:text-zinc-200"
                  >
                    Sign up
                  </button>
                </span>
              ) : (
                <span>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setErrorMsg(null); setInfoMsg(null); }}
                    className="text-white font-semibold underline hover:text-zinc-200"
                  >
                    Sign in
                  </button>
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
