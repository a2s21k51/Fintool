'use client';

import React, { useEffect, use } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TOOLS, ToolDefinition, getToolsByCategory } from '@/lib/tools-registry';
import { trackRecentTool } from '@/lib/storage';
import { ChevronRight, Home, ArrowLeft } from 'lucide-react';

const PDFWorkspace = dynamic(
  () => import('@/components/pdf/pdf-workspace').then((mod) => mod.PDFWorkspace),
  {
    ssr: false,
    loading: () => (
      <div className="p-12 text-center text-sm text-slate-500">
        Loading PDF Workspace...
      </div>
    ),
  }
);

interface PageProps {
  params: Promise<{
    toolSlug: string;
  }>;
}

export default function PDFToolPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const toolSlug = resolvedParams.toolSlug;

  const tool = TOOLS.find(
    (t) => t.id === toolSlug || t.route === `/pdf/${toolSlug}`
  );

  useEffect(() => {
    if (tool) {
      trackRecentTool(tool.id);
    }
  }, [tool]);

  if (!tool) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">PDF Tool Not Found</h1>
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

  const relatedTools = getToolsByCategory('pdf')
    .filter((t) => t.id !== tool.id)
    .slice(0, 3);

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
            <span>PDF Toolkit</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            <span className="text-slate-900 dark:text-white font-semibold">{tool.name}</span>
          </nav>

          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
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
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
              PDF UTILITY
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              100% Client-Side Privacy
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {tool.name}
          </h1>

          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
            {tool.shortDesc || tool.description}
          </p>
        </div>

        {/* PDF Workspace */}
        <PDFWorkspace initialTool={tool.id as any} />

        {/* Related PDF Tools */}
        {relatedTools.length > 0 && (
          <section className="pt-10 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Other PDF Utilities
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedTools.map((rt) => (
                <Link
                  key={rt.id}
                  href={rt.route}
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-500 transition-all shadow-2xs group"
                >
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-rose-600 transition-colors">
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
