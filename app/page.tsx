'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TOOLS,
  TOOL_CATEGORIES,
  ToolDefinition,
  getToolsByCategory,
  getPopularTools,
} from '@/lib/tools-registry';
import {
  toggleFavorite,
  useFavorites,
  useRecentTools,
} from '@/lib/storage';
import {
  Calculator,
  Search,
  Star,
  Clock,
  Sparkles,
  ShieldCheck,
  Zap,
  Lock,
  ChevronRight,
  TrendingUp,
  Landmark,
  FileText,
  ArrowLeftRight,
  Receipt,
  Percent,
  Layers,
} from 'lucide-react';
import { GlobalSearchModal } from '@/components/global-search-modal';
import { FounderSection } from '@/components/founder-section';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchOpen, setSearchOpen] = useState(false);
  const favoriteIds = useFavorites();
  const recentToolIds = useRecentTools();

  const handleFavoriteClick = (e: React.MouseEvent, toolId: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(toolId);
  };

  // Filter tools based on active category
  const filteredTools =
    activeCategory === 'all'
      ? TOOLS
      : activeCategory === 'popular'
      ? getPopularTools()
      : getToolsByCategory(activeCategory);

  const favoriteTools = TOOLS.filter((t) => favoriteIds.includes(t.id));
  const recentTools = TOOLS.filter((t) => recentToolIds.includes(t.id)).slice(0, 4);

  return (
    <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-16 md:pb-20 border-b border-slate-200/80 dark:border-slate-800/80">
        {/* Subtle background radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 dark:from-blue-500/5 dark:to-indigo-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 text-xs font-bold text-blue-800 dark:text-blue-300 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Smart Financial Calculators & Client-Side PDF Toolkit</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-3xl mx-auto leading-[1.15]">
            India’s All-in-One <span className="text-blue-600 dark:text-blue-400">FinTech & PDF</span> Platform
          </h1>

          {/* Subheading */}
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Calculate Home & Car Loan EMIs, SIP Returns, Income Tax (New vs Old Regime), Land & Unit conversions, and merge/compress PDFs directly in your browser. 100% private, instant, and free.
          </p>

          {/* Quick Search Bar */}
          <div className="max-w-xl mx-auto pt-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300/80 dark:border-slate-700/80 hover:border-blue-500 dark:hover:border-blue-500 text-slate-400 dark:text-slate-500 shadow-lg shadow-slate-200/50 dark:shadow-none transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300">
                  Search any calculator, tax tool, or PDF utility...
                </span>
              </div>
              <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Quick Trending Pill Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-medium">
            <span className="text-slate-400">Popular Tools:</span>
            <Link
              href="/calculators/emi-calculator"
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition-colors"
            >
              Loan EMI
            </Link>
            <Link
              href="/calculators/sip-calculator"
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition-colors"
            >
              SIP Returns
            </Link>
            <Link
              href="/calculators/income-tax-calculator"
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition-colors"
            >
              Income Tax
            </Link>
            <Link
              href="/converters/unit-converter"
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition-colors"
            >
              Land & Unit Converter
            </Link>
            <Link
              href="/pdf/merge-pdf"
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition-colors"
            >
              Merge PDF
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Starred Favorites Section if any */}
        {favoriteTools.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Your Starred Favorites ({favoriteTools.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {favoriteTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  isFav={true}
                  onToggleFav={(e) => handleFavoriteClick(e, tool.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Recently Used Tools if any */}
        {recentTools.length > 0 && favoriteTools.length === 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Recently Used Tools
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  isFav={favoriteIds.includes(tool.id)}
                  onToggleFav={(e) => handleFavoriteClick(e, tool.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Category Navigation Tabs */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                Explore All Tools
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Browse our curated directory of {TOOLS.length} specialized Indian productivity tools
              </p>
            </div>

            <div className="text-xs font-semibold text-slate-400">
              Showing {filteredTools.length} tools
            </div>
          </div>

          {/* Horizontal Scrollable Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === 'all'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
              }`}
            >
              All Tools ({TOOLS.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory('popular')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === 'popular'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
              }`}
            >
              🔥 Most Popular
            </button>

            {TOOL_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                {cat.label} ({getToolsByCategory(cat.id).length})
              </button>
            ))}
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {filteredTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                isFav={favoriteIds.includes(tool.id)}
                onToggleFav={(e) => handleFavoriteClick(e, tool.id)}
              />
            ))}
          </div>
        </section>

        {/* Value Proposition & Security Section */}
        <section className="pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Why Indians Love FinTools.in
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Built from the ground up for speed, privacy, and statutory accuracy for Indian users.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                100% Private & In-Browser
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                All calculations and PDF modifications run client-side in WebAssembly / JavaScript. Your confidential financial data and sensitive documents never touch external servers.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                AY 2025-26 Tax & Banking Rules
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Updated with latest Union Budget provisions including revised New Tax Regime slabs, Section 87A rebate up to ₹7 Lakhs, and standard home loan reducing balance schedules.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                Zero Ads, Zero Signups
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                No paywalls, intrusive ads, or forced phone number OTP verifications. Open any calculator, run your calculations, and export CSV amortization schedules instantly.
              </p>
            </div>
          </div>
        </section>

        {/* Meet the Founder Section */}
        <FounderSection />
      </main>

      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}

// Tool Card Component
function ToolCard({
  tool,
  isFav,
  onToggleFav,
}: {
  tool: ToolDefinition;
  isFav: boolean;
  onToggleFav: (e: React.MouseEvent) => void;
}) {
  const isPdf = tool.category === 'pdf';

  return (
    <Link
      href={tool.route}
      className={`group relative flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all duration-150 shadow-xs hover:shadow-md ${
        isPdf
          ? 'border-slate-200/80 dark:border-slate-800 hover:border-amber-500/70 dark:hover:border-amber-500/70 hover:shadow-amber-500/5'
          : 'border-slate-200/80 dark:border-slate-800 hover:border-blue-500/80 dark:hover:border-blue-500/80'
      }`}
    >
      <div className="space-y-3">
        {/* Top bar with category badge, PRO badge, and favorite button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {tool.category.replace('-', ' ')}
            </span>

            {/* Premium Pro Badge for PDF tools */}
            {isPdf && (
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-500/15 to-orange-500/15 text-amber-700 dark:text-amber-300 border border-amber-300/80 dark:border-amber-700/60 shadow-2xs">
                <Sparkles className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                <span>PRO</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {tool.badge && !isPdf && (
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                {tool.badge}
              </span>
            )}
            <button
              type="button"
              onClick={onToggleFav}
              className="p-1 rounded-md text-slate-300 dark:text-slate-600 hover:text-amber-500 dark:hover:text-amber-400 transition-colors cursor-pointer"
              aria-label="Star Favorite"
            >
              <Star
                className={`w-4 h-4 ${
                  isFav ? 'text-amber-500 fill-amber-500' : 'text-slate-400'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3
          className={`font-bold text-sm sm:text-base text-slate-900 dark:text-white transition-colors leading-snug ${
            isPdf
              ? 'group-hover:text-amber-600 dark:group-hover:text-amber-400'
              : 'group-hover:text-blue-600 dark:group-hover:text-blue-400'
          }`}
        >
          {tool.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {tool.shortDesc || tool.description}
        </p>

        {/* Enterprise-grade feature tag for PDF */}
        {isPdf && (
          <div className="pt-1 flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-700">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              100% Client-Side Engine
            </span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div
        className={`pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold ${
          isPdf
            ? 'text-amber-600 dark:text-amber-400'
            : 'text-blue-600 dark:text-blue-400'
        }`}
      >
        <span>{isPdf ? 'Launch Pro Tool' : 'Open Tool'}</span>
        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
