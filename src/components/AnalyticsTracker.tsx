'use client';

import { useAnalytics } from '@/hooks/useAnalytics';

/**
 * Invisible component that activates the analytics page-view tracking.
 * Must be placed inside <AppProvider>.
 */
export default function AnalyticsTracker() {
  useAnalytics(); // activates auto page-view tracking
  return null;
}
