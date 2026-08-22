'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Scale,
  FileCheck,
  CheckCircle2,
  ServerOff,
  HardDrive,
  Trash2,
  Download,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { purgeAllLocalData } from '@/lib/security-certificates';

export default function PrivacyPolicyPage() {
  const handlePurge = () => {
    if (confirm('Wipe all local calculation logs and history stored on this browser?')) {
      purgeAllLocalData();
      alert('All local storage items have been securely cleared.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Header */}
      <div className="bg-slate-900 text-white border-b border-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Digital Personal Data Protection (DPDP Act 2023) Compliant</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Privacy Policy & Zero-Data Retention Charter
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            Last Updated: 2026. FinTools.in is built from the ground up on a strict <strong>&quot;Zero-Knowledge In-Browser Compute&quot;</strong> model.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Core Principles Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
              <ServerOff className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Our Core Privacy Guarantee
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                We cannot sell, leak, or share your data because we never receive it.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">1. Zero Server Uploads</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Your PDF documents and salary data stay locked in your device RAM.
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <div className="text-xs font-bold text-blue-600 dark:text-blue-400">2. No Tracking Cookies</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                We do not employ cross-site marketing or invasive telemetry pixels.
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">3. DPDP Act 2023 Compliant</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Instant right to erasure and complete data autonomy for Indian citizens.
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
          <section className="space-y-2">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              1. What Information We Do NOT Collect
            </h3>
            <p>
              Unlike conventional web calculators and cloud-based file tools, FinTools does not transmit, store, or log any of the following:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-500 dark:text-slate-400">
              <li>PDF documents, bank statements, salary slips, or files processed using our PDF Suite.</li>
              <li>Personal identifiers such as Permanent Account Number (PAN), Aadhaar numbers, or tax registration numbers.</li>
              <li>Financial input parameters (monthly income, deductions, loan amounts, SIP figures, interest rates).</li>
              <li>Payment credentials (credit/debit card numbers or bank passwords are tokenized directly by Razorpay).</li>
            </ul>
          </section>

          <section className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              2. How In-Browser Processing Works
            </h3>
            <p>
              All computations are performed locally using client-side JavaScript, WebAssembly (WASM), and the W3C WebCrypto API. When you merge, split, compress, or convert a PDF, the binary data remains isolated within your browser’s allocated memory sandbox. When the browser tab is closed, that volatile memory is completely discarded.
            </p>
          </section>

          <section className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              3. Payment Processing via Razorpay
            </h3>
            <p>
              When upgrading to FinTools Pro or CA subscriptions, payments are handled directly by Razorpay Software Private Limited via their certified PCI-DSS Level 1 compliant gateway. FinTools never has access to, nor retains, your full card numbers, CVVs, or Net Banking credentials.
            </p>
          </section>

          <section className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              4. Local Storage and Right to Erasure
            </h3>
            <p>
              If you choose to save custom calculation bookmarks or custom themes, they are stored exclusively inside your browser’s <code>localStorage</code>. You may wipe this data at any moment using our one-click Purge tool below:
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={handlePurge}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Zero-Fill Purge All Local History Now</span>
              </button>
            </div>
          </section>

          <section className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              5. Contacting the Data Protection Officer / Founder
            </h3>
            <p>
              For privacy audits, enterprise inquiries, or compliance declarations, contact our founder at:
            </p>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-blue-600 dark:text-blue-400">
              ak42@iitbbs.ac.in (A Kumar, IIT Bhubaneswar)
            </div>
          </section>
        </div>

        {/* Link to Security Certificates Hub */}
        <div className="flex items-center justify-between p-6 rounded-3xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
          <div className="space-y-1">
            <div className="text-sm font-extrabold text-blue-900 dark:text-blue-200">
              Looking for official compliance certificates?
            </div>
            <div className="text-xs text-blue-700 dark:text-blue-300">
              View valid SSL/TLS, DPDP Act 2023, and Zero-Knowledge verification certificates.
            </div>
          </div>
          <Link
            href="/security"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <span>Certificates Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
