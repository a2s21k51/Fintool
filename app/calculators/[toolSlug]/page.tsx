'use client';

import React, { useEffect, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TOOLS, ToolDefinition, getToolsByCategory } from '@/lib/tools-registry';
import { trackRecentTool } from '@/lib/storage';
import { EMIView } from '@/components/calculators/emi-view';
import { SIPView } from '@/components/calculators/sip-view';
import { TaxView } from '@/components/calculators/tax-view';
import { GSTView } from '@/components/calculators/gst-view';
import { DepositsView } from '@/components/calculators/deposits-view';
import { EverydayViews } from '@/components/calculators/everyday-views';
import { ChevronRight, Home, Landmark, ArrowLeft, Star } from 'lucide-react';

interface PageProps {
  params: Promise<{
    toolSlug: string;
  }>;
}

export default function CalculatorPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const toolSlug = resolvedParams.toolSlug;

  // Match tool from registry
  const tool = TOOLS.find(
    (t) => t.id === toolSlug || t.route === `/calculators/${toolSlug}`
  );

  useEffect(() => {
    if (tool) {
      trackRecentTool(tool.id);
    }
  }, [tool]);

  if (!tool) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Calculator Not Found</h1>
        <p className="text-slate-500">The requested calculator could not be found.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Tools</span>
        </Link>
      </div>
    );
  }

  // Related tools from same category
  const relatedTools = getToolsByCategory(tool.category)
    .filter((t) => t.id !== tool.id)
    .slice(0, 3);

  // Render the appropriate calculator view
  const renderCalculator = () => {
    switch (tool.id) {
      case 'emi-calculator':
        return <EMIView initialType="general" />;
      case 'home-loan-emi-calculator':
        return <EMIView initialType="home" />;
      case 'car-loan-emi-calculator':
        return <EMIView initialType="car" />;
      case 'personal-loan-calculator':
        return <EMIView initialType="personal" />;
      case 'loan-prepayment-calculator':
        return <EMIView initialType="prepayment" />;
      case 'flat-vs-reducing-calculator':
        return <EMIView initialType="flat-reducing" />;
      case 'loan-eligibility-calculator':
        return <EMIView initialType="eligibility" />;

      case 'sip-calculator':
        return <SIPView initialMode="sip" />;
      case 'step-up-sip-calculator':
        return <SIPView initialMode="step-up" />;
      case 'lump-sum-calculator':
        return <SIPView initialMode="lump-sum" />;
      case 'swp-calculator':
        return <SIPView initialMode="swp" />;

      case 'income-tax-calculator':
        return <TaxView />;
      case 'gst-calculator':
        return <GSTView />;

      case 'fd-calculator':
        return <DepositsView initialType="fd" />;
      case 'rd-calculator':
        return <DepositsView initialType="rd" />;
      case 'ppf-calculator':
        return <DepositsView initialType="ppf" />;
      case 'compound-interest':
      case 'compound-interest-calculator':
        return <DepositsView initialType="ci" />;
      case 'simple-interest':
      case 'simple-interest-calculator':
        return <DepositsView initialType="si" />;

      case 'goal-planning':
      case 'goal-planning-calculator':
        return <SIPView initialMode="sip" />;
      case 'inflation-calculator':
        return <EverydayViews initialTab="cagr" />;

      case 'percentage-calculator':
        return <EverydayViews initialTab="percentage" />;
      case 'cagr-calculator':
      case 'cagr':
        return <EverydayViews initialTab="cagr" />;
      case 'inhand-salary-calculator':
      case 'salary-calculator':
        return <EverydayViews initialTab="salary" />;
      case 'age-calculator':
        return <EverydayViews initialTab="age" />;
      case 'hra-calculator':
      case 'gratuity-calculator':
      case 'capital-gains-tax':
      case 'capital-gains-tax-calculator':
        return <TaxView />;

      default:
        // Default to EMI, SIP or Deposits if category matches
        if (tool.category === 'loans') return <EMIView />;
        if (tool.category === 'investments') return <SIPView />;
        if (tool.category === 'savings') return <DepositsView />;
        if (tool.category === 'tax') return <TaxView />;
        return <EMIView />;
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors pb-16">
      {/* Breadcrumb Header Bar */}
      <div className="border-b border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Link href="/" className="hover:text-emerald-600 flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            <span className="capitalize">{tool.category.replace('-', ' ')}</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            <span className="text-slate-900 dark:text-white font-semibold">{tool.name}</span>
          </nav>

          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Tools</span>
          </Link>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Tool Title & Headline */}
        <div className="space-y-2 border-b border-slate-200/80 dark:border-slate-800 pb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              {tool.category.toUpperCase().replace('-', ' ')}
            </span>
            {tool.badge && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                {tool.badge}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {tool.name}
          </h1>

          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
            {tool.shortDesc || tool.description}
          </p>
        </div>

        {/* Dynamic Calculator Component */}
        <div className="w-full">{renderCalculator()}</div>

        {/* Related Tools Section */}
        {relatedTools.length > 0 && (
          <section className="pt-10 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Related Calculators & Tools
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedTools.map((rt) => (
                <Link
                  key={rt.id}
                  href={rt.route}
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all shadow-2xs group"
                >
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {rt.category.replace('-', ' ')}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors mt-1">
                    {rt.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                    {rt.shortDesc || rt.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
