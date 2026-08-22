'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calculator, ShieldCheck, Heart, Sparkles, FileText, ArrowLeftRight, CreditCard } from 'lucide-react';
import { AppIcon } from '@/components/app-icon';

export function Footer() {
  return (
    <footer className="w-full bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6 pb-12 border-b border-slate-800">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <AppIcon size="sm" showGlow />
              <span className="font-extrabold text-xl tracking-tight text-white">
                FinTools<span className="text-blue-400">.in</span>
              </span>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              India’s smartest financial calculators & client-side PDF productivity suite. 
              Built for accuracy, speed, and 100% private in-browser computation without sending your sensitive financial data anywhere.
            </p>

            <div className="flex flex-col gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-blue-950/80 text-blue-300 border border-blue-800 w-fit">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Client-Side Privacy
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700 w-fit">
                ⚡ 100% Static & In-Browser
              </span>
            </div>
          </div>

          {/* Col 2: Financial Calculators */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Calculators
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/calculators/emi-calculator" className="text-slate-400 hover:text-white transition-colors">
                  EMI Calculator
                </Link>
              </li>
              <li>
                <Link href="/calculators/sip-calculator" className="text-slate-400 hover:text-white transition-colors">
                  SIP Calculator
                </Link>
              </li>
              <li>
                <Link href="/calculators/home-loan-emi-calculator" className="text-slate-400 hover:text-white transition-colors">
                  Home Loan EMI
                </Link>
              </li>
              <li>
                <Link href="/calculators/income-tax-calculator" className="text-slate-400 hover:text-white transition-colors">
                  Income Tax (New vs Old)
                </Link>
              </li>
              <li>
                <Link href="/calculators/gst-calculator" className="text-slate-400 hover:text-white transition-colors">
                  GST Calculator
                </Link>
              </li>
              <li>
                <Link href="/calculators/fd-calculator" className="text-slate-400 hover:text-white transition-colors">
                  FD Calculator
                </Link>
              </li>
              <li>
                <Link href="/calculators/ppf-calculator" className="text-slate-400 hover:text-white transition-colors">
                  PPF Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: PDF Utilities */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              PDF Toolkit
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/pdf/merge-pdf" className="text-slate-400 hover:text-white transition-colors">
                  Merge PDF (Multi-file)
                </Link>
              </li>
              <li>
                <Link href="/pdf/compress-pdf" className="text-slate-400 hover:text-white transition-colors">
                  Compress PDF (&lt;200KB)
                </Link>
              </li>
              <li>
                <Link href="/pdf/split-pdf" className="text-slate-400 hover:text-white transition-colors">
                  Split & Extract Pages
                </Link>
              </li>
              <li>
                <Link href="/pdf/rotate-pdf" className="text-slate-400 hover:text-white transition-colors">
                  Rotate PDF Pages
                </Link>
              </li>
              <li>
                <Link href="/pdf/jpg-to-pdf" className="text-slate-400 hover:text-white transition-colors">
                  JPG / PNG to PDF
                </Link>
              </li>
              <li>
                <Link href="/pdf/watermark-pdf" className="text-slate-400 hover:text-white transition-colors">
                  Add Watermark & Stamp
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Converters & Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Converters
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/converters/unit-converter" className="text-slate-400 hover:text-white transition-colors">
                  Universal Unit Converter
                </Link>
              </li>
              <li>
                <Link href="/converters/unit-converter" className="text-slate-400 hover:text-white transition-colors">
                  Indian Land & Area Units
                </Link>
              </li>
              <li>
                <Link href="/calculators/percentage-calculator" className="text-slate-400 hover:text-white transition-colors">
                  Percentage Calculator
                </Link>
              </li>
              <li>
                <Link href="/calculators/age-calculator" className="text-slate-400 hover:text-white transition-colors">
                  Age & Date Calculator
                </Link>
              </li>
              <li>
                <Link href="/calculators/cagr-calculator" className="text-slate-400 hover:text-white transition-colors">
                  CAGR Stock Returns
                </Link>
              </li>
              <li>
                <Link href="/calculators/inhand-salary-calculator" className="text-slate-400 hover:text-white transition-colors">
                  In-Hand CTC Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Subscriptions & Pro Plans */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
              <span>Subscription Plans</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/pricing" className="text-amber-300/90 hover:text-white font-semibold transition-colors flex items-center justify-between">
                  <span>FinTools Pro (Monthly)</span>
                  <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-amber-400 font-bold">₹199/mo</span>
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-amber-300/90 hover:text-white font-semibold transition-colors flex items-center justify-between">
                  <span>FinTools Pro (Yearly)</span>
                  <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-1.5 py-0.5 rounded font-bold">Save 37%</span>
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-slate-400 hover:text-white transition-colors">
                  CA & Business White-label
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-slate-400 hover:text-white transition-colors">
                  Compare Free vs Pro Matrix
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-slate-400 hover:text-white transition-colors">
                  GST Invoice & Tax Credit
                </Link>
              </li>
              <li>
                <Link href="/security" className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Trust & Valid Certificates</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Banner */}
        <div className="py-6 border-b border-slate-800 text-xs text-slate-400 leading-relaxed flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="max-w-3xl">
            <p className="font-medium text-slate-300 mb-1">
              Disclaimer & Privacy Mandate:
            </p>
            <p>
              FinTools India provides calculation tools for informational and educational purposes only. 
              All calculations and PDF document processing are executed strictly client-side inside your browser sandbox. 
              No financial inputs, files, or telemetry are ever uploaded or stored on remote servers.
            </p>
          </div>
          <Link
            href="/security"
            className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold border border-slate-700 transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>View 6 Valid Certificates</span>
          </Link>
        </div>

        {/* Bottom Bar with Founder Info */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-blue-500 shrink-0 relative">
              <Image
                src="/founder.jpg"
                alt="Founder A Kumar"
                width={32}
                height={32}
                className="w-full h-full object-cover"
                unoptimized
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <p className="font-semibold text-slate-200">
                Crafted by A Kumar <span className="text-blue-400 font-normal">(IIT Bhubaneswar)</span>
              </p>
              <p className="text-[11px] text-slate-500">
                © {new Date().getFullYear()} FinTools India. All rights reserved.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 sm:gap-6 flex-wrap">
            <Link href="/pricing" className="text-amber-400 hover:text-amber-300 font-bold transition-colors">
              Subscription Plans
            </Link>
            <Link href="/security" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
              Security & Certificates
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy (DPDP)
            </Link>
            <a href="mailto:ak42@iitbbs.ac.in" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Contact Founder
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
