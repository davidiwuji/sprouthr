'use client';

import React, { createContext, useContext, useReducer, ReactNode, useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';

const IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const IDLE_WARN_MS = 60 * 1000;          // warn 1 minute before
const IDLE_CHECK_INTERVAL_MS = 10 * 1000; // check every 10s

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface AppState {
  currentPage: string;
  toasts: Toast[];
  searchQuery: string;
  searchCategory: string;
  bookmarks: number[];
  user: User | null;
  loading: boolean;
}

type AppAction =
  | { type: 'SET_PAGE'; payload: string }
  | { type: 'ADD_TOAST'; payload: Toast }
  | { type: 'REMOVE_TOAST'; payload: string }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_CATEGORY'; payload: string }
  | { type: 'TOGGLE_BOOKMARK'; payload: number }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AppState = {
  currentPage: 'home',
  toasts: [],
  searchQuery: '',
  searchCategory: 'all',
  bookmarks: [],
  user: null,
  loading: true,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  showToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
  navigateTo: (page: string) => void;
  toggleBookmark: (id: number) => void;
  setSearchQuery: (q: string) => void;
  setSearchCategory: (c: string) => void;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}>({
  state: initialState,
  dispatch: () => {},
  showToast: () => {},
  removeToast: () => {},
  navigateTo: () => {},
  toggleBookmark: () => {},
  setSearchQuery: () => {},
  setSearchCategory: () => {},
  signOut: async () => {},
  refreshSession: async () => {},
});

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, action.payload] };
    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.payload) };
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload };
    case 'SET_CATEGORY':
      return { ...state, searchCategory: action.payload };
    case 'TOGGLE_BOOKMARK':
      return {
        ...state,
        bookmarks: state.bookmarks.includes(action.payload)
          ? state.bookmarks.filter(id => id !== action.payload)
          : [...state.bookmarks, action.payload],
      };
    case 'SET_USER':
      return { ...state, user: action.payload, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const router = useRouter();
  const [initialized, setInitialized] = useState(false);
  const lastActivity = useRef(Date.now());
  const idleWarned = useRef(false);
  const idleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const signOutRef = useRef<() => Promise<void>>();

  useEffect(() => {
    const supabase = createClient();
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      dispatch({ type: 'SET_USER', payload: session?.user ?? null });
      setInitialized(true);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch({ type: 'SET_USER', payload: session?.user ?? null });
    });

    return () => subscription.unsubscribe();
  }, []);

  // ─── Idle session timeout ───
  const resetActivity = useCallback(() => {
    lastActivity.current = Date.now();
    idleWarned.current = false;
  }, []);

  useEffect(() => {
    signOutRef.current = signOut;

    if (!state.user) {
      // User logged out → clear timer
      if (idleTimerRef.current) {
        clearInterval(idleTimerRef.current);
        idleTimerRef.current = null;
      }
      return;
    }

    // Reset activity on mount (user just logged in)
    resetActivity();

    // Listen for user activity events
    const events = ['mousedown', 'keydown', 'touchstart', 'scroll', 'visibilitychange'];
    const handler = () => resetActivity();
    events.forEach(ev => window.addEventListener(ev, handler));

    // Check idle every 10 seconds
    idleTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - lastActivity.current;

      if (elapsed >= IDLE_TIMEOUT_MS) {
        // Timed out — sign out
        if (idleTimerRef.current) clearInterval(idleTimerRef.current);
        signOutRef.current?.();
        showToast('Session expired due to inactivity', 'warning');
      } else if (elapsed >= IDLE_TIMEOUT_MS - IDLE_WARN_MS && !idleWarned.current) {
        // Warn 1 minute before timeout
        idleWarned.current = true;
        showToast('Your session will expire in 1 minute due to inactivity', 'warning');
      }
    }, IDLE_CHECK_INTERVAL_MS);

    return () => {
      if (idleTimerRef.current) {
        clearInterval(idleTimerRef.current);
        idleTimerRef.current = null;
      }
      events.forEach(ev => window.removeEventListener(ev, handler));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.user]);

  const showToast = (message: string, type: Toast['type'] = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2);
    dispatch({ type: 'ADD_TOAST', payload: { id, message, type } });
    setTimeout(() => dispatch({ type: 'REMOVE_TOAST', payload: id }), 4000);
  };

  const removeToast = (id: string) => dispatch({ type: 'REMOVE_TOAST', payload: id });

  const navigateTo = (page: string) => {
    resetActivity(); // navigation = activity
    // If not logged in and trying to access protected routes, redirect to signup
    if (!state.user && ['dashboard', 'employer', 'cv-builder', 'admin'].includes(page)) {
      router.push('/auth/signup');
      return;
    }
    const path = page === 'home' ? '/' : `/${page}`;
    dispatch({ type: 'SET_PAGE', payload: page });
    router.push(path);
  };

  const toggleBookmark = (id: number) => {
    resetActivity();
    if (!state.user) {
      showToast('Please sign in to bookmark opportunities', 'warning');
      router.push('/auth/signup');
      return;
    }
    dispatch({ type: 'TOGGLE_BOOKMARK', payload: id });
  };

  const setSearchQuery = (q: string) => {
    resetActivity();
    dispatch({ type: 'SET_SEARCH', payload: q });
  };
  const setSearchCategory = (c: string) => {
    resetActivity();
    dispatch({ type: 'SET_CATEGORY', payload: c });
  };

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    dispatch({ type: 'SET_USER', payload: null });
    router.push('/');
    showToast('Signed out successfully', 'success');
  };

  const refreshSession = async () => {
    const supabase = createClient();
    // Fetch latest user data from server (not cached)
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      dispatch({ type: 'SET_USER', payload: user });
    } else {
      // Fallback: read from local session
      const { data: { session } } = await supabase.auth.getSession();
      dispatch({ type: 'SET_USER', payload: session?.user ?? null });
    }
  };

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#22c55e] flex items-center justify-center animate-pulse">
            <i className="fas fa-seedling text-white"></i>
          </div>
          <span className="text-sm text-gray-400">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ state, dispatch, showToast, removeToast, navigateTo, toggleBookmark, setSearchQuery, setSearchCategory, signOut, refreshSession }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
