'use client';

import { useSyncExternalStore } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: 'google' | 'facebook';
  joinedAt: string;
}

const AUTH_USER_KEY = 'fintools_auth_user';

let cachedUser: UserProfile | null = null;
let cachedUserRaw: string | null = null;

export function getStoredUser(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (raw !== cachedUserRaw) {
      cachedUserRaw = raw;
      cachedUser = raw ? JSON.parse(raw) : null;
    }
    return cachedUser;
  } catch {
    return null;
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
    console.error('Failed to save auth session', e);
  }
}

export function clearUserSession() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(AUTH_USER_KEY);
    cachedUserRaw = null;
    cachedUser = null;
    window.dispatchEvent(new Event('fintools_auth_update'));
  } catch (e) {
    console.error('Failed to clear auth session', e);
  }
}

export function loginWithGoogle(email = 'ak42@iitbbs.ac.in', name = 'Abhishek Kumar'): UserProfile {
  const user: UserProfile = {
    id: `g_${Date.now()}`,
    name,
    email,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    provider: 'google',
    joinedAt: new Date().toISOString(),
  };
  saveUserSession(user);
  return user;
}

export function loginWithFacebook(name = 'Abhishek Kumar'): UserProfile {
  const user: UserProfile = {
    id: `fb_${Date.now()}`,
    name,
    email: 'user.fb@fintools.in',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
    provider: 'facebook',
    joinedAt: new Date().toISOString(),
  };
  saveUserSession(user);
  return user;
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

export function useCurrentUser(): UserProfile | null {
  return useSyncExternalStore(
    subscribeAuth,
    getStoredUser,
    () => null
  );
}
