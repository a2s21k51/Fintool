'use client';

import React from 'react';
import Image from 'next/image';
import { Sparkles, ShieldCheck, Mail, Award, CheckCircle, Code2, Heart } from 'lucide-react';

export function FounderSection() {
  return (
    <section className="w-full py-12 md:py-16 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 lg:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Col: Founder Photo & Profile Badge */}
            <div className="lg:col-span-5 flex flex-col items-center text-center space-y-4">
              <div className="relative group">
                {/* Glow ring */}
                <div className="absolute -inset-1.5 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl blur-sm opacity-40 group-hover:opacity-70 transition duration-300" />
                
                {/* Photo frame */}
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border-2 border-white dark:border-slate-800 shadow-2xl bg-slate-100 dark:bg-slate-800">
                  <Image
                    src="/founder.jpg"
                    alt="A Kumar - Founder of FinTools.in"
                    fill
                    className="object-cover object-top hover:scale-105 transition-transform duration-300"
                    priority
                  />
                </div>

                {/* Verified Founder Badge */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-extrabold shadow-lg">
                  <Award className="w-3.5 h-3.5 text-amber-300" />
                  <span>Founder & Architect</span>
                </div>
              </div>

              <div className="pt-3 space-y-1">
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  A Kumar
                </h3>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                  IIT Bhubaneswar Alumnus • FinTech Engineer
                </p>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <a
                    href="mailto:ak42@iitbbs.ac.in"
                    className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>ak42@iitbbs.ac.in</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Col: Founder's Story & Mission Statement */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950 text-xs font-bold text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Message from the Founder</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                &ldquo;Empowering Indians with zero-compromise precision, privacy, and speed.&rdquo;
              </h2>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Welcome to <strong>FinTools.in</strong>. I created this platform to solve a widespread problem in Indian finance: clunky, ad-cluttered websites that harvest user data just to calculate a simple EMI or compress a bank statement PDF.
              </p>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                FinTools is engineered with two uncompromised principles: <strong>100% Client-Side Privacy</strong> (your financial inputs, calculations, and uploaded PDFs never leave your device) and <strong>Static Mathematical Rigor</strong> for transparent, verifiable financial and unit formulas.
              </p>

              {/* Feature Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>Zero Data Leakage</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    All calculations & PDF processing happen locally in your browser.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span>Evergreen Accuracy</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Built on static mathematical algorithms and standard banking formulas.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                    <Code2 className="w-4 h-4 text-blue-600" />
                    <span>Open & Free</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Completely ad-free, high-speed experience for every Indian citizen.
                  </p>
                </div>
              </div>

              {/* Action and feedback */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="mailto:ak42@iitbbs.ac.in?subject=Feedback%20on%20FinTools.in"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send Feedback to Founder</span>
                </a>
                <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for India
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
