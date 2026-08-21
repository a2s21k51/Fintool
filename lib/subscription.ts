'use client';

import { useSyncExternalStore } from 'react';

export type SubscriptionTier = 'free' | 'pro' | 'business';
export type BillingCycle = 'monthly' | 'yearly';
export type Currency = 'INR' | 'USD';

export interface PlanFeature {
  title: string;
  included: boolean;
  highlight?: boolean;
}

export interface SubscriptionPlan {
  id: string;
  tier: SubscriptionTier;
  name: string;
  badge?: string;
  tagline: string;
  monthlyPriceINR: number;
  yearlyPriceINR: number;
  monthlyPriceUSD: number;
  yearlyPriceUSD: number;
  popular?: boolean;
  features: PlanFeature[];
  limits: {
    pdfBatchLimit: string;
    compressionEngine: string;
    exportFormats: string;
    adFree: boolean;
    brandingReports: boolean;
    support: string;
  };
}

export interface UserSubscription {
  tier: SubscriptionTier;
  cycle: BillingCycle;
  status: 'active' | 'free' | 'canceled';
  activatedAt: string;
  expiresAt: string;
  autoRenew: boolean;
  planName: string;
  paymentMethod?: string;
  lastBilledAmount?: string;
  transactionId?: string;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    tier: 'free',
    name: 'Starter (Free)',
    tagline: 'Essential financial calculators & basic PDF tools for everyday personal use.',
    monthlyPriceINR: 0,
    yearlyPriceINR: 0,
    monthlyPriceUSD: 0,
    yearlyPriceUSD: 0,
    features: [
      { title: 'All Standard Financial & Loan Calculators (EMI, SIP, PPF, GST, FD)', included: true },
      { title: 'New vs Old Income Tax Regime Calculator (FY 2024-25 & 2025-26)', included: true },
      { title: 'Client-Side PDF Merge, Split & Rotate (Up to 3 files/session)', included: true },
      { title: 'Standard PDF Compression Engine (Balanced quality)', included: true },
      { title: 'Local Device History & Favorite Bookmarking', included: true },
      { title: 'Govt. Portal Ultra-Compression (<200KB UPSC/SSC presets)', included: false },
      { title: 'Unlimited PDF Batch Processing & Bulk Stamps', included: false },
      { title: 'Custom Watermark Stamping & Custom Page Numbering', included: false },
      { title: 'CSV & PDF Loan Amortization Schedule with Bank Logo', included: false },
      { title: 'CA / Tax Consultant Multi-Client Reports & White-labeling', included: false },
    ],
    limits: {
      pdfBatchLimit: 'Up to 3 files / session',
      compressionEngine: 'Standard Balanced (50-60%)',
      exportFormats: 'Basic Screen View + Copy',
      adFree: true,
      brandingReports: false,
      support: 'Community Support',
    },
  },
  {
    id: 'pro',
    tier: 'pro',
    name: 'FinTools Pro',
    badge: 'Most Popular',
    tagline: 'Supercharged power tools for active investors, real-estate buyers, and power users.',
    monthlyPriceINR: 199,
    yearlyPriceINR: 1499, // ~₹125/mo - 37% off
    monthlyPriceUSD: 3.99,
    yearlyPriceUSD: 29.99,
    popular: true,
    features: [
      { title: 'All Financial Calculators with Advanced Prepayment & Step-up SIP', included: true, highlight: true },
      { title: 'Govt. 200KB Ultra-Compression Engine (SSC, UPSC, EPFO, Bank KYC)', included: true, highlight: true },
      { title: 'Unlimited PDF Batch Merge, Split & Extract (No file limits)', included: true, highlight: true },
      { title: 'High-Res PDF to JPG / PNG Conversion (200+ DPI Crisp Raster)', included: true },
      { title: 'Custom Watermark Studio (Custom opacity, diagonal & grid tiles)', included: true },
      { title: 'Export Full Amortization Tables to Excel / CSV / Print PDF', included: true },
      { title: 'Ad-Free High Performance Experience', included: true },
      { title: 'Pro Verified Member Badge on Profile', included: true },
      { title: 'Priority Local Browser Compute Engine', included: true },
      { title: 'CA / Tax Consultant Multi-Client Reports & White-labeling', included: false },
    ],
    limits: {
      pdfBatchLimit: 'Unlimited Files & Size',
      compressionEngine: 'Ultra-Raster + Vector compaction (<200KB)',
      exportFormats: 'Excel / CSV / PDF Printables',
      adFree: true,
      brandingReports: false,
      support: 'Priority Email Support (24h SLA)',
    },
  },
  {
    id: 'business',
    tier: 'business',
    name: 'CA & Business Pro',
    badge: 'For Professionals',
    tagline: 'Tailored for Chartered Accountants, Tax Consultants, Real Estate Brokers & Wealth Advisors.',
    monthlyPriceINR: 499,
    yearlyPriceINR: 3999, // ~₹333/mo - 33% off
    monthlyPriceUSD: 8.99,
    yearlyPriceUSD: 69.99,
    features: [
      { title: 'Everything included in FinTools Pro', included: true },
      { title: 'White-Label Loan & Tax Reports (Add Your CA / Firm Logo & Header)', included: true, highlight: true },
      { title: 'Multi-Client Calculation Vault (Save separate profiles per client)', included: true, highlight: true },
      { title: 'Batch Watermarking & Official Digitized Stamping for Client Files', included: true, highlight: true },
      { title: 'Bulk PDF Optimization for Official Income Tax Portal Uploads', included: true },
      { title: 'Commercial Use License for Client Advisory Presentations', included: true },
      { title: 'Direct GST Input Tax Credit (ITC) Reconciler exports', included: true },
      { title: 'Custom Amortization Schedules with Multi-Part Prepayment Strategies', included: true },
      { title: 'Dedicated VIP Support & Feature Request Priority', included: true },
      { title: 'Team / Office Multi-seat Usage Support', included: true },
    ],
    limits: {
      pdfBatchLimit: 'Unlimited Commercial Batch',
      compressionEngine: 'Enterprise Multi-pass High Fidelity',
      exportFormats: 'White-labeled PDF / Excel / CSV',
      adFree: true,
      brandingReports: true,
      support: 'VIP Dedicated Desk & WhatsApp Support',
    },
  },
];

const SUBSCRIPTION_STORAGE_KEY = 'fintools_subscription_v1';

export const DEFAULT_SUBSCRIPTION: UserSubscription = {
  tier: 'free',
  cycle: 'monthly',
  status: 'free',
  activatedAt: new Date().toISOString(),
  expiresAt: '2099-12-31T23:59:59.000Z',
  autoRenew: false,
  planName: 'Starter (Free)',
  paymentMethod: 'None (Free Tier)',
};

let cachedSub: UserSubscription | null = null;
let cachedSubRaw: string | null = null;

export function getStoredSubscription(): UserSubscription {
  if (typeof window === 'undefined') return DEFAULT_SUBSCRIPTION;
  try {
    const raw = localStorage.getItem(SUBSCRIPTION_STORAGE_KEY);
    if (!raw) {
      const def = JSON.stringify(DEFAULT_SUBSCRIPTION);
      localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, def);
      cachedSubRaw = def;
      cachedSub = DEFAULT_SUBSCRIPTION;
      return DEFAULT_SUBSCRIPTION;
    }
    if (raw !== cachedSubRaw) {
      cachedSubRaw = raw;
      cachedSub = JSON.parse(raw);
    }
    return cachedSub || DEFAULT_SUBSCRIPTION;
  } catch {
    return DEFAULT_SUBSCRIPTION;
  }
}

export function saveSubscription(sub: UserSubscription) {
  if (typeof window === 'undefined') return;
  try {
    const serialized = JSON.stringify(sub);
    localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, serialized);
    cachedSubRaw = serialized;
    cachedSub = sub;
    window.dispatchEvent(new Event('fintools_subscription_update'));
  } catch (e) {
    console.error('Failed to save subscription', e);
  }
}

export function upgradeSubscription(
  tier: SubscriptionTier,
  cycle: BillingCycle,
  paymentMethod = 'Razorpay (UPI / Card / Netbanking)',
  customTransactionId?: string
): UserSubscription {
  const plan = SUBSCRIPTION_PLANS.find((p) => p.tier === tier) || SUBSCRIPTION_PLANS[0];
  const now = new Date();
  const expires = new Date();

  if (cycle === 'yearly') {
    expires.setFullYear(expires.getFullYear() + 1);
  } else {
    expires.setMonth(expires.getMonth() + 1);
  }

  const priceINR = cycle === 'yearly' ? plan.yearlyPriceINR : plan.monthlyPriceINR;
  const amountStr = tier === 'free' ? '₹0' : `₹${priceINR.toLocaleString('en-IN')}`;

  const updated: UserSubscription = {
    tier,
    cycle,
    status: tier === 'free' ? 'free' : 'active',
    activatedAt: now.toISOString(),
    expiresAt: tier === 'free' ? '2099-12-31T23:59:59.000Z' : expires.toISOString(),
    autoRenew: tier !== 'free',
    planName: plan.name,
    paymentMethod: tier === 'free' ? 'None' : paymentMethod,
    lastBilledAmount: amountStr,
    transactionId: tier === 'free' ? undefined : (customTransactionId || `rzp_${Date.now().toString(36)}_${Math.floor(1000 + Math.random() * 9000)}`),
  };

  saveSubscription(updated);
  return updated;
}

export function cancelSubscription(): UserSubscription {
  const current = getStoredSubscription();
  const updated: UserSubscription = {
    ...current,
    autoRenew: false,
    status: 'canceled',
  };
  saveSubscription(updated);
  return updated;
}

export function resetToFreePlan(): UserSubscription {
  saveSubscription(DEFAULT_SUBSCRIPTION);
  return DEFAULT_SUBSCRIPTION;
}

function subscribeSubscription(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('fintools_subscription_update', callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('fintools_subscription_update', callback);
    window.removeEventListener('storage', callback);
  };
}

export function useSubscription(): UserSubscription {
  return useSyncExternalStore(
    subscribeSubscription,
    getStoredSubscription,
    () => DEFAULT_SUBSCRIPTION
  );
}
