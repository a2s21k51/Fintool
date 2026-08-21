'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Check,
  X,
  Sparkles,
  ShieldCheck,
  Zap,
  Lock,
  ArrowRight,
  HelpCircle,
  FileText,
  Calculator,
  Building2,
  Receipt,
  Download,
  CreditCard,
  RotateCcw,
  CheckCircle2,
  ChevronDown,
  QrCode,
  Landmark,
} from 'lucide-react';
import {
  SUBSCRIPTION_PLANS,
  SubscriptionTier,
  BillingCycle,
  useSubscription,
  upgradeSubscription,
  resetToFreePlan,
} from '@/lib/subscription';
import { PricingModal } from '@/components/pricing-modal';

export default function PricingPage() {
  const currentSub = useSubscription();
  const [cycle, setCycle] = useState<BillingCycle>('yearly');
  const [pricingModalOpen, setPricingModalOpen] = useState(false);
  const [targetTier, setTargetTier] = useState<SubscriptionTier>('pro');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleOpenPlan = (tier: SubscriptionTier) => {
    setTargetTier(tier);
    setPricingModalOpen(true);
  };

  const faqs = [
    {
      q: 'Do you offer a 30-day money-back guarantee?',
      a: 'Yes, 100%! We provide an unconditional, no-questions-asked 30-day money-back guarantee on all Pro and CA Business plans (both monthly and annual). If you feel FinTools does not meet your productivity needs, simply email ak42@iitbbs.ac.in or request a refund from your dashboard within 30 days of purchase for a 100% full refund with zero cancellation fees.',
    },
    {
      q: 'Can I use FinTools.in for free without paying?',
      a: 'Yes, absolutely! All core financial calculators (EMI, SIP, PPF, GST, FD, Income Tax) and basic PDF merge/split tools are 100% free forever for personal use with zero ads or signups.',
    },
    {
      q: 'Why should I upgrade to FinTools Pro or Business?',
      a: 'FinTools Pro unlocks batch PDF processing without file count limits, high-resolution 200KB Govt portal presets (for SSC, UPSC, EPFO uploads), custom watermark stamping, and exportable amortization tables with amortization charts. The Business plan adds white-label CA branding and multi-client vaults.',
    },
    {
      q: 'How does the Annual / Yearly billing discount work?',
      a: 'When you choose Yearly billing, you get up to 37% discount compared to monthly payments. For instance, FinTools Pro is ₹1,499/year (which works out to only ₹125/month compared to ₹199/month on the monthly plan).',
    },
    {
      q: 'Which payment methods does Razorpay support for FinTools?',
      a: 'Through our official Razorpay integration, we support all major Indian and international payment modes including UPI (Google Pay, PhonePe, Paytm, BHIM, CRED), Credit/Debit cards (Visa, MasterCard, RuPay, Amex), 50+ Net Banking options (SBI, HDFC, ICICI, Axis, Kotak), and popular wallets with 256-bit bank-grade encryption.',
    },
    {
      q: 'Are payments and files secure?',
      a: 'FinTools.in is engineered with a strict 100% client-side privacy architecture. Your payments are processed securely via Razorpay with 256-bit SSL encryption, and your PDF documents and financial calculation parameters are computed strictly inside your browser sandbox.',
    },
    {
      q: 'Can Chartered Accountants (CAs) and Tax Consultants claim GST input credit?',
      a: 'Yes, our Business subscription is 100% tax-deductible as a business software expense under Indian Income Tax regulations. GST invoice receipts are generated with your firm registration details.',
    },
    {
      q: 'Can I cancel or switch plans at any time?',
      a: 'Yes, you can upgrade, downgrade, or cancel your subscription at any moment with 1-click from your account settings without penalty.',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-16 md:pb-20 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-blue-500/10 via-indigo-500/10 to-amber-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 text-xs font-bold text-blue-800 dark:text-blue-300 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Simple, Transparent & Value-Packed Pricing</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white max-w-3xl mx-auto leading-[1.15]">
            Power Up Your <span className="text-blue-600 dark:text-blue-400">Financial & PDF</span> Workflow
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Free forever for everyday math. Upgrade to Pro or CA Business for unlimited batch PDF compression, custom white-label reports, and high-speed financial modelling.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="pt-4 flex items-center justify-center">
            <div className="inline-flex items-center p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
              <button
                type="button"
                onClick={() => setCycle('monthly')}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  cycle === 'monthly'
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setCycle('yearly')}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  cycle === 'yearly'
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <span>Yearly Billing</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-amber-950 uppercase tracking-tight animate-pulse">
                  Save 37%
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
        {/* Active Membership Banner (if subscribed) */}
        {currentSub.tier !== 'free' && (
          <div className="p-5 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 font-bold">
                <Sparkles className="w-6 h-6 text-amber-300 fill-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider bg-white/25 px-2 py-0.5 rounded-full text-white">
                    Current Plan
                  </span>
                  <span className="text-sm font-bold text-blue-100">
                    {currentSub.planName} ({currentSub.cycle === 'yearly' ? 'Yearly' : 'Monthly'})
                  </span>
                </div>
                <div className="text-lg font-black text-white">
                  VIP Pro Membership Active
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleOpenPlan(currentSub.tier === 'pro' ? 'business' : 'pro')}
                className="px-4 py-2 rounded-xl bg-white text-blue-900 font-bold text-xs hover:bg-blue-50 transition-colors shadow-sm cursor-pointer"
              >
                Change Billing / Tier
              </button>
              <button
                type="button"
                onClick={() => resetToFreePlan()}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        )}

        {/* Pricing Table Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isPro = plan.tier === 'pro';
            const isBusiness = plan.tier === 'business';
            const isFree = plan.tier === 'free';
            const isCurrent = currentSub.tier === plan.tier;
            const priceINR = cycle === 'yearly' ? plan.yearlyPriceINR : plan.monthlyPriceINR;
            const monthlyEquiv = cycle === 'yearly' && plan.yearlyPriceINR > 0 ? Math.round(plan.yearlyPriceINR / 12) : plan.monthlyPriceINR;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between rounded-3xl p-6 sm:p-8 transition-all duration-200 border ${
                  isPro
                    ? 'bg-white dark:bg-slate-900 border-blue-600 dark:border-blue-500 shadow-2xl shadow-blue-500/10 ring-2 ring-blue-600/30'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-md hover:shadow-lg'
                }`}
              >
                {/* Popular Pill */}
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-md">
                    ⭐ Most Popular Choice
                  </div>
                )}

                {isBusiness && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                    For CAs & Businesses
                  </div>
                )}

                <div className="space-y-6">
                  {/* Title & Description */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                        {plan.name}
                      </h3>
                      {isCurrent && (
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                          Active Plan
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed min-h-[40px]">
                      {plan.tagline}
                    </p>
                  </div>

                  {/* Price Banner */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                    {priceINR === 0 ? (
                      <div>
                        <div className="text-3xl font-black text-slate-900 dark:text-white">
                          ₹0
                        </div>
                        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          Forever free • Zero credit card required
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                            ₹{priceINR.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs font-semibold text-slate-500">
                            /{cycle === 'yearly' ? 'year' : 'month'}
                          </span>
                        </div>
                        {cycle === 'yearly' ? (
                          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 pt-1">
                            ₹{monthlyEquiv}/month billed annually (Save 37%)
                          </div>
                        ) : (
                          <div className="text-xs text-slate-500 pt-1">
                            Billed monthly • Cancel anytime
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3 pt-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      What&apos;s Included:
                    </div>
                    <ul className="space-y-2.5 text-xs sm:text-sm">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          {feature.included ? (
                            <div className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                              <Check className="w-3 h-3" />
                            </div>
                          ) : (
                            <div className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                              <X className="w-3 h-3" />
                            </div>
                          )}
                          <span
                            className={
                              feature.included
                                ? feature.highlight
                                  ? 'font-bold text-slate-900 dark:text-white'
                                  : 'text-slate-700 dark:text-slate-300'
                                : 'text-slate-400 dark:text-slate-600 line-through'
                            }
                          >
                            {feature.title}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Call to action button & Supported Payment Row */}
                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 space-y-3.5">
                  {isFree ? (
                    <button
                      type="button"
                      disabled={isCurrent}
                      onClick={() => {
                        resetToFreePlan();
                      }}
                      className="w-full py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs sm:text-sm transition-all cursor-pointer"
                    >
                      {isCurrent ? 'Current Free Plan' : 'Select Free Plan'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenPlan(plan.tier)}
                      className={`w-full py-3.5 px-4 rounded-2xl font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        isPro
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25'
                          : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100'
                      }`}
                    >
                      <span>
                        {isCurrent ? 'Manage / Renew Plan' : `Get ${plan.name}`}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}

                  {/* Supported Payment Badges */}
                  {!isFree ? (
                    <div className="space-y-1.5 text-center">
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold text-[10px] border border-slate-200/60 dark:border-slate-700/60">
                          <QrCode className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          <span>UPI / QR</span>
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold text-[10px] border border-slate-200/60 dark:border-slate-700/60">
                          <CreditCard className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                          <span>Cards (Visa/MC/RuPay)</span>
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold text-[10px] border border-slate-200/60 dark:border-slate-700/60">
                          <Landmark className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                          <span>Netbanking</span>
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 dark:text-slate-500">
                        <Lock className="w-2.5 h-2.5 text-emerald-500" />
                        <span>Instant access • 256-bit encrypted • Cancel anytime</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center pt-0.5">
                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-medium text-[10px] border border-emerald-200 dark:border-emerald-800">
                        <ShieldCheck className="w-3 h-3 text-emerald-500" />
                        <span>No credit card or payment required</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Matrix Section */}
        <section className="pt-8 space-y-6">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Compare Plan Features Side-by-Side
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Clear breakdown of computational capabilities, limits, and team features.
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
                  <th className="p-4 sm:p-5 font-extrabold text-slate-900 dark:text-white">
                    Feature & Capabilities
                  </th>
                  <th className="p-4 sm:p-5 font-extrabold text-slate-900 dark:text-white text-center w-40">
                    Starter (Free)
                  </th>
                  <th className="p-4 sm:p-5 font-extrabold text-blue-600 dark:text-blue-400 text-center w-44">
                    FinTools Pro
                  </th>
                  <th className="p-4 sm:p-5 font-extrabold text-amber-600 dark:text-amber-400 text-center w-48">
                    CA & Business
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                <tr>
                  <td className="p-4 sm:p-5 font-semibold">Core Financial Calculators (EMI, SIP, GST, PPF)</td>
                  <td className="p-4 sm:p-5 text-center text-emerald-600 font-bold">Unlimited</td>
                  <td className="p-4 sm:p-5 text-center text-emerald-600 font-bold">Unlimited</td>
                  <td className="p-4 sm:p-5 text-center text-emerald-600 font-bold">Unlimited</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold">PDF Batch Processing Limit</td>
                  <td className="p-4 sm:p-5 text-center text-slate-500">Up to 3 files</td>
                  <td className="p-4 sm:p-5 text-center font-bold text-blue-600">Unlimited</td>
                  <td className="p-4 sm:p-5 text-center font-bold text-amber-600">Unlimited Batch</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold">Govt. Portal & KYC Preset (<span className="text-blue-500 font-semibold">&lt;200KB</span> SSC/UPSC)</td>
                  <td className="p-4 sm:p-5 text-center text-slate-400"><X className="w-4 h-4 mx-auto" /></td>
                  <td className="p-4 sm:p-5 text-center text-emerald-600"><Check className="w-4 h-4 mx-auto" /></td>
                  <td className="p-4 sm:p-5 text-center text-emerald-600"><Check className="w-4 h-4 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold">Export Amortization Schedules (CSV & Excel)</td>
                  <td className="p-4 sm:p-5 text-center text-slate-400"><X className="w-4 h-4 mx-auto" /></td>
                  <td className="p-4 sm:p-5 text-center text-emerald-600"><Check className="w-4 h-4 mx-auto" /></td>
                  <td className="p-4 sm:p-5 text-center text-emerald-600"><Check className="w-4 h-4 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold">White-Label Reports (Add CA Name & Firm Logo)</td>
                  <td className="p-4 sm:p-5 text-center text-slate-400"><X className="w-4 h-4 mx-auto" /></td>
                  <td className="p-4 sm:p-5 text-center text-slate-400"><X className="w-4 h-4 mx-auto" /></td>
                  <td className="p-4 sm:p-5 text-center text-emerald-600"><Check className="w-4 h-4 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold">Multi-Client Calculation Vault</td>
                  <td className="p-4 sm:p-5 text-center text-slate-400"><X className="w-4 h-4 mx-auto" /></td>
                  <td className="p-4 sm:p-5 text-center text-slate-400"><X className="w-4 h-4 mx-auto" /></td>
                  <td className="p-4 sm:p-5 text-center text-emerald-600"><Check className="w-4 h-4 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold">100% Client-Side Privacy Architecture</td>
                  <td className="p-4 sm:p-5 text-center text-emerald-600 font-bold">Yes</td>
                  <td className="p-4 sm:p-5 text-center text-emerald-600 font-bold">Yes</td>
                  <td className="p-4 sm:p-5 text-center text-emerald-600 font-bold">Yes</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold">Customer Support</td>
                  <td className="p-4 sm:p-5 text-center text-slate-500">Community</td>
                  <td className="p-4 sm:p-5 text-center text-slate-700 dark:text-slate-300">Priority Email</td>
                  <td className="p-4 sm:p-5 text-center font-bold text-slate-900 dark:text-white">VIP WhatsApp & Desk</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQs Accordion */}
        <section className="pt-4 max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Got questions about subscriptions, billing, or client privacy?
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 dark:text-white cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180 text-blue-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3 animate-in fade-in duration-150">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Security & Money-Back Seal */}
        <div className="p-8 rounded-3xl bg-slate-100 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                30-Day Money-Back Guarantee & 100% Client-Side Privacy
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg">
                Try FinTools Pro risk-free. If you are not completely satisfied within 30 days, receive a prompt 100% refund. All calculations run strictly in your local browser sandbox.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleOpenPlan('pro')}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all shrink-0 cursor-pointer"
          >
            Upgrade to FinTools Pro
          </button>
        </div>
      </main>

      {/* Global Pricing Checkout Modal */}
      <PricingModal
        isOpen={pricingModalOpen}
        onClose={() => setPricingModalOpen(false)}
        defaultTier={targetTier}
      />
    </div>
  );
}
