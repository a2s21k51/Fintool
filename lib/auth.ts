'use client';

import { useSyncExternalStore } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: 'guest';
  joinedAt: string;
  isGuest: boolean;
}

const AUTH_USER_KEY = 'fintools_guest_user';

export const DEFAULT_GUEST_USER: UserProfile = {
  id: 'guest_user',
  name: 'Guest User',
  email: 'guest@fintools.in',
  provider: 'guest',
  joinedAt: '2026-01-01T00:00:00.000Z',
  isGuest: true,
};

let cachedUser: UserProfile | null = null;
let cachedUserRaw: string | null = null;

export function getStoredUser(): UserProfile {
  if (typeof window === 'undefined') return DEFAULT_GUEST_USER;
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) {
      const defaultJson = JSON.stringify(DEFAULT_GUEST_USER);
      localStorage.setItem(AUTH_USER_KEY, defaultJson);
      cachedUserRaw = defaultJson;
      cachedUser = DEFAULT_GUEST_USER;
      return DEFAULT_GUEST_USER;
    }
    if (raw !== cachedUserRaw) {
      cachedUserRaw = raw;
      cachedUser = JSON.parse(raw);
    }
    return cachedUser || DEFAULT_GUEST_USER;
  } catch {
    return DEFAULT_GUEST_USER;
  }
}

export function saveUserSession(user: UserProfile) {
  if (typeof window === 'undefined') return;
  try {
    const serialized = JSON.stringify(user);
    localStorage.setItem(AUTH_USER_KEY, serialized);
    cachedUserRaw = serialized;
    cachedUser = user;
    window.dispatchEvent(new Event('fintools_auth_update'));
  } catch (e) {
    console.error('Failed to save guest session', e);
  }
}

export function loginAsGuest(name = 'Guest User'): UserProfile {
  const user: UserProfile = {
    id: `guest_${Date.now()}`,
    name: name.trim() || 'Guest User',
    email: 'guest@fintools.in',
    provider: 'guest',
    joinedAt: new Date().toISOString(),
    isGuest: true,
  };
  saveUserSession(user);
  return user;
}

export function updateGuestName(name: string): UserProfile {
  const current = getStoredUser();
  const updated: UserProfile = {
    ...current,
    name: name.trim() || 'Guest User',
  };
  saveUserSession(updated);
  return updated;
}

export function resetGuestSession() {
  if (typeof window === 'undefined') return;
  try {
    const defaultJson = JSON.stringify(DEFAULT_GUEST_USER);
    localStorage.setItem(AUTH_USER_KEY, defaultJson);
    cachedUserRaw = defaultJson;
    cachedUser = DEFAULT_GUEST_USER;
    window.dispatchEvent(new Event('fintools_auth_update'));
  } catch (e) {
    console.error('Failed to reset guest session', e);
  }
}

export function clearUserSession() {
  resetGuestSession();
}

function subscribeAuth(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('fintools_auth_update', callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('fintools_auth_update', callback);
    window.removeEventListener('storage', callback);
  };
}

export function useCurrentUser(): UserProfile {
  return useSyncExternalStore(
    subscribeAuth,
    getStoredUser,
    () => DEFAULT_GUEST_USER
  );
}
