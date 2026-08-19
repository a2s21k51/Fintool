'use client';

import React, { createContext, useContext, useEffect, useState, useSyncExternalStore } from 'react';

type Theme = 'dark' | 'light' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'dark' | 'light';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', callback);
  return () => {
    window.removeEventListener('storage', callback);
    mediaQuery.removeEventListener('change', callback);
  };
}

function getStoredSnapshot(): string {
  if (typeof window === 'undefined') return 'light:system';
  try {
    const val = (localStorage.getItem('fintools_theme') as Theme) || 'system';
    const isDark =
      val === 'dark' ? true : val === 'light' ? false : window.matchMedia('(prefers-color-scheme: dark)').matches;
    return `${isDark ? 'dark' : 'light'}:${val}`;
  } catch {
    return 'light:system';
  }
}

function getServerSnapshot(): string {
  return 'light:system';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const snapshot = useSyncExternalStore(subscribe, getStoredSnapshot, getServerSnapshot);
  const [resolvedTheme, activeTheme] = snapshot.split(':') as ['dark' | 'light', Theme];

  useEffect(() => {
    const root = document.documentElement;
    const isDark = resolvedTheme === 'dark';

    if (isDark) {
      root.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [resolvedTheme]);

  const setTheme = (newTheme: Theme) => {
    try {
      localStorage.setItem('fintools_theme', newTheme);
      window.dispatchEvent(new Event('storage'));
    } catch {
      // ignore
    }
  };

  const toggleTheme = () => {
    const next = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: activeTheme,
        resolvedTheme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
