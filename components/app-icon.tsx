import React from 'react';
import Image from 'next/image';

interface AppIconProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showGlow?: boolean;
}

export function AppIcon({ size = 'sm', className = '', showGlow = false }: AppIconProps) {
  const sizeMap = {
    xs: 'w-6 h-6 rounded-lg',
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-14 h-14 rounded-2xl',
    xl: 'w-20 h-20 rounded-3xl',
  };

  const iconDimension = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 56,
    xl: 80,
  }[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 overflow-hidden shadow-xs select-none transition-transform group-hover:scale-105 ${sizeMap[size]} ${
        showGlow ? 'ring-2 ring-blue-500/30 dark:ring-blue-400/30 shadow-blue-500/20 shadow-md' : ''
      } ${className}`}
    >
      <Image
        src="/app-icon.jpg"
        alt="FinTools App Icon"
        width={iconDimension}
        height={iconDimension}
        className="w-full h-full object-cover"
        unoptimized
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

export function AppLogo({
  size = 'sm',
  showSubtitle = true,
  className = '',
}: {
  size?: 'xs' | 'sm' | 'md';
  showSubtitle?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2.5 group shrink-0 ${className}`}>
      <AppIcon size={size} showGlow />
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className="font-black text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
            FinTools<span className="text-blue-600 dark:text-blue-400">.in</span>
          </span>
          <span className="text-[9px] font-extrabold px-1.5 py-0.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 text-blue-700 dark:text-blue-300 rounded border border-blue-200/80 dark:border-blue-800 tracking-wider">
            PRO
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-tight mt-0.5 hidden sm:inline">
            Smart Financial & PDF Toolkit
          </span>
        )}
      </div>
    </div>
  );
}
