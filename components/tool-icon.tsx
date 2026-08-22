import React from 'react';
import {
  Calculator,
  Landmark,
  TrendingUp,
  PiggyBank,
  Receipt,
  FileText,
  ArrowLeftRight,
  Home,
  CreditCard,
  Percent,
  Layers,
  Scale,
  Calendar,
  Zap,
  Lock,
  Scissors,
  RotateCw,
  FileSpreadsheet,
  FileCheck,
  FileCode,
  Image as ImageIcon,
  Wallet,
  Sparkles,
} from 'lucide-react';

interface ToolIconProps {
  name?: string;
  category?: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Calculator,
  Landmark,
  TrendingUp,
  PiggyBank,
  Receipt,
  FileText,
  ArrowLeftRight,
  Home,
  CreditCard,
  Percent,
  Layers,
  Scale,
  Calendar,
  Zap,
  Lock,
  Scissors,
  RotateCw,
  FileSpreadsheet,
  FileCheck,
  FileCode,
  ImageIcon,
  Wallet,
  Sparkles,
};

export function ToolIcon({ name, category = 'everyday', className = '', size = 'sm' }: ToolIconProps) {
  const IconComponent = (name && ICON_MAP[name]) ? ICON_MAP[name] : (
    category === 'pdf' ? FileText :
    category === 'loans' ? Landmark :
    category === 'investments' ? TrendingUp :
    category === 'savings' ? PiggyBank :
    category === 'tax' ? Receipt :
    category === 'converters' ? ArrowLeftRight :
    Calculator
  );

  const sizeClass = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }[size];

  const containerSize = {
    xs: 'w-6 h-6 rounded-lg',
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-12 h-12 rounded-2xl',
  }[size];

  const categoryTheme = {
    pdf: 'bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400 border border-red-200/60 dark:border-red-900/40',
    loans: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/40',
    investments: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/40',
    savings: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/40',
    tax: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-900/40',
    converters: 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 border border-purple-200/60 dark:border-purple-900/40',
    everyday: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700',
  }[category] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700';

  return (
    <div className={`inline-flex items-center justify-center shrink-0 shadow-2xs ${containerSize} ${categoryTheme} ${className}`}>
      <IconComponent className={sizeClass} />
    </div>
  );
}
