'use client';

import React, { useState } from 'react';
import {
  X,
  Check,
  Sparkles,
  ShieldCheck,
  CreditCard,
  QrCode,
  Landmark,
  Lock,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  SUBSCRIPTION_PLANS,
  SubscriptionTier,
  BillingCycle,
  useSubscription,
  upgradeSubscription,
  resetToFreePlan,
} from '@/lib/subscription';
import { useCurrentUser } from '@/lib/auth';
import { initiateRazorpayPayment } from '@/lib/razorpay-client';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTier?: SubscriptionTier;
}

export function PricingModal({ isOpen, onClose, defaultTier = 'pro' }: PricingModalProps) {
  const currentSub = useSubscription();
  const currentUser = useCurrentUser();
  const [cycle, setCycle] = useState<BillingCycle>('yearly');
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>(
    currentSub.tier === 'free' ? defaultTier : currentSub.tier
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ paymentId: string; planName: string } | null>(null);

  if (!isOpen) return null;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTier === 'free') {
      resetToFreePlan();
      onClose();
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    await initiateRazorpayPayment({
      tier: selectedTier,
      cycle,
      userName: currentUser.name || 'FinTools User',
      userEmail: currentUser.id || 'user@fintools.in',
      onSuccess: (result) => {
        setIsProcessing(false);
        const plan = SUBSCRIPTION_PLANS.find((p) => p.tier === selectedTier) || SUBSCRIPTION_PLANS[1];
        
        // Upgrade local subscription state with verified Razorpay payment ID
        upgradeSubscription(
          selectedTier,
          cycle,
          'Razorpay (UPI / Card / Netbanking)',
          result.razorpay_payment_id
        );

        setSuccessInfo({
          paymentId: result.razorpay_payment_id,
          planName: plan.name,
        });

        // Trigger celebratory confetti
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore if canvas not ready
        }

        setTimeout(() => {
          setSuccessInfo(null);
          onClose();
        }, 2200);
      },
      onError: (errMsg) => {
        setIsProcessing(false);
        setErrorMessage(errMsg || 'Razorpay payment could not be processed. Please try again.');
      },
      onDismiss: () => {
        setIsProcessing(false);
      },
    });
  };

  const handleDowngrade = () => {
    resetToFreePlan();
    setSelectedTier('free');
    onClose();
  };

  const selectedPlan = SUBSCRIPTION_PLANS.find((p) => p.tier === selectedTier) || SUBSCRIPTION_PLANS[1];
  const price = cycle === 'yearly' ? selectedPlan.yearlyPriceINR : selectedPlan.monthlyPriceINR;
  const isCurrentlyActive = currentSub.tier === selectedTier && currentSub.cycle === cycle && currentSub.status === 'active';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gradient Banner */}
        <div className="h-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-5 sm:p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2 max-w-lg mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Razorpay Instant Checkout</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Upgrade to FinTools Pro & CA
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Instant activation via Razorpay UPI, Debit/Credit Cards & Net Banking. 100% Secure.
            </p>
          </div>

          {/* Billing Cycle Switcher */}
          <div className="flex items-center justify-center">
            <div className="inline-flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setCycle('monthly')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  cycle === 'monthly'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setCycle('yearly')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  cycle === 'yearly'
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <span>Yearly Billing</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-amber-950 uppercase tracking-tight">
                  Save 37%
                </span>
              </button>
            </div>
          </div>

          {/* Plan Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SUBSCRIPTION_PLANS.map((plan) => {
              const isSelected = selectedTier === plan.tier;
              const isCurrent = currentSub.tier === plan.tier;
              const planPrice = cycle === 'yearly' ? plan.yearlyPriceINR : plan.monthlyPriceINR;
              const perMonthEquiv = cycle === 'yearly' && plan.yearlyPriceINR > 0 ? Math.round(plan.yearlyPriceINR / 12) : plan.monthlyPriceINR;

              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedTier(plan.tier)}
                  className={`relative flex flex-col justify-between p-5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-600 dark:border-blue-500 ring-2 ring-blue-600/20 shadow-lg'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                      Most Popular
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                        {plan.name}
                      </h4>
                      {isCurrent && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          Active
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 min-h-[32px] leading-relaxed">
                      {plan.tagline}
                    </p>

                    {/* Price display */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                      {planPrice === 0 ? (
                        <div className="text-2xl font-black text-slate-900 dark:text-white">
                          ₹0 <span className="text-xs font-semibold text-slate-400">/ forever</span>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-slate-900 dark:text-white">
                              ₹{planPrice.toLocaleString('en-IN')}
                            </span>
                            <span className="text-xs font-semibold text-slate-500">
                              /{cycle === 'yearly' ? 'year' : 'month'}
                            </span>
                          </div>
                          {cycle === 'yearly' && (
                            <div className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                              Just ₹{perMonthEquiv}/mo (Billed annually)
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Features list bullet points */}
                    <div className="space-y-2 pt-2 text-xs">
                      {plan.features.slice(0, 4).map((f, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                          <span className={`leading-tight ${f.highlight ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                            {f.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span>{isSelected ? 'Selected' : 'Select Plan'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Checkout / Payment Section for Selected Plan */}
          {selectedTier !== 'free' ? (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/80 dark:border-slate-700/80">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Razorpay Gateway Checkout
                  </div>
                  <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {selectedPlan.name} ({cycle === 'yearly' ? 'Annual Subscription' : 'Monthly Subscription'})
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-blue-600 dark:text-blue-400">
                    ₹{price.toLocaleString('en-IN')} <span className="text-xs font-medium text-slate-500">incl. GST</span>
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successInfo && (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-semibold flex items-center gap-3 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <div className="font-bold">Payment Verified via Razorpay!</div>
                    <div className="text-[11px] text-emerald-700 dark:text-emerald-300 font-normal">
                      Transaction ID: <code className="font-mono bg-emerald-100 dark:bg-emerald-900/60 px-1 py-0.5 rounded">{successInfo.paymentId}</code>. {successInfo.planName} is now active.
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons & Payment Badges */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={isProcessing || isCurrentlyActive}
                    className="flex-1 py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-extrabold text-sm shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Opening Razorpay Gateway...</span>
                      </>
                    ) : isCurrentlyActive ? (
                      <span>Already on this plan</span>
                    ) : (
                      <>
                        <span>Pay ₹{price.toLocaleString('en-IN')} with Razorpay</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {currentSub.tier !== 'free' && (
                    <button
                      type="button"
                      onClick={handleDowngrade}
                      className="py-3.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      title="Switch to Free Starter Plan"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Revert to Free</span>
                    </button>
                  )}
                </div>

                {/* Supported Payment Badges Row */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Razorpay Supports:
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-[10px]">
                      <QrCode className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span>GPay / PhonePe / UPI</span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-[10px]">
                      <CreditCard className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                      <span>Visa / MC / RuPay</span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-[10px]">
                      <Landmark className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                      <span>50+ Net Banks</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500">
                    <Lock className="w-3 h-3 text-emerald-500" />
                    <span>256-bit Bank Grade Security</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="text-xs text-slate-600 dark:text-slate-300">
                You are viewing the <strong className="text-slate-900 dark:text-white">Free Starter Plan</strong>. All standard calculators are 100% unlocked forever.
              </div>
              {currentSub.tier !== 'free' && (
                <button
                  type="button"
                  onClick={handleDowngrade}
                  className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-300 cursor-pointer"
                >
                  Switch to Free
                </button>
              )}
            </div>
          )}

          {/* Privacy & Guarantee footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>100% Private Client-Side Compute Guarantee</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-blue-500" />
              <span>Instant Razorpay Settlement • Cancel Anytime</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
