'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { createSupabaseClient } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, ArrowLeft } from 'lucide-react';
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import Image from 'next/image';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignup?: () => void; // Optional if not implemented
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const supabase = createSupabaseClient();

  useEffect(() => {
    setMounted(true);
    // Set initial mode based on current pathname
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      if (pathname === '/signup') {
        setMode('signup');
      } else {
        setMode('login');
      }
    }
    return () => setMounted(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Get redirect URL from query params or default
      const urlParams = new URLSearchParams(window.location.search);
      const redirectTo = urlParams.get('next') || '/playground/hello-solana';
      setTimeout(() => {
        onClose();
        router.push(decodeURIComponent(redirectTo));
      }, 100);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Get redirect URL from query params or default
      const urlParams = new URLSearchParams(window.location.search);
      const redirectTo = urlParams.get('next') || '/playground/hello-solana';
      
      // If user is immediately signed in (e.g., OAuth or auto-confirm), close modal
      if (data.user && data.session) {
        setTimeout(() => {
          onClose();
          router.push(decodeURIComponent(redirectTo));
        }, 100);
      } else {
        // Show success message for email confirmation
        setError('');
        setLoading(false);
        // Redirect to home after showing success
        setTimeout(() => {
          onClose();
          router.push('/');
        }, 2000);
      }
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'github' | 'twitter') => {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectTo = urlParams.get('next') || '/playground/hello-solana';
    const callbackUrl = process.env.NEXT_PUBLIC_APP_URL 
      ? `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
      : `${window.location.origin}/auth/callback`;
    const redirectParam = encodeURIComponent(redirectTo);
    const finalCallbackUrl = `${callbackUrl}?redirect=${redirectParam}`;

    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: finalCallbackUrl,
      },
    });
  };

  const handleBackToHome = () => {
    onClose();
    router.push('/');
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-[#0A0A0A] z-[9999]"
            onClick={onClose}
          >
            {/* Grid Background */}
            <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
            {/* Blur Overlay */}
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm pointer-events-none" />
          </motion.div>
          <div
            className="fixed inset-0 z-[10000] pointer-events-none flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-6xl mx-4 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
            <div className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex">
              {/* Grid Background on Modal */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none opacity-50" />
              
              {/* Left Side - Login/Signup Form */}
              <div className="flex-1 p-8 md:p-12 relative z-10 flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <button
                    onClick={handleBackToHome}
                    className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to home
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <X className="w-5 h-5 text-white/60" />
                  </button>
                </div>

                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2">
                    {mode === 'login' ? 'Welcome back' : 'Create an account'}
                  </h2>
                  <p className="text-white/60">
                    {mode === 'login' 
                      ? 'Sign in to your account' 
                      : 'Start learning Solana development today'}
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="flex-1 flex flex-col">
                  <div className="flex-1 flex flex-col justify-center">
                    <div className={mode === 'login' ? 'space-y-4' : 'space-y-4'}>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-white">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#14F195] transition-colors text-white"
                            placeholder="you@example.com"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-white">Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#14F195] transition-colors text-white"
                            placeholder={mode === 'login' ? '••••••••' : 'Minimum 8 characters'}
                            required
                          />
                        </div>
                      </div>

                      {mode === 'signup' && (
                        <div>
                          <label className="block text-sm font-medium mb-2 text-white">Confirm Password</label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#14F195] transition-colors text-white"
                              placeholder="••••••••"
                              required
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-[#14F195] to-[#00D18C] text-black font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <LoadingSpinner size="sm" text="Loading..." className="text-black/70" />
                        <span>{mode === 'login' ? 'Signing in...' : 'Creating account...'}</span>
                      </>
                    ) : (
                      mode === 'login' ? 'Sign in' : 'Create account'
                    )}
                  </button>
                </form>

                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-sm text-white/40">or</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => handleOAuthLogin('github')}
                    className="w-full py-3 rounded-lg border border-white/10 hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    Continue with GitHub
                  </button>

                  <button
                    onClick={() => handleOAuthLogin('twitter')}
                    className="w-full py-3 rounded-lg border border-white/10 hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    Continue with X
                  </button>

                  <button
                    onClick={() => handleOAuthLogin('google')}
                    className="w-full py-3 rounded-lg border border-white/10 hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </button>
                </div>

                <p className="text-center text-sm text-white/60 mt-6">
                  {mode === 'login' ? (
                    <>
                      Don&apos;t have an account?{' '}
                      <button
                        onClick={() => {
                          setMode('signup');
                          setError('');
                        }}
                        className="text-[#14F195] hover:underline font-medium"
                      >
                        Sign up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <button
                        onClick={() => {
                          setMode('login');
                          setError('');
                        }}
                        className="text-[#14F195] hover:underline font-medium"
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </p>
              </div>

              {/* Divider Line */}
              <div className="hidden md:block w-px bg-white/10 relative z-10" />
              
              {/* Right Side - Logo */}
              <div className="hidden md:flex flex-1 bg-[#0a0a0a] items-center justify-center p-8 relative z-10">
                <div className="text-center space-y-6">
                  <div className="w-48 h-48 mx-auto flex items-center justify-center">
                    <Image
                      src="/logo/og.png"
                      alt="Solana Atlas Logo"
                      width={192}
                      height={192}
                      className="w-full h-full object-contain"
                      priority
                      unoptimized
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white">Solana Atlas</h3>
                    <p className="text-white/60 text-sm max-w-xs">
                      The Solana playground you needed. Run real programs. Watch state transform.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;

  return createPortal(modalContent, document.body);
}
