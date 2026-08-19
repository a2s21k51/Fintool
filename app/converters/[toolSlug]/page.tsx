'use client';

import React, { useEffect, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TOOLS, ToolDefinition, getToolsByCategory } from '@/lib/tools-registry';
import { trackRecentTool } from '@/lib/storage';
import { ConverterWorkspace } from '@/components/converters/converter-workspace';
import { ChevronRight, Home, ArrowLeft } from 'lucide-react';

interface PageProps {
  params: Promise<{
    toolSlug: string;
  }>;
}

export default function ConverterToolPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const toolSlug = resolvedParams.toolSlug;

  const tool = TOOLS.find(
    (t) => t.id === toolSlug || t.route === `/converters/${toolSlug}`
  );

  useEffect(() => {
    if (tool) {
      trackRecentTool(tool.id);
    }
  }, [tool]);

  if (!tool) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Converter Not Found</h1>
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

  return (
    <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors pb-16">
      {/* Breadcrumb Bar */}
      <div className="border-b border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Link href="/" className="hover:text-emerald-600 flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            <span>Converters</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            <span className="text-slate-900 dark:text-white font-semibold">{tool.name}</span>
          </nav>

          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Tools</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Title */}
        <div className="space-y-2 border-b border-slate-200/80 dark:border-slate-800 pb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              STATIC UNIT CONVERTER
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Mathematical Standard
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {tool.name}
          </h1>

          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
            {tool.shortDesc || tool.description}
          </p>
        </div>

        {/* Converter Workspace */}
        <ConverterWorkspace initialCategory="area" />
      </main>
    </div>
  );
}
