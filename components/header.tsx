'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Calculator,
  FileText,
  ArrowLeftRight,
  Search,
  Moon,
  Sun,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  Bookmark,
  TrendingUp,
  Landmark,
  Receipt,
  Percent,
  Layers,
  User,
  LogOut,
  CreditCard,
  ShieldCheck,
} from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { GlobalSearchModal } from '@/components/global-search-modal';
import { AuthModal } from '@/components/auth-modal';
import { useFavorites } from '@/lib/storage';
import { useCurrentUser, clearUserSession } from '@/lib/auth';
import { useSubscription } from '@/lib/subscription';
import { TOOLS } from '@/lib/tools-registry';

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [calculatorsMenuOpen, setCalculatorsMenuOpen] = useState(false);
  const [pdfMenuOpen, setPdfMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const currentUser = useCurrentUser();
  const currentSub = useSubscription();
  const favorites = useFavorites();
  const favoriteCount = favorites.length;
  const { resolvedTheme, toggleTheme } = useTheme();
  const pathname = usePathname();

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [currentPath, setCurrentPath] = useState(pathname);
  if (currentPath !== pathname) {
    setCurrentPath(pathname);
    setMobileMenuOpen(false);
    setCalculatorsMenuOpen(false);
    setPdfMenuOpen(false);
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
                  FinTools<span className="text-blue-600 dark:text-blue-400">.in</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded border border-blue-200 dark:border-blue-800">
                  INDIA
                </span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium -mt-1 hidden sm:inline">
                Calculators • PDF • Converters
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {/* Calculators Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCalculatorsMenuOpen(true)}
              onMouseLeave={() => setCalculatorsMenuOpen(false)}
            >
              <button
                type="button"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname.startsWith('/calculators')
                    ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Landmark className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Financial Calculators</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {/* Mega Dropdown */}
              {calculatorsMenuOpen && (
                <div className="absolute top-full left-0 w-[520px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 grid grid-cols-2 gap-3 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2.5 py-1">
                      Loans & EMI
                    </div>
                    <Link
                      href="/calculators/emi-calculator"
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
                    >
                      <span>Loan EMI Calculator</span>
                      <span className="text-[10px] text-blue-600 font-bold bg-blue-50 dark:bg-blue-950 px-1.5 py-0.5 rounded">
                        Popular
                      </span>
                    </Link>
                    <Link
                      href="/calculators/home-loan-emi-calculator"
                      className="block p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
                    >
                      Home Loan EMI (Tax Benefits)
                    </Link>
                    <Link
                      href="/calculators/loan-prepayment-calculator"
                      className="block p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
                    >
                      Loan Prepayment Calculator
                    </Link>
                    <Link
                      href="/calculators/flat-vs-reducing-calculator"
                      className="block p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
                    >
                      Flat vs Reducing Rate
                    </Link>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2.5 py-1">
                      Investments & Tax
                    </div>
                    <Link
                      href="/calculators/sip-calculator"
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
                    >
                      <span>SIP Calculator</span>
                      <span className="text-[10px] text-blue-600 font-bold bg-blue-50 dark:bg-blue-950 px-1.5 py-0.5 rounded">
                        Mutual Funds
                      </span>
                    </Link>
                    <Link
                      href="/calculators/step-up-sip-calculator"
                      className="block p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
                    >
                      Step-Up SIP Calculator
                    </Link>
                    <Link
                      href="/calculators/income-tax-calculator"
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
                    >
                      <span>Income Tax Calculator</span>
                      <span className="text-[10px] text-amber-600 font-bold bg-amber-50 dark:bg-amber-950 px-1.5 py-0.5 rounded">
                        New vs Old
                      </span>
                    </Link>
                    <Link
                      href="/calculators/gst-calculator"
                      className="block p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
                    >
                      GST Calculator (5%, 12%, 18%, 28%)
                    </Link>
                    <Link
                      href="/calculators/ppf-calculator"
                      className="block p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
                    >
                      PPF Calculator (7.1% EEE)
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* PDF Tools Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setPdfMenuOpen(true)}
              onMouseLeave={() => setPdfMenuOpen(false)}
            >
              <button
                type="button"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname.startsWith('/pdf')
                    ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>PDF Toolkit</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {pdfMenuOpen && (
                <div className="absolute top-full left-0 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3 space-y-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2.5 py-1">
                    Client-Side PDF Suite (100% Private)
                  </div>
                  <Link
                    href="/pdf/merge-pdf"
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
                  >
                    <span>Merge PDF</span>
                    <span className="text-[10px] text-blue-600 font-bold bg-blue-50 dark:bg-blue-950 px-1.5 py-0.5 rounded">
                      Fast
                    </span>
                  </Link>
                  <Link
                    href="/pdf/compress-pdf"
                    className="block p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    Compress & Optimize PDF
                  </Link>
                  <Link
                    href="/pdf/split-pdf"
                    className="block p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    Split & Extract Pages
                  </Link>
                  <Link
                    href="/pdf/rotate-pdf"
                    className="block p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    Rotate PDF Pages
                  </Link>
                  <Link
                    href="/pdf/jpg-to-pdf"
                    className="block p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    JPG / PNG to PDF
                  </Link>
                  <Link
                    href="/pdf/watermark-pdf"
                    className="block p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    Add Watermark / Stamp
                  </Link>
                </div>
              )}
            </div>

            {/* Converters */}
            <Link
              href="/converters/unit-converter"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname.startsWith('/converters')
                  ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <ArrowLeftRight className="w-4 h-4 text-blue-500" />
              <span>Unit Converter</span>
            </Link>

            {/* Tax Special Tag */}
            <Link
              href="/calculators/income-tax-calculator"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Receipt className="w-3.5 h-3.5 text-blue-600" />
              <span>Tax Calculator</span>
            </Link>

            {/* Subscription Plans Link */}
            <Link
              href="/pricing"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                pathname === '/pricing'
                  ? 'text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700 shadow-2xs'
                  : 'text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Plans & Pricing</span>
              <span className="hidden xl:inline-block text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100">
                Save 37%
              </span>
            </Link>

            {/* Security & Privacy Center Link */}
            <Link
              href="/security"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                pathname === '/security'
                  ? 'text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 shadow-2xs'
                  : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
              }`}
              title="100% Client-Side Privacy & Verified Security Certificates"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden xl:inline">Security &</span>
              <span>Privacy</span>
            </Link>
          </nav>

          {/* Right Action Icons: Search Trigger, Theme Toggle, Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger Button with ⌘K badge */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-full px-3.5 py-1.5 sm:w-64 md:w-80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all text-xs sm:text-sm"
              aria-label="Search all tools"
            >
              <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
              <span className="truncate mr-auto text-slate-500">Search calculators, PDF tools...</span>
              <kbd className="hidden sm:inline-flex text-[10px] bg-white dark:bg-slate-900 text-slate-400 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded ml-2 font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-600 dark:text-slate-300 transition-all cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              title={resolvedTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400 animate-in spin-in-180 duration-200" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700 dark:text-slate-300 animate-in spin-in-180 duration-200" />
              )}
            </button>

            {/* Guest Mode Account Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                aria-label="Guest Account Menu"
              >
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span className="hidden sm:inline text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[110px] truncate">
                  {currentUser.name}
                </span>
                <span className={`hidden md:inline-block px-1.5 py-0.2 rounded-sm text-[9px] font-extrabold uppercase tracking-wider ${
                  currentSub.tier !== 'free'
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                    : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                }`}>
                  {currentSub.tier !== 'free' ? currentSub.tier.toUpperCase() : 'Guest'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-3 space-y-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="p-2 border-b border-slate-100 dark:border-slate-800 space-y-0.5">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {currentUser.name}
                    </div>
                    <div className="flex items-center justify-between gap-1 text-[11px]">
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                        <span>Guest Mode</span>
                      </span>
                      <span className="font-bold text-slate-500 dark:text-slate-400 text-[10px]">
                        {currentSub.planName}
                      </span>
                    </div>
                  </div>

                  <Link
                    href="/pricing"
                    onClick={() => setUserDropdownOpen(false)}
                    className="w-full text-left p-2 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950/40 text-xs font-semibold text-amber-800 dark:text-amber-300 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{currentSub.tier === 'free' ? 'Upgrade to Pro' : 'Manage Subscription'}</span>
                    </div>
                    <span className="text-[9px] font-extrabold uppercase bg-amber-200 dark:bg-amber-900 px-1 py-0.2 rounded text-amber-900 dark:text-amber-100">
                      37% Off
                    </span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      setAuthOpen(true);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-blue-500" />
                    <span>Guest Profile & Settings</span>
                  </button>

                  <Link
                    href="/security"
                    onClick={() => setUserDropdownOpen(false)}
                    className="w-full text-left p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs font-medium text-emerald-800 dark:text-emerald-300 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Trust, Privacy & Certificates</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      clearUserSession();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Reset Session</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-top-2 duration-150">
            {/* Mobile Guest Profile Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                    <span>{currentSub.planName}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAuthOpen(true);
                }}
                className="px-2.5 py-1 text-xs text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg border border-blue-200 dark:border-blue-800 transition-colors"
              >
                Settings
              </button>
            </div>

            {/* Mobile Subscription Banner */}
            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-blue-500/15 border border-amber-300 dark:border-amber-700/80 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Subscription Plans (Monthly / Yearly)
                  </div>
                  <div className="text-[10px] text-amber-700 dark:text-amber-300 font-medium">
                    Save 37% on Annual Billing
                  </div>
                </div>
              </div>
              <span className="px-2 py-1 rounded-lg bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase">
                View
              </span>
            </Link>

            {/* Quick Action Button for Mobile */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSearchOpen(true);
                }}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700"
              >
                <Search className="w-3.5 h-3.5 text-blue-600" />
                <span>Search</span>
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                {resolvedTheme === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Popular Financial Tools
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/calculators/emi-calculator"
                  className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700"
                >
                  EMI Calculator
                </Link>
                <Link
                  href="/calculators/sip-calculator"
                  className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700"
                >
                  SIP Calculator
                </Link>
                <Link
                  href="/calculators/income-tax-calculator"
                  className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700"
                >
                  Income Tax (New vs Old)
                </Link>
                <Link
                  href="/calculators/gst-calculator"
                  className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700"
                >
                  GST Calculator
                </Link>
                <Link
                  href="/calculators/fd-calculator"
                  className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700"
                >
                  FD Calculator
                </Link>
                <Link
                  href="/calculators/ppf-calculator"
                  className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700"
                >
                  PPF Calculator
                </Link>
              </div>

              <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pt-2">
                PDF Toolkit
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/pdf/merge-pdf"
                  className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700"
                >
                  Merge PDF
                </Link>
                <Link
                  href="/pdf/compress-pdf"
                  className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700"
                >
                  Compress PDF
                </Link>
                <Link
                  href="/pdf/split-pdf"
                  className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700"
                >
                  Split PDF
                </Link>
                <Link
                  href="/pdf/jpg-to-pdf"
                  className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700"
                >
                  JPG to PDF
                </Link>
              </div>

              <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pt-2">
                Converters & Everyday
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/converters/unit-converter"
                  className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700"
                >
                  Unit & Land Converter
                </Link>
                <Link
                  href="/calculators/percentage-calculator"
                  className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700"
                >
                  Percentage Calculator
                </Link>
                <Link
                  href="/calculators/age-calculator"
                  className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700"
                >
                  Age Calculator
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Authentication Modal */}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
