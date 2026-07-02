'use client';

import { useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useApp } from '@/lib/AppContext';

const SESSION_ID =
  (typeof crypto !== 'undefined' && crypto.randomUUID?.()) ||
  Math.random().toString(36).slice(2) + Date.now().toString(36);

export function useAnalytics() {
  const pathname = usePathname();
  const { state } = useApp();
  const lastPath = useRef('');

  const track = useCallback(
    async (
      event_name: string,
      event_data?: Record<string, any>,
    ) => {
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_name,
            event_data: event_data || {},
            page_path: pathname,
            user_id: state.user?.id,
            session_id: SESSION_ID,
          }),
          // Don't block the UI
          keepalive: true,
        });
      } catch {
        /* silently fail — analytics should never break the app */
      }
    },
    [pathname, state.user?.id],
  );

  // Auto-track page views (once per path)
  useEffect(() => {
    if (pathname !== lastPath.current) {
      lastPath.current = pathname;
      track('page_view', { title: document.title });
    }
  }, [pathname, track]);

  return { track };
}
