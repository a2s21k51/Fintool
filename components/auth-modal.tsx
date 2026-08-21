'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
  User,
  Sparkles,
  Check,
  Laptop,
  CreditCard,
  ArrowRight,
} from 'lucide-react';
import { useCurrentUser, updateGuestName, resetGuestSession } from '@/lib/auth';
import { useSubscription, resetToFreePlan } from '@/lib/subscription';
import { PricingModal } from '@/components/pricing-modal';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const currentUser = useCurrentUser();
  const currentSub = useSubscription();
  const [displayName, setDisplayName] = useState(currentUser.name);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [pricingModalOpen, setPricingModalOpen] = useState(false);

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

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (displayName.trim()) {
      updateGuestName(displayName.trim());
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 700);
    }
  };

  const handleReset = () => {
    resetGuestSession();
    resetToFreePlan();
    setDisplayName('Guest User');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 1200);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
        <div
          className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Accent Gradient */}
          <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500" />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6 sm:p-7 space-y-5">
            {/* Header */}
            <div className="text-center space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Guest Account & Subscription</span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Guest Profile Settings
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                Manage your local session and subscription plan. 100% private in-browser storage.
              </p>
            </div>

            {/* Active Guest Profile & Subscription Tier Badge */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-blue-500/20 shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {currentUser.name}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                    <span>Active Session</span>
                  </div>
                </div>
              </div>

              {/* Current Subscription Plan Status Box */}
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Subscription Tier
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-white">
                    <span>{currentSub.planName}</span>
                    {currentSub.tier !== 'free' && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                        {currentSub.cycle}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setPricingModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/80 text-blue-700 dark:text-blue-300 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer border border-blue-200 dark:border-blue-800"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>{currentSub.tier === 'free' ? 'Upgrade' : 'Manage'}</span>
                </button>
              </div>

              {/* Privacy & Storage Guarantee */}
              <div className="pt-1 grid grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <Laptop className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>Local Browser Storage</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>100% Private Data</span>
                </div>
              </div>
            </div>

            {/* Form to Customize Guest Display Name */}
            <form onSubmit={handleSaveName} className="space-y-3">
              <div className="space-y-1 text-left">
                <label htmlFor="guest-name-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Customize Name (Optional)
                </label>
                <div className="relative">
                  <input
                    id="guest-name-input"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. A Kumar"
                    maxLength={35}
                    className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden transition-all"
                  />
                </div>
              </div>

              {savedSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Profile updated!</span>
                </div>
              )}

              <div className="flex flex-col gap-2 pt-1">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Profile</span>
                </button>

                <div className="flex items-center gap-2">
                  <Link
                    href="/pricing"
                    onClick={onClose}
                    className="flex-1 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-center font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>View All Plans</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    title="Reset Session"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Privacy Seal */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-start gap-2 text-[11px] text-slate-500 dark:text-slate-400 text-left">
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                No passwords or email OTPs required. All calculations and PDFs remain entirely local on your device.
              </p>
            </div>
          </div>
        </div>
      </div>

      <PricingModal
        isOpen={pricingModalOpen}
        onClose={() => setPricingModalOpen(false)}
      />
    </>
  );
}
