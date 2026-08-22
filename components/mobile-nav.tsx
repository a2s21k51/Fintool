'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calculator,
  FileText,
  ShieldCheck,
  Crown,
  Search,
  Grid,
  X,
  TrendingUp,
  Percent,
  Landmark,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { GlobalSearchModal } from '@/components/global-search-modal';
import { AppIcon } from '@/components/app-icon';

export function MobileNav() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickDrawerOpen, setQuickDrawerOpen] = useState(false);

  const navItems = [
    {
      label: 'Home',
      href: '/',
      icon: AppIcon,
      isCustomAppIcon: true,
      active: pathname === '/',
    },
    {
      label: 'Calculators',
      href: '/calculators/sip',
      icon: Calculator,
      active: pathname.startsWith('/calculators'),
    },
    {
      label: 'PDF Tools',
      href: '/pdf/merge',
      icon: FileText,
      active: pathname.startsWith('/pdf'),
    },
    {
      label: 'Security',
      href: '/security',
      icon: ShieldCheck,
      badge: 'Verified',
      active: pathname === '/security' || pathname === '/privacy',
    },
    {
      label: 'Pro Plan',
      href: '/pricing',
      icon: Crown,
      badge: 'Save 37%',
      active: pathname === '/pricing',
    },
  ];

  return (
    <>
      {/* Search Modal */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Quick Access Mobile Drawer */}
      {quickDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-slate-950/70 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200">
          <div
            className="w-full bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 p-5 pb-8 shadow-2xl max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <AppIcon size="xs" />
                <div>
                  <div className="text-sm font-extrabold text-slate-900 dark:text-white">Quick Tool Launcher</div>
                  <div className="text-[10px] text-slate-500">100% In-Browser Private Toolkit</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setQuickDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {/* Popular Financial Tools */}
              <div>
                <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                  Popular Calculators
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/calculators/sip"
                    onClick={() => setQuickDrawerOpen(false)}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-2.5 hover:border-blue-400 transition-colors"
                  >
                    <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">SIP Return</div>
                      <div className="text-[10px] text-slate-500">Wealth planner</div>
                    </div>
                  </Link>

                  <Link
                    href="/calculators/emi"
                    onClick={() => setQuickDrawerOpen(false)}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-2.5 hover:border-blue-400 transition-colors"
                  >
                    <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                      <Landmark className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">Loan EMI</div>
                      <div className="text-[10px] text-slate-500">Home/Car/Personal</div>
                    </div>
                  </Link>

                  <Link
                    href="/calculators/income-tax"
                    onClick={() => setQuickDrawerOpen(false)}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-2.5 hover:border-blue-400 transition-colors"
                  >
                    <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                      <Percent className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">Income Tax</div>
                      <div className="text-[10px] text-slate-500">AY 2025-26</div>
                    </div>
                  </Link>

                  <Link
                    href="/calculators/gst"
                    onClick={() => setQuickDrawerOpen(false)}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-2.5 hover:border-blue-400 transition-colors"
                  >
                    <div className="p-1.5 rounded-lg bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400">
                      <Calculator className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">GST Slab</div>
                      <div className="text-[10px] text-slate-500">5%, 12%, 18%, 28%</div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* PDF Suite */}
              <div>
                <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                  Client-Side PDF Suite
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/pdf/merge"
                    onClick={() => setQuickDrawerOpen(false)}
                    className="p-2.5 rounded-xl bg-red-50/50 dark:bg-red-950/30 border border-red-200/60 dark:border-red-900/40 flex items-center gap-2 text-xs font-bold text-red-700 dark:text-red-300"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Merge PDFs</span>
                  </Link>
                  <Link
                    href="/pdf/compress"
                    onClick={() => setQuickDrawerOpen(false)}
                    className="p-2.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Compress PDF</span>
                  </Link>
                </div>
              </div>

              {/* View all button */}
              <div className="pt-2">
                <Link
                  href="/pricing"
                  onClick={() => setQuickDrawerOpen(false)}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold flex items-center justify-between shadow-md"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Upgrade to FinTools Pro (₹125/mo)</span>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Navigation Bar for Mobile */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 px-2 py-1.5 shadow-lg safe-area-bottom"
      >
        <div className="max-w-md mx-auto flex items-center justify-around gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
                  item.active
                    ? 'text-blue-600 dark:text-blue-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium'
                }`}
              >
                {/* Active Pill Indicator */}
                {item.active && (
                  <span className="absolute -top-1.5 w-6 h-0.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                )}

                <div className="relative flex items-center justify-center h-6 w-6">
                  {item.isCustomAppIcon ? (
                    <AppIcon size="xs" className="w-5 h-5 rounded-md" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}

                  {/* Micro badge dot */}
                  {item.badge && item.label === 'Security' && (
                    <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                  )}
                  {item.badge && item.label === 'Pro Plan' && (
                    <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-white dark:ring-slate-900" />
                  )}
                </div>

                <span className="text-[10px] tracking-tight mt-0.5 leading-none whitespace-nowrap">
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* Quick Menu Launcher Trigger */}
          <button
            type="button"
            onClick={() => setQuickDrawerOpen(true)}
            aria-label="Open Quick Tools Menu"
            className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
          >
            <div className="flex items-center justify-center h-6 w-6">
              <Grid className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 leading-none whitespace-nowrap">
              Tools
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}
