'use client';

import { useSyncExternalStore } from 'react';

const RECENT_TOOLS_KEY = 'fintools_recent_tools';
const FAVORITES_KEY = 'fintools_favorite_tools';

let cachedFavorites: string[] = [];
let cachedFavoritesRaw: string | null = null;

let cachedRecentTools: string[] = [];
let cachedRecentRaw: string | null = null;

const EMPTY_ARRAY: string[] = [];

export function getRecentTools(): string[] {
  if (typeof window === 'undefined') return EMPTY_ARRAY;
  try {
    const raw = localStorage.getItem(RECENT_TOOLS_KEY);
    if (raw !== cachedRecentRaw) {
      cachedRecentRaw = raw;
      cachedRecentTools = raw ? JSON.parse(raw) : EMPTY_ARRAY;
    }
    return cachedRecentTools;
  } catch {
    return EMPTY_ARRAY;
  }
}

export function addRecentTool(toolId: string) {
  if (typeof window === 'undefined' || !toolId) return;
  try {
    const current = getRecentTools();
    const filtered = current.filter((id) => id !== toolId);
    const updated = [toolId, ...filtered].slice(0, 8);
    const serialized = JSON.stringify(updated);
    localStorage.setItem(RECENT_TOOLS_KEY, serialized);
    cachedRecentRaw = serialized;
    cachedRecentTools = updated;
    window.dispatchEvent(new Event('fintools_storage_update'));
  } catch (e) {
    console.error('Failed to save recent tool', e);
  }
}

export function clearRecentTools() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(RECENT_TOOLS_KEY);
    cachedRecentRaw = null;
    cachedRecentTools = EMPTY_ARRAY;
    window.dispatchEvent(new Event('fintools_storage_update'));
  } catch (e) {
    console.error('Failed to clear recent tools', e);
  }
}

export function getFavorites(): string[] {
  if (typeof window === 'undefined') return EMPTY_ARRAY;
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (raw !== cachedFavoritesRaw) {
      cachedFavoritesRaw = raw;
      cachedFavorites = raw ? JSON.parse(raw) : EMPTY_ARRAY;
    }
    return cachedFavorites;
  } catch {
    return EMPTY_ARRAY;
  }
}

export function toggleFavorite(toolId: string): boolean {
  if (typeof window === 'undefined' || !toolId) return false;
  try {
    const current = getFavorites();
    let updated: string[];
    let isNowFavorite = false;
    if (current.includes(toolId)) {
      updated = current.filter((id) => id !== toolId);
      isNowFavorite = false;
    } else {
      updated = [toolId, ...current];
      isNowFavorite = true;
    }
    const serialized = JSON.stringify(updated);
    localStorage.setItem(FAVORITES_KEY, serialized);
    cachedFavoritesRaw = serialized;
    cachedFavorites = updated;
    window.dispatchEvent(new Event('fintools_storage_update'));
    return isNowFavorite;
  } catch (e) {
    console.error('Failed to toggle favorite', e);
    return false;
  }
}

export function isFavorite(toolId: string): boolean {
  if (typeof window === 'undefined' || !toolId) return false;
  return getFavorites().includes(toolId);
}

export const trackRecentTool = addRecentTool;

function subscribeStorage(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('fintools_storage_update', callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('fintools_storage_update', callback);
    window.removeEventListener('storage', callback);
  };
}

export function useFavorites(): string[] {
  return useSyncExternalStore(
    subscribeStorage,
    getFavorites,
    () => EMPTY_ARRAY
  );
}

export function useRecentTools(): string[] {
  return useSyncExternalStore(
    subscribeStorage,
    getRecentTools,
    () => EMPTY_ARRAY
  );
}
