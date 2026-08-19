'use client';

import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, CheckCircle2, LogOut, Sparkles, UserCheck } from 'lucide-react';
import { useCurrentUser, loginWithGoogle, loginWithFacebook, clearUserSession } from '@/lib/auth';
import Image from 'next/image';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const currentUser = useCurrentUser();
  const [loadingProvider, setLoadingProvider] = useState<'google' | 'facebook' | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleGoogleLogin = () => {
    setLoadingProvider('google');
    setTimeout(() => {
      loginWithGoogle('ak42@iitbbs.ac.in', 'Abhishek Kumar');
      setLoadingProvider(null);
      setSuccessMessage('Successfully signed in with Google!');
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1200);
    }, 600);
  };

  const handleFacebookLogin = () => {
    setLoadingProvider('facebook');
    setTimeout(() => {
      loginWithFacebook('Abhishek Kumar');
      setLoadingProvider(null);
      setSuccessMessage('Successfully signed in with Facebook!');
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1200);
    }, 600);
  };

  const handleSignOut = () => {
    clearUserSession();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header decoration banner */}
        <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          {currentUser ? (
            /* Logged In View */
            <div className="text-center space-y-5">
              <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden border-2 border-blue-600/30 shadow-md relative">
                <Image
                  src="/founder.jpg"
                  alt={currentUser.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Authenticated via {currentUser.provider === 'google' ? 'Google' : 'Facebook'}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {currentUser.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {currentUser.email}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-left space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                  <span>Cloud Sync Status</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Active
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                  <span>Saved Tool Shortcuts</span>
                  <span className="font-semibold text-slate-900 dark:text-white">Enabled</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  Continue to Workspace
                </button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 text-slate-600 dark:text-slate-400 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            /* Sign In Options View */
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Account Access</span>
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Sign In to FinTools
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                  Access your customized financial calculations, saved schedules, and PDF bookmarks seamlessly.
                </p>
              </div>

              {successMessage && (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Login Buttons */}
              <div className="space-y-3 pt-1">
                {/* Google Sign In Button */}
                <button
                  type="button"
                  disabled={loadingProvider !== null}
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-sm shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {loadingProvider === 'google' ? (
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.12z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.13C3.26 21.43 7.31 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.13z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.57 1.24 6.58l4.04 3.13c.95-2.83 3.6-4.96 6.72-4.96z"
                      />
                    </svg>
                  )}
                  <span>Continue with Google</span>
                </button>

                {/* Facebook Sign In Button */}
                <button
                  type="button"
                  disabled={loadingProvider !== null}
                  onClick={handleFacebookLogin}
                  className="w-full flex items-center justify-center gap-3 p-3.5 rounded-2xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-sm shadow-md shadow-blue-600/20 hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
                >
                  {loadingProvider === 'facebook' ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  )}
                  <span>Continue with Facebook</span>
                </button>
              </div>

              {/* Privacy and Security Seal */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-start gap-2.5 text-[11px] text-slate-500 dark:text-slate-400">
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Your credentials are authenticated securely. FinTools strictly respects your privacy and will never post to your social feeds or sell your data.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
